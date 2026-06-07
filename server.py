from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
import hashlib
import hmac
import json
import os
import secrets
import sqlite3
from datetime import date
from pathlib import Path


ROOT = Path(__file__).resolve().parent
DB_PATH = Path(os.environ.get("RUNNERS_LEAGUE_DB", ROOT / "runners_league.db"))
CURRENT_YEAR = date.today().year


DEFAULT_RUNNERS = ["João Silva", "Mariana Costa", "Rui Martins"]
DEFAULT_RUNNER_PASSWORD = "runner123"
DEFAULT_ADMIN_PASSWORD = "admin123"
DEFAULT_SUBMISSIONS = [
    {
        "runner": "Mariana Costa",
        "raceName": "10K São Silvestre",
        "officialUrl": "https://example.com/classificacao-10k-sao-silvestre",
        "seasonYear": CURRENT_YEAR,
        "distanceKm": 10,
        "totalSeconds": 2440,
        "rank": 64,
        "finishers": 2800,
        "elevation": 90,
        "competition": 1.06,
        "terrain": 1,
        "verified": True,
    },
    {
        "runner": "Rui Martins",
        "raceName": "Trail Serra Curta",
        "officialUrl": "https://example.com/classificacao-trail-serra-curta",
        "seasonYear": CURRENT_YEAR,
        "distanceKm": 15,
        "totalSeconds": 5435,
        "rank": 28,
        "finishers": 740,
        "elevation": 640,
        "competition": 1.12,
        "terrain": 1.12,
        "verified": True,
    },
    {
        "runner": "João Silva",
        "raceName": "Meia Maratona de Lisboa",
        "officialUrl": "https://example.com/classificacao-meia-maratona-lisboa",
        "seasonYear": CURRENT_YEAR,
        "distanceKm": 21.0975,
        "totalSeconds": 5568,
        "rank": 185,
        "finishers": 5420,
        "elevation": 180,
        "competition": 1.12,
        "terrain": 1,
        "verified": True,
    },
]


def connect():
    connection = sqlite3.connect(DB_PATH)
    connection.row_factory = sqlite3.Row
    return connection


def init_db():
    with connect() as connection:
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS runners (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL UNIQUE,
                created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
            )
            """
        )
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS submissions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                runner_id INTEGER NOT NULL,
                race_name TEXT NOT NULL,
                distance_km REAL NOT NULL,
                total_seconds INTEGER NOT NULL,
                rank INTEGER NOT NULL,
                finishers INTEGER NOT NULL,
                elevation REAL NOT NULL,
                competition REAL NOT NULL,
                terrain REAL NOT NULL,
                verified INTEGER NOT NULL DEFAULT 0,
                created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (runner_id) REFERENCES runners(id)
            )
            """
        )
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                runner_id INTEGER,
                name TEXT NOT NULL UNIQUE,
                role TEXT NOT NULL CHECK (role IN ('runner', 'general')),
                password_hash TEXT NOT NULL,
                created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (runner_id) REFERENCES runners(id)
            )
            """
        )
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS sessions (
                token TEXT PRIMARY KEY,
                user_id INTEGER NOT NULL,
                created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id)
            )
            """
        )
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS password_reset_requests (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                runner_id INTEGER NOT NULL,
                status TEXT NOT NULL DEFAULT 'pending',
                requested_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                resolved_at TEXT,
                FOREIGN KEY (runner_id) REFERENCES runners(id)
            )
            """
        )
        ensure_column(connection, "submissions", "official_url", "TEXT NOT NULL DEFAULT ''")
        ensure_column(connection, "submissions", "validation_status", "TEXT NOT NULL DEFAULT 'pending'")
        ensure_column(connection, "submissions", "season_year", f"INTEGER NOT NULL DEFAULT {CURRENT_YEAR}")
        connection.execute(
            """
            UPDATE submissions
            SET validation_status = 'approved'
            WHERE verified = 1 AND validation_status = 'pending'
            """
        )

        for runner in DEFAULT_RUNNERS:
            connection.execute("INSERT OR IGNORE INTO runners (name) VALUES (?)", (runner,))
            runner_id = runner_id_for(connection, runner)
            connection.execute(
                """
                INSERT OR IGNORE INTO users (runner_id, name, role, password_hash)
                VALUES (?, ?, 'runner', ?)
                """,
                (runner_id, runner, hash_password(DEFAULT_RUNNER_PASSWORD)),
            )

        connection.execute(
            """
            INSERT OR IGNORE INTO users (runner_id, name, role, password_hash)
            VALUES (NULL, 'Liga Geral', 'general', ?)
            """,
            (hash_password(DEFAULT_ADMIN_PASSWORD),),
        )

        count = connection.execute("SELECT COUNT(*) FROM submissions").fetchone()[0]
        if count == 0:
            for submission in DEFAULT_SUBMISSIONS:
                runner_id = runner_id_for(connection, submission["runner"])
                insert_submission(connection, runner_id, submission)


def runner_id_for(connection, name):
    connection.execute("INSERT OR IGNORE INTO runners (name) VALUES (?)", (name,))
    row = connection.execute("SELECT id FROM runners WHERE name = ?", (name,)).fetchone()
    return row["id"]


def ensure_column(connection, table, column, definition):
    columns = [row["name"] for row in connection.execute(f"PRAGMA table_info({table})")]
    if column not in columns:
        connection.execute(f"ALTER TABLE {table} ADD COLUMN {column} {definition}")


def hash_password(password, salt=None):
    salt = salt or secrets.token_hex(16)
    digest = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt.encode("utf-8"), 180000)
    return f"pbkdf2_sha256${salt}${digest.hex()}"


def verify_password(password, stored_hash):
    try:
        algorithm, salt, expected = stored_hash.split("$", 2)
    except ValueError:
        return False
    if algorithm != "pbkdf2_sha256":
        return False
    actual = hash_password(password, salt).split("$", 2)[2]
    return hmac.compare_digest(actual, expected)


def login_user(payload):
    role = payload.get("type")
    password = payload.get("password", "")
    name = "Liga Geral" if role == "general" else payload.get("name")
    if role not in ("runner", "general") or not name or not password:
        raise ValueError("Credenciais incompletas")

    with connect() as connection:
        user = connection.execute(
            "SELECT id, name, role, password_hash FROM users WHERE name = ? AND role = ?",
            (name, role),
        ).fetchone()
        if user is None or not verify_password(password, user["password_hash"]):
            raise ValueError("Credenciais inválidas")

        token = secrets.token_urlsafe(32)
        connection.execute("INSERT INTO sessions (token, user_id) VALUES (?, ?)", (token, user["id"]))

    return {"token": token, "name": user["name"], "type": user["role"]}


def session_for_token(token):
    if not token:
        return None
    with connect() as connection:
        return connection.execute(
            """
            SELECT users.id, users.name, users.role
            FROM sessions
            JOIN users ON users.id = sessions.user_id
            WHERE sessions.token = ?
            """,
            (token,),
        ).fetchone()


def delete_session(token):
    if not token:
        return
    with connect() as connection:
        connection.execute("DELETE FROM sessions WHERE token = ?", (token,))


def insert_submission(connection, runner_id, submission):
    cursor = connection.execute(
        """
        INSERT INTO submissions (
            runner_id,
            race_name,
            distance_km,
            total_seconds,
            rank,
            finishers,
            elevation,
            competition,
            terrain,
            verified,
            official_url,
            validation_status,
            season_year
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (
            runner_id,
            submission["raceName"],
            submission["distanceKm"],
            submission["totalSeconds"],
            submission["rank"],
            submission["finishers"],
            submission["elevation"],
            submission["competition"],
            submission["terrain"],
            1 if submission["verified"] else 0,
            submission.get("officialUrl", ""),
            submission.get("validationStatus", "approved" if submission.get("verified") else "pending"),
            int(submission.get("seasonYear", CURRENT_YEAR)),
        ),
    )
    return cursor.lastrowid


def fetch_profiles():
    with connect() as connection:
        rows = connection.execute("SELECT name FROM runners ORDER BY name").fetchall()
    return [row["name"] for row in rows]


def fetch_runner_accounts():
    with connect() as connection:
        rows = connection.execute(
            """
            SELECT
                runners.id,
                runners.name,
                runners.created_at AS createdAt,
                COUNT(submissions.id) AS submissions
            FROM runners
            LEFT JOIN submissions ON submissions.runner_id = runners.id
            GROUP BY runners.id, runners.name, runners.created_at
            ORDER BY runners.name
            """
        ).fetchall()
    return [dict(row) for row in rows]


def fetch_password_reset_requests(user):
    if user["role"] != "general":
        raise PermissionError("Só o acesso geral pode ver pedidos de recuperação")
    with connect() as connection:
        rows = connection.execute(
            """
            SELECT
                password_reset_requests.id,
                runners.name AS runner,
                password_reset_requests.status,
                password_reset_requests.requested_at AS requestedAt,
                password_reset_requests.resolved_at AS resolvedAt
            FROM password_reset_requests
            JOIN runners ON runners.id = password_reset_requests.runner_id
            ORDER BY
                CASE password_reset_requests.status WHEN 'pending' THEN 0 ELSE 1 END,
                password_reset_requests.requested_at DESC,
                password_reset_requests.id DESC
            LIMIT 50
            """
        ).fetchall()
    return [dict(row) for row in rows]


def fetch_submissions():
    with connect() as connection:
        rows = connection.execute(
            """
            SELECT
                submissions.id,
                runners.name AS runner,
                submissions.race_name AS raceName,
                submissions.distance_km AS distanceKm,
                submissions.total_seconds AS totalSeconds,
                submissions.rank,
                submissions.finishers,
                submissions.elevation,
                submissions.competition,
                submissions.terrain,
                submissions.verified,
                submissions.official_url AS officialUrl,
                submissions.validation_status AS validationStatus,
                submissions.season_year AS seasonYear,
                submissions.created_at AS createdAt
            FROM submissions
            JOIN runners ON runners.id = submissions.runner_id
            ORDER BY submissions.created_at DESC, submissions.id DESC
            """
        ).fetchall()
    return [dict(row) | {"verified": bool(row["verified"])} for row in rows]


def create_submission(submission, user):
    required = [
        "runner",
        "raceName",
        "distanceKm",
        "totalSeconds",
        "rank",
        "finishers",
        "elevation",
        "competition",
        "terrain",
        "officialUrl",
        "seasonYear",
    ]
    if any(key not in submission for key in required):
        raise ValueError("Submissão incompleta")
    if submission["rank"] > submission["finishers"]:
        raise ValueError("A classificação não pode ser superior ao número de finalistas")
    if not submission.get("officialUrl", "").strip():
        raise ValueError("É obrigatório indicar o link da classificação oficial")
    if user["role"] == "runner":
        submission["runner"] = user["name"]
    if user["role"] != "runner":
        raise PermissionError("Só atletas podem submeter provas")

    with connect() as connection:
        runner_id = runner_id_for(connection, submission["runner"])
        submission["verified"] = False
        submission["validationStatus"] = "pending"
        insert_submission(connection, runner_id, submission)
    return fetch_submissions()


def clear_submissions(user):
    if user["role"] != "general":
        raise PermissionError("Só o acesso geral pode limpar submissões")
    with connect() as connection:
        connection.execute("DELETE FROM submissions")
    return []


def update_submission(payload, user):
    if user["role"] != "general":
        raise PermissionError("Só o acesso geral pode editar provas")
    submission_id = payload.get("id")
    required = [
        "raceName",
        "officialUrl",
        "distanceKm",
        "totalSeconds",
        "rank",
        "finishers",
        "elevation",
        "seasonYear",
    ]
    if any(key not in payload for key in required):
        raise ValueError("Dados da prova incompletos")
    if payload["rank"] > payload["finishers"]:
        raise ValueError("A classificação não pode ser superior ao número de finalistas")

    with connect() as connection:
        existing = connection.execute("SELECT id FROM submissions WHERE id = ?", (submission_id,)).fetchone()
        if existing is None:
            raise ValueError("Submissão não encontrada")
        connection.execute(
            """
            UPDATE submissions
            SET race_name = ?,
                official_url = ?,
                distance_km = ?,
                total_seconds = ?,
                rank = ?,
                finishers = ?,
                elevation = ?,
                season_year = ?
            WHERE id = ?
            """,
            (
                payload["raceName"],
                payload["officialUrl"],
                payload["distanceKm"],
                payload["totalSeconds"],
                payload["rank"],
                payload["finishers"],
                payload["elevation"],
                payload["seasonYear"],
                submission_id,
            ),
        )
    return fetch_submissions()


def delete_submission(payload, user):
    if user["role"] != "general":
        raise PermissionError("Só o acesso geral pode apagar provas")
    submission_id = payload.get("id")
    with connect() as connection:
        connection.execute("DELETE FROM submissions WHERE id = ?", (submission_id,))
    return fetch_submissions()


def create_runner_account(payload, user):
    if user["role"] != "general":
        raise PermissionError("Só o acesso geral pode criar atletas")
    name = payload.get("name", "").strip()
    password = payload.get("password", "")
    if len(name) < 2:
        raise ValueError("Nome do atleta demasiado curto")
    if len(password) < 6:
        raise ValueError("A password deve ter pelo menos 6 caracteres")

    with connect() as connection:
        runner_id = runner_id_for(connection, name)
        connection.execute(
            """
            INSERT INTO users (runner_id, name, role, password_hash)
            VALUES (?, ?, 'runner', ?)
            ON CONFLICT(name) DO UPDATE SET
                runner_id = excluded.runner_id,
                role = 'runner',
                password_hash = excluded.password_hash
            """,
            (runner_id, name, hash_password(password)),
        )
    return {"profiles": fetch_profiles(), "runners": fetch_runner_accounts()}


def update_runner_password(payload, user):
    if user["role"] != "general":
        raise PermissionError("Só o acesso geral pode alterar passwords")
    name = payload.get("name", "").strip()
    password = payload.get("password", "")
    if len(password) < 6:
        raise ValueError("A password deve ter pelo menos 6 caracteres")

    with connect() as connection:
        existing = connection.execute(
            "SELECT id FROM users WHERE name = ? AND role = 'runner'",
            (name,),
        ).fetchone()
        if existing is None:
            raise ValueError("Atleta não encontrado")
        connection.execute(
            "UPDATE users SET password_hash = ? WHERE id = ?",
            (hash_password(password), existing["id"]),
        )
    return {"profiles": fetch_profiles(), "runners": fetch_runner_accounts()}


def update_session_password(payload, user):
    current_password = payload.get("currentPassword", "")
    new_password = payload.get("newPassword", "")
    if len(new_password) < 6:
        raise ValueError("A nova password deve ter pelo menos 6 caracteres")

    with connect() as connection:
        existing = connection.execute(
            "SELECT id, password_hash FROM users WHERE id = ?",
            (user["id"],),
        ).fetchone()
        if existing is None or not verify_password(current_password, existing["password_hash"]):
            raise ValueError("Password atual incorreta")
        connection.execute(
            "UPDATE users SET password_hash = ? WHERE id = ?",
            (hash_password(new_password), existing["id"]),
        )
    return {"message": "Password do acesso geral atualizada."}


def request_password_reset(payload):
    name = payload.get("name", "").strip()
    if len(name) < 2:
        raise ValueError("Indica o atleta que precisa de recuperar a password")

    with connect() as connection:
        runner = connection.execute(
            """
            SELECT runners.id
            FROM runners
            JOIN users ON users.runner_id = runners.id
            WHERE runners.name = ? AND users.role = 'runner'
            """,
            (name,),
        ).fetchone()
        if runner is None:
            raise ValueError("Atleta não encontrado")

        pending = connection.execute(
            """
            SELECT id
            FROM password_reset_requests
            WHERE runner_id = ? AND status = 'pending'
            """,
            (runner["id"],),
        ).fetchone()
        if pending is None:
            connection.execute(
                """
                INSERT INTO password_reset_requests (runner_id, status)
                VALUES (?, 'pending')
                """,
                (runner["id"],),
            )

    return {"message": "Pedido registado. O acesso geral pode agora definir uma nova password."}


def resolve_password_reset(payload, user):
    if user["role"] != "general":
        raise PermissionError("Só o acesso geral pode resolver pedidos de recuperação")
    request_id = payload.get("id")
    password = payload.get("password", "")
    if len(password) < 6:
        raise ValueError("A password deve ter pelo menos 6 caracteres")

    with connect() as connection:
        request = connection.execute(
            """
            SELECT
                password_reset_requests.id,
                users.id AS user_id
            FROM password_reset_requests
            JOIN runners ON runners.id = password_reset_requests.runner_id
            JOIN users ON users.runner_id = runners.id AND users.role = 'runner'
            WHERE password_reset_requests.id = ? AND password_reset_requests.status = 'pending'
            """,
            (request_id,),
        ).fetchone()
        if request is None:
            raise ValueError("Pedido de recuperação não encontrado")

        connection.execute(
            "UPDATE users SET password_hash = ? WHERE id = ?",
            (hash_password(password), request["user_id"]),
        )
        connection.execute("DELETE FROM sessions WHERE user_id = ?", (request["user_id"],))
        connection.execute(
            """
            UPDATE password_reset_requests
            SET status = 'resolved',
                resolved_at = CURRENT_TIMESTAMP
            WHERE id = ?
            """,
            (request_id,),
        )

    return {"requests": fetch_password_reset_requests(user)}


def update_submission_validation(payload, user):
    if user["role"] != "general":
        raise PermissionError("Só o acesso geral pode validar provas")
    submission_id = payload.get("id")
    status = payload.get("status")
    if status not in ("approved", "rejected", "pending"):
        raise ValueError("Estado de validação inválido")

    with connect() as connection:
        existing = connection.execute("SELECT id FROM submissions WHERE id = ?", (submission_id,)).fetchone()
        if existing is None:
            raise ValueError("Submissão não encontrada")
        connection.execute(
            "UPDATE submissions SET validation_status = ?, verified = ? WHERE id = ?",
            (status, 1 if status == "approved" else 0, submission_id),
        )
    return fetch_submissions()


class RunnersLeagueHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def send_json(self, payload, status=200):
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def read_json(self):
        length = int(self.headers.get("Content-Length", "0"))
        if length == 0:
            return {}
        return json.loads(self.rfile.read(length).decode("utf-8"))

    def auth_user(self):
        header = self.headers.get("Authorization", "")
        prefix = "Bearer "
        token = header[len(prefix) :] if header.startswith(prefix) else ""
        return session_for_token(token)

    def require_auth(self):
        user = self.auth_user()
        if user is None:
            self.send_json({"error": "Sessão inválida ou expirada"}, status=401)
        return user

    def do_GET(self):
        if self.path == "/api/profiles":
            self.send_json({"profiles": fetch_profiles()})
            return
        if self.path == "/api/runners":
            user = self.require_auth()
            if user is None:
                return
            if user["role"] != "general":
                self.send_json({"error": "Só o acesso geral pode ver atletas"}, status=403)
                return
            self.send_json({"runners": fetch_runner_accounts()})
            return
        if self.path == "/api/password-reset/requests":
            user = self.require_auth()
            if user is None:
                return
            try:
                self.send_json({"requests": fetch_password_reset_requests(user)})
            except PermissionError as error:
                self.send_json({"error": str(error)}, status=403)
            return
        if self.path == "/api/submissions":
            self.send_json({"submissions": fetch_submissions()})
            return
        super().do_GET()

    def do_POST(self):
        if self.path == "/api/login":
            try:
                self.send_json({"session": login_user(self.read_json())})
            except ValueError as error:
                self.send_json({"error": str(error)}, status=401)
            return
        if self.path == "/api/logout":
            header = self.headers.get("Authorization", "")
            token = header.removeprefix("Bearer ") if header.startswith("Bearer ") else ""
            delete_session(token)
            self.send_json({"ok": True})
            return
        if self.path == "/api/password-reset/request":
            try:
                self.send_json(request_password_reset(self.read_json()), status=201)
            except ValueError as error:
                self.send_json({"error": str(error)}, status=400)
            return
        if self.path == "/api/password-reset/resolve":
            user = self.require_auth()
            if user is None:
                return
            try:
                self.send_json(resolve_password_reset(self.read_json(), user))
            except ValueError as error:
                self.send_json({"error": str(error)}, status=400)
            except PermissionError as error:
                self.send_json({"error": str(error)}, status=403)
            return
        if self.path == "/api/runners":
            user = self.require_auth()
            if user is None:
                return
            try:
                self.send_json(create_runner_account(self.read_json(), user), status=201)
            except ValueError as error:
                self.send_json({"error": str(error)}, status=400)
            except PermissionError as error:
                self.send_json({"error": str(error)}, status=403)
            return
        if self.path == "/api/runners/password":
            user = self.require_auth()
            if user is None:
                return
            try:
                self.send_json(update_runner_password(self.read_json(), user))
            except ValueError as error:
                self.send_json({"error": str(error)}, status=400)
            except PermissionError as error:
                self.send_json({"error": str(error)}, status=403)
            return
        if self.path == "/api/session/password":
            user = self.require_auth()
            if user is None:
                return
            try:
                self.send_json(update_session_password(self.read_json(), user))
            except ValueError as error:
                self.send_json({"error": str(error)}, status=400)
            return
        if self.path == "/api/submissions/validation":
            user = self.require_auth()
            if user is None:
                return
            try:
                submissions = update_submission_validation(self.read_json(), user)
                self.send_json({"submissions": submissions})
            except ValueError as error:
                self.send_json({"error": str(error)}, status=400)
            except PermissionError as error:
                self.send_json({"error": str(error)}, status=403)
            return
        if self.path == "/api/submissions/update":
            user = self.require_auth()
            if user is None:
                return
            try:
                submissions = update_submission(self.read_json(), user)
                self.send_json({"submissions": submissions})
            except ValueError as error:
                self.send_json({"error": str(error)}, status=400)
            except PermissionError as error:
                self.send_json({"error": str(error)}, status=403)
            return
        if self.path == "/api/submissions/delete":
            user = self.require_auth()
            if user is None:
                return
            try:
                submissions = delete_submission(self.read_json(), user)
                self.send_json({"submissions": submissions})
            except PermissionError as error:
                self.send_json({"error": str(error)}, status=403)
            return
        if self.path != "/api/submissions":
            self.send_error(404)
            return
        user = self.require_auth()
        if user is None:
            return
        try:
            submissions = create_submission(self.read_json(), user)
            self.send_json({"submissions": submissions}, status=201)
        except ValueError as error:
            self.send_json({"error": str(error)}, status=400)
        except PermissionError as error:
            self.send_json({"error": str(error)}, status=403)

    def do_DELETE(self):
        if self.path != "/api/submissions":
            self.send_error(404)
            return
        user = self.require_auth()
        if user is None:
            return
        try:
            self.send_json({"submissions": clear_submissions(user)})
        except PermissionError as error:
            self.send_json({"error": str(error)}, status=403)


if __name__ == "__main__":
    init_db()
    port = int(os.environ.get("PORT", "4173"))
    host = os.environ.get("HOST", "127.0.0.1")
    server = ThreadingHTTPServer((host, port), RunnersLeagueHandler)
    print(f"Runners League em http://{host}:{port}")
    server.serve_forever()
