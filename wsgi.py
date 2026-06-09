import json
import mimetypes
from pathlib import Path

from server import (
    ROOT,
    clear_submissions,
    create_runner_account,
    create_submission,
    delete_session,
    delete_submission,
    fetch_password_reset_requests,
    fetch_profiles,
    fetch_runner_accounts,
    fetch_runner_profiles,
    fetch_submissions,
    fetch_current_runner_profile,
    init_db,
    login_user,
    register_runner_account,
    request_password_reset,
    resolve_password_reset,
    session_for_token,
    update_current_runner_profile,
    update_runner_password,
    update_session_password,
    update_submission,
    update_submission_validation,
)


def json_response(start_response, payload, status="200 OK"):
    body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
    start_response(
        status,
        [
            ("Content-Type", "application/json; charset=utf-8"),
            ("Content-Length", str(len(body))),
            ("Cache-Control", "no-store"),
        ],
    )
    return [body]


def read_json(environ):
    length = int(environ.get("CONTENT_LENGTH") or "0")
    if length == 0:
        return {}
    return json.loads(environ["wsgi.input"].read(length).decode("utf-8"))


def auth_user(environ):
    header = environ.get("HTTP_AUTHORIZATION", "")
    prefix = "Bearer "
    token = header[len(prefix) :] if header.startswith(prefix) else ""
    return session_for_token(token)


def require_auth(environ, start_response):
    user = auth_user(environ)
    if user is None:
        return None, json_response(start_response, {"error": "Sessão inválida ou expirada"}, "401 Unauthorized")
    return user, None


def route_api(environ, start_response):
    method = environ["REQUEST_METHOD"]
    path = environ.get("PATH_INFO", "")

    try:
        if method == "GET" and path == "/api/profiles":
            return json_response(start_response, {"profiles": fetch_profiles(), "runnerProfiles": fetch_runner_profiles()})

        if method == "GET" and path == "/api/submissions":
            return json_response(start_response, {"submissions": fetch_submissions()})

        if method == "GET" and path == "/api/runners":
            user, error = require_auth(environ, start_response)
            if error:
                return error
            if user["role"] != "general":
                return json_response(start_response, {"error": "Só o acesso geral pode ver atletas"}, "403 Forbidden")
            return json_response(start_response, {"runners": fetch_runner_accounts()})

        if method == "GET" and path == "/api/me":
            user, error = require_auth(environ, start_response)
            if error:
                return error
            return json_response(start_response, {"profile": fetch_current_runner_profile(user)})

        if method == "GET" and path == "/api/password-reset/requests":
            user, error = require_auth(environ, start_response)
            if error:
                return error
            return json_response(start_response, {"requests": fetch_password_reset_requests(user)})

        if method == "POST" and path == "/api/login":
            return json_response(start_response, {"session": login_user(read_json(environ))})

        if method == "POST" and path == "/api/logout":
            header = environ.get("HTTP_AUTHORIZATION", "")
            token = header.removeprefix("Bearer ") if header.startswith("Bearer ") else ""
            delete_session(token)
            return json_response(start_response, {"ok": True})

        if method == "POST" and path == "/api/password-reset/request":
            return json_response(start_response, request_password_reset(read_json(environ)), "201 Created")

        if method == "POST" and path == "/api/register":
            return json_response(start_response, register_runner_account(read_json(environ)), "201 Created")

        if method == "POST" and path == "/api/me":
            user, error = require_auth(environ, start_response)
            if error:
                return error
            return json_response(start_response, update_current_runner_profile(read_json(environ), user))

        if method == "POST" and path == "/api/password-reset/resolve":
            user, error = require_auth(environ, start_response)
            if error:
                return error
            return json_response(start_response, resolve_password_reset(read_json(environ), user))

        if method == "POST" and path == "/api/runners":
            user, error = require_auth(environ, start_response)
            if error:
                return error
            return json_response(start_response, create_runner_account(read_json(environ), user), "201 Created")

        if method == "POST" and path == "/api/runners/password":
            user, error = require_auth(environ, start_response)
            if error:
                return error
            return json_response(start_response, update_runner_password(read_json(environ), user))

        if method == "POST" and path == "/api/session/password":
            user, error = require_auth(environ, start_response)
            if error:
                return error
            return json_response(start_response, update_session_password(read_json(environ), user))

        if method == "POST" and path == "/api/submissions/validation":
            user, error = require_auth(environ, start_response)
            if error:
                return error
            return json_response(start_response, {"submissions": update_submission_validation(read_json(environ), user)})

        if method == "POST" and path == "/api/submissions/update":
            user, error = require_auth(environ, start_response)
            if error:
                return error
            return json_response(start_response, {"submissions": update_submission(read_json(environ), user)})

        if method == "POST" and path == "/api/submissions/delete":
            user, error = require_auth(environ, start_response)
            if error:
                return error
            return json_response(start_response, {"submissions": delete_submission(read_json(environ), user)})

        if method == "POST" and path == "/api/submissions":
            user, error = require_auth(environ, start_response)
            if error:
                return error
            return json_response(start_response, {"submissions": create_submission(read_json(environ), user)}, "201 Created")

        if method == "DELETE" and path == "/api/submissions":
            user, error = require_auth(environ, start_response)
            if error:
                return error
            return json_response(start_response, {"submissions": clear_submissions(user)})

    except ValueError as error:
        return json_response(start_response, {"error": str(error)}, "400 Bad Request")
    except PermissionError as error:
        return json_response(start_response, {"error": str(error)}, "403 Forbidden")

    return json_response(start_response, {"error": "Endpoint não encontrado"}, "404 Not Found")


def static_response(environ, start_response):
    path = environ.get("PATH_INFO", "") or "/"
    relative = "index.html" if path == "/" else path.lstrip("/")
    target = (ROOT / relative).resolve()
    if ROOT not in target.parents and target != ROOT:
        start_response("403 Forbidden", [("Content-Type", "text/plain; charset=utf-8")])
        return [b"Forbidden"]
    if not target.is_file():
        start_response("404 Not Found", [("Content-Type", "text/plain; charset=utf-8")])
        return [b"Not found"]

    body = target.read_bytes()
    content_type = mimetypes.guess_type(str(target))[0] or "application/octet-stream"
    start_response(
        "200 OK",
        [
            ("Content-Type", content_type),
            ("Content-Length", str(len(body))),
            ("Cache-Control", "no-store"),
        ],
    )
    return [body]


def application(environ, start_response):
    init_db()
    if environ.get("PATH_INFO", "").startswith("/api/"):
        return route_api(environ, start_response)
    return static_response(environ, start_response)
