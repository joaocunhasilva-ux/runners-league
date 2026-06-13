from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from email.message import EmailMessage
import hashlib
import hmac
import json
import os
import secrets
import smtplib
import sqlite3
import sys
from datetime import date, datetime, timedelta
from pathlib import Path


ROOT = Path(__file__).resolve().parent
DB_PATH = Path(os.environ.get("RUNNERS_LEAGUE_DB", ROOT / "runners_league.db"))
CURRENT_YEAR = date.today().year


DEFAULT_RUNNERS = ["João Silva", "Mariana Costa", "Rui Martins"]
DEFAULT_RUNNER_PASSWORD = os.environ.get("RUNNERS_LEAGUE_DEFAULT_RUNNER_PASSWORD", "runner123")
DEFAULT_ADMIN_PASSWORD = os.environ.get("RUNNERS_LEAGUE_DEFAULT_ADMIN_PASSWORD", "admin123")
ADMIN_EMAIL = os.environ.get("RUNNERS_LEAGUE_ADMIN_EMAIL", "joaocunhasilva@gmail.com")
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
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
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
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS messages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                sender_user_id INTEGER,
                recipient_user_id INTEGER NOT NULL,
                subject TEXT NOT NULL,
                body TEXT NOT NULL,
                kind TEXT NOT NULL DEFAULT 'direct',
                read_at TEXT,
                created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (sender_user_id) REFERENCES users(id),
                FOREIGN KEY (recipient_user_id) REFERENCES users(id)
            )
            """
        )
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS newsletters (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                month_key TEXT NOT NULL UNIQUE,
                subject TEXT NOT NULL,
                body TEXT NOT NULL,
                recipient_count INTEGER NOT NULL DEFAULT 0,
                email_count INTEGER NOT NULL DEFAULT 0,
                sent_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
            )
            """
        )
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS app_settings (
                key TEXT PRIMARY KEY,
                value TEXT NOT NULL
            )
            """
        )
        ensure_column(connection, "submissions", "official_url", "TEXT NOT NULL DEFAULT ''")
        ensure_column(connection, "submissions", "proof_image", "TEXT NOT NULL DEFAULT ''")
        ensure_column(connection, "submissions", "validation_status", "TEXT NOT NULL DEFAULT 'pending'")
        ensure_column(connection, "submissions", "season_year", f"INTEGER NOT NULL DEFAULT {CURRENT_YEAR}")
        ensure_column(connection, "runners", "photo_url", "TEXT NOT NULL DEFAULT ''")
        ensure_column(connection, "runners", "email", "TEXT NOT NULL DEFAULT ''")
        ensure_column(connection, "runners", "city", "TEXT NOT NULL DEFAULT ''")
        ensure_column(connection, "runners", "country", "TEXT NOT NULL DEFAULT ''")
        ensure_column(connection, "runners", "club", "TEXT NOT NULL DEFAULT ''")
        ensure_column(connection, "runners", "birth_year", "INTEGER")
        ensure_column(connection, "runners", "bio", "TEXT NOT NULL DEFAULT ''")
        ensure_column(connection, "runners", "share_profile", "INTEGER NOT NULL DEFAULT 1")
        connection.execute(
            """
            UPDATE submissions
            SET validation_status = 'approved'
            WHERE verified = 1 AND validation_status = 'pending'
            """
        )

        connection.execute(
            """
            INSERT OR IGNORE INTO users (runner_id, name, role, password_hash)
            VALUES (NULL, 'Liga Geral', 'general', ?)
            """,
            (hash_password(DEFAULT_ADMIN_PASSWORD),),
        )

        demo_seeded = connection.execute("SELECT value FROM app_settings WHERE key = 'demo_seeded'").fetchone()
        runner_count = connection.execute("SELECT COUNT(*) FROM runners").fetchone()[0]
        submission_count = connection.execute("SELECT COUNT(*) FROM submissions").fetchone()[0]
        if demo_seeded is None and runner_count == 0 and submission_count == 0:
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
            for submission in DEFAULT_SUBMISSIONS:
                runner_id = runner_id_for(connection, submission["runner"])
                insert_submission(connection, runner_id, submission)
        if demo_seeded is None:
            connection.execute("INSERT INTO app_settings (key, value) VALUES ('demo_seeded', '1')")


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
            SELECT users.id, users.runner_id, users.name, users.role
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
            proof_image,
            validation_status,
            season_year
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
            proof_image_value(submission),
            submission.get("validationStatus", "approved" if submission.get("verified") else "pending"),
            int(submission.get("seasonYear", CURRENT_YEAR)),
        ),
    )
    return cursor.lastrowid


def fetch_profiles():
    with connect() as connection:
        rows = connection.execute("SELECT name FROM runners ORDER BY name").fetchall()
    return [row["name"] for row in rows]


def runner_profile_payload(row, include_private=False):
    return {
        "id": row["id"],
        "name": row["name"],
        "photoUrl": row["photo_url"],
        "email": row["email"] if include_private else "",
        "city": row["city"],
        "country": row["country"],
        "club": row["club"],
        "birthYear": row["birth_year"],
        "bio": row["bio"],
        "shareProfile": bool(row["share_profile"]),
        "createdAt": row["created_at"],
    }


def photo_value(payload):
    value = payload.get("photoUrl", "").strip()
    if len(value) > 1300000:
        raise ValueError("A imagem é demasiado grande. Usa uma foto com menos de 900 KB.")
    return value


def proof_image_value(payload):
    value = payload.get("proofImage", "").strip()
    if len(value) > 1300000:
        raise ValueError("A imagem do comprovativo é demasiado grande. Usa uma imagem com menos de 900 KB.")
    return value


def fetch_runner_profiles(include_private=False):
    with connect() as connection:
        rows = connection.execute(
            """
            SELECT
                id,
                name,
                photo_url,
                email,
                city,
                country,
                club,
                birth_year,
                bio,
                share_profile,
                created_at
            FROM runners
            ORDER BY name
            """
        ).fetchall()
    return [runner_profile_payload(row, include_private=include_private) for row in rows]


def fetch_current_runner_profile(user):
    if user["role"] != "runner":
        raise PermissionError("Só atletas podem gerir este perfil")
    with connect() as connection:
        row = connection.execute(
            """
            SELECT
                runners.id,
                runners.name,
                runners.photo_url,
                runners.email,
                runners.city,
                runners.country,
                runners.club,
                runners.birth_year,
                runners.bio,
                runners.share_profile,
                runners.created_at
            FROM runners
            JOIN users ON users.runner_id = runners.id
            WHERE users.id = ?
            """,
            (user["id"],),
        ).fetchone()
    if row is None:
        raise ValueError("Atleta não encontrado")
    return runner_profile_payload(row, include_private=True)


def update_current_runner_profile(payload, user):
    if user["role"] != "runner":
        raise PermissionError("Só atletas podem gerir este perfil")
    name = payload.get("name", "").strip()
    birth_year = payload.get("birthYear") or None
    if len(name) < 2:
        raise ValueError("Nome do atleta demasiado curto")
    if birth_year is not None:
        birth_year = int(birth_year)
        if birth_year < 1900 or birth_year > CURRENT_YEAR:
            raise ValueError("Ano de nascimento inválido")

    with connect() as connection:
        current = connection.execute(
            """
            SELECT runners.id, runners.name
            FROM runners
            JOIN users ON users.runner_id = runners.id
            WHERE users.id = ?
            """,
            (user["id"],),
        ).fetchone()
        if current is None:
            raise ValueError("Atleta não encontrado")
        duplicate = connection.execute(
            "SELECT id FROM runners WHERE name = ? AND id != ?",
            (name, current["id"]),
        ).fetchone()
        if duplicate is not None:
            raise ValueError("Já existe um atleta com esse nome")
        connection.execute(
            """
            UPDATE runners
            SET name = ?,
                photo_url = ?,
                email = ?,
                city = ?,
                country = ?,
                club = ?,
                birth_year = ?,
                bio = ?,
                share_profile = ?
            WHERE id = ?
            """,
            (
                name,
                photo_value(payload),
                payload.get("email", "").strip(),
                payload.get("city", "").strip(),
                payload.get("country", "").strip(),
                payload.get("club", "").strip(),
                birth_year,
                payload.get("bio", "").strip(),
                1 if payload.get("shareProfile", True) else 0,
                current["id"],
            ),
        )
        connection.execute("UPDATE users SET name = ? WHERE id = ?", (name, user["id"]))
    updated_user = dict(user) | {"name": name}
    return {
        "profile": fetch_current_runner_profile(updated_user),
        "profiles": fetch_profiles(),
        "runnerProfiles": fetch_runner_profiles(),
        "submissions": fetch_submissions(),
        "message": "Dados do atleta atualizados.",
    }


def fetch_runner_accounts():
    with connect() as connection:
        rows = connection.execute(
            """
            SELECT
                runners.id,
                runners.name,
                runners.photo_url AS photoUrl,
                runners.email,
                runners.city,
                runners.country,
                runners.club,
                runners.birth_year AS birthYear,
                runners.bio,
                runners.share_profile AS shareProfile,
                runners.created_at AS createdAt,
                COUNT(submissions.id) AS submissions
            FROM runners
            LEFT JOIN submissions ON submissions.runner_id = runners.id
            GROUP BY runners.id, runners.name, runners.photo_url, runners.email, runners.city, runners.country, runners.club, runners.birth_year, runners.bio, runners.share_profile, runners.created_at
            ORDER BY runners.name
            """
        ).fetchall()
    return [dict(row) | {"shareProfile": bool(row["shareProfile"])} for row in rows]


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


def message_payload(row):
    return {
        "id": row["id"],
        "sender": row["sender"] or "Sistema",
        "recipient": row["recipient"],
        "subject": row["subject"],
        "body": row["body"],
        "kind": row["kind"],
        "readAt": row["read_at"],
        "createdAt": row["created_at"],
        "direction": row["direction"],
    }


def fetch_messages(user):
    with connect() as connection:
        if user["role"] == "general":
            rows = connection.execute(
                """
                SELECT
                    messages.id,
                    sender.name AS sender,
                    recipient.name AS recipient,
                    messages.subject,
                    messages.body,
                    messages.kind,
                    messages.read_at,
                    messages.created_at,
                    CASE
                        WHEN messages.sender_user_id = ? THEN 'sent'
                        WHEN messages.recipient_user_id = ? THEN 'received'
                        ELSE 'system'
                    END AS direction
                FROM messages
                LEFT JOIN users AS sender ON sender.id = messages.sender_user_id
                JOIN users AS recipient ON recipient.id = messages.recipient_user_id
                ORDER BY messages.created_at DESC, messages.id DESC
                LIMIT 100
                """,
                (user["id"], user["id"]),
            ).fetchall()
        else:
            rows = connection.execute(
                """
                SELECT
                    messages.id,
                    sender.name AS sender,
                    recipient.name AS recipient,
                    messages.subject,
                    messages.body,
                    messages.kind,
                    messages.read_at,
                    messages.created_at,
                    CASE
                        WHEN messages.sender_user_id = ? THEN 'sent'
                        ELSE 'received'
                    END AS direction
                FROM messages
                LEFT JOIN users AS sender ON sender.id = messages.sender_user_id
                JOIN users AS recipient ON recipient.id = messages.recipient_user_id
                WHERE messages.sender_user_id = ? OR messages.recipient_user_id = ?
                ORDER BY messages.created_at DESC, messages.id DESC
                LIMIT 100
                """,
                (user["id"], user["id"], user["id"]),
            ).fetchall()
    return [message_payload(row) for row in rows]


def unread_message_count(user):
    with connect() as connection:
        return connection.execute(
            """
            SELECT COUNT(*)
            FROM messages
            WHERE recipient_user_id = ?
              AND read_at IS NULL
              AND COALESCE(sender_user_id, -1) != ?
            """,
            (user["id"], user["id"]),
        ).fetchone()[0]


def mark_messages_read(user):
    with connect() as connection:
        connection.execute(
            """
            UPDATE messages
            SET read_at = CURRENT_TIMESTAMP
            WHERE recipient_user_id = ?
              AND read_at IS NULL
              AND COALESCE(sender_user_id, -1) != ?
            """,
            (user["id"], user["id"]),
        )
    return {"messages": fetch_messages(user), "unreadCount": unread_message_count(user), "message": "Mensagens marcadas como lidas."}


def fetch_message_recipients(user):
    with connect() as connection:
        rows = connection.execute(
            """
            SELECT name, role
            FROM users
            WHERE id != ?
            ORDER BY CASE role WHEN 'general' THEN 0 ELSE 1 END, name
            """,
            (user["id"],),
        ).fetchall()
    return [dict(row) for row in rows]


def create_message(payload, user):
    recipient_name = payload.get("recipient", "").strip()
    subject = payload.get("subject", "").strip()
    body = payload.get("body", "").strip()
    if len(recipient_name) < 2:
        raise ValueError("Escolhe um destinatário")
    if len(subject) < 2:
        raise ValueError("Indica um assunto")
    if len(body) < 2:
        raise ValueError("Escreve uma mensagem")

    with connect() as connection:
        recipient = connection.execute("SELECT id FROM users WHERE name = ?", (recipient_name,)).fetchone()
        if recipient is None:
            raise ValueError("Destinatário não encontrado")
        connection.execute(
            """
            INSERT INTO messages (sender_user_id, recipient_user_id, subject, body, kind)
            VALUES (?, ?, ?, ?, 'direct')
            """,
            (user["id"], recipient["id"], subject, body),
        )
    return {"messages": fetch_messages(user), "unreadCount": unread_message_count(user), "message": "Mensagem enviada."}


def create_system_message(connection, recipient_user_id, subject, body, sender_user_id=None):
    connection.execute(
        """
        INSERT INTO messages (sender_user_id, recipient_user_id, subject, body, kind)
        VALUES (?, ?, ?, ?, 'system')
        """,
        (sender_user_id, recipient_user_id, subject, body),
    )


def previous_month_key(today=None):
    today = today or date.today()
    first_day = today.replace(day=1)
    previous = first_day - timedelta(days=1)
    return previous.strftime("%Y-%m")


def newsletter_month_label(month_key):
    year, month = month_key.split("-")
    return f"{month}/{year}"


def send_email(recipient_email, subject, body):
    host = os.environ.get("RUNNERS_LEAGUE_SMTP_HOST")
    if not host or not recipient_email:
        return False
    port = int(os.environ.get("RUNNERS_LEAGUE_SMTP_PORT", "587"))
    username = os.environ.get("RUNNERS_LEAGUE_SMTP_USER")
    password = os.environ.get("RUNNERS_LEAGUE_SMTP_PASSWORD")
    sender = os.environ.get("RUNNERS_LEAGUE_SMTP_FROM") or username
    if not sender:
        return False

    message = EmailMessage()
    message["Subject"] = subject
    message["From"] = sender
    message["To"] = recipient_email
    message.set_content(body)

    with smtplib.SMTP(host, port, timeout=20) as smtp:
        smtp.starttls()
        if username and password:
            smtp.login(username, password)
        smtp.send_message(message)
    return True


def send_newsletter_email(recipient, subject, body):
    return send_email(recipient["email"], subject, body)


def notify_admin_new_registration(payload):
    name = payload.get("name", "").strip()
    email = payload.get("email", "").strip() or "Não indicado"
    city = payload.get("city", "").strip() or "Não indicada"
    country = payload.get("country", "").strip() or "Não indicado"
    club = payload.get("club", "").strip() or "Não indicado"
    share_profile = "Sim" if payload.get("shareProfile", True) else "Não"
    subject = f"Runners League · Nova inscrição: {name}"
    body = "\n".join(
        [
            "Nova inscrição na Runners League.",
            "",
            f"Nome: {name}",
            f"Email: {email}",
            f"Cidade: {city}",
            f"País: {country}",
            f"Clube: {club}",
            f"Perfil público: {share_profile}",
            "",
            "Entra no painel geral para validar dados, acompanhar mensagens e gerir o atleta.",
            "https://rljc.pythonanywhere.com",
        ]
    )
    return send_email(ADMIN_EMAIL, subject, body)


def generate_monthly_newsletter(user=None, month_key=None):
    if user is not None and user["role"] != "general":
        raise PermissionError("Só o acesso geral pode enviar newsletters")

    month_key = month_key or previous_month_key()
    subject = f"Runners League · Resultado mensal {newsletter_month_label(month_key)}"

    with connect() as connection:
        existing = connection.execute("SELECT id FROM newsletters WHERE month_key = ?", (month_key,)).fetchone()
        if existing is not None:
            raise ValueError("A newsletter deste mês já foi enviada.")

        rows = connection.execute(
            """
            SELECT
                runners.name,
                COUNT(submissions.id) AS races,
                MIN(submissions.total_seconds * 1.0 / submissions.distance_km) AS best_pace,
                GROUP_CONCAT(submissions.race_name, ', ') AS race_names
            FROM submissions
            JOIN runners ON runners.id = submissions.runner_id
            WHERE submissions.validation_status = 'approved'
              AND strftime('%Y-%m', submissions.created_at) = ?
            GROUP BY runners.id, runners.name
            ORDER BY races DESC, best_pace ASC
            LIMIT 10
            """,
            (month_key,),
        ).fetchall()
        recipients = connection.execute(
            """
            SELECT users.id, users.name, runners.email
            FROM users
            JOIN runners ON runners.id = users.runner_id
            WHERE users.role = 'runner'
            ORDER BY users.name
            """
        ).fetchall()
        admin = connection.execute("SELECT id FROM users WHERE role = 'general' ORDER BY id LIMIT 1").fetchone()

        if rows:
            lines = [f"Resultado mensal da Runners League ({newsletter_month_label(month_key)})", ""]
            for index, row in enumerate(rows, start=1):
                pace = int(row["best_pace"] or 0)
                minutes, seconds = divmod(pace, 60)
                lines.append(f"{index}. {row['name']} · {row['races']} prova(s) aprovadas · melhor ritmo {minutes}:{seconds:02d}/km")
            lines.extend(["", "Continua a submeter provas oficiais e a acompanhar a liga em https://rljc.pythonanywhere.com"])
        else:
            lines = [
                f"Resultado mensal da Runners League ({newsletter_month_label(month_key)})",
                "",
                "Ainda não houve provas aprovadas neste mês.",
                "",
                "Continua a submeter provas oficiais em https://rljc.pythonanywhere.com",
            ]
        body = "\n".join(lines)

        email_count = 0
        for recipient in recipients:
            create_system_message(connection, recipient["id"], subject, body, admin["id"] if admin else None)
            try:
                if send_newsletter_email(recipient, subject, body):
                    email_count += 1
            except Exception:
                pass

        connection.execute(
            """
            INSERT INTO newsletters (month_key, subject, body, recipient_count, email_count)
            VALUES (?, ?, ?, ?, ?)
            """,
            (month_key, subject, body, len(recipients), email_count),
        )

    return {
        "message": "Newsletter enviada.",
        "month": month_key,
        "recipientCount": len(recipients),
        "emailCount": email_count,
        "emailConfigured": bool(os.environ.get("RUNNERS_LEAGUE_SMTP_HOST")),
    }


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
                submissions.proof_image AS proofImage,
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
                proof_image = ?,
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
                proof_image_value(payload),
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


def update_runner_submission(payload, user):
    if user["role"] != "runner":
        raise PermissionError("Só atletas podem editar as suas provas")
    submission_id = payload.get("id")
    required = [
        "raceName",
        "officialUrl",
        "distanceKm",
        "totalSeconds",
        "rank",
        "finishers",
        "elevation",
        "competition",
        "terrain",
        "seasonYear",
    ]
    if any(key not in payload for key in required):
        raise ValueError("Dados da prova incompletos")
    if payload["rank"] > payload["finishers"]:
        raise ValueError("A classificação não pode ser superior ao número de finalistas")
    if not payload.get("officialUrl", "").strip():
        raise ValueError("É obrigatório indicar o link da classificação oficial")

    with connect() as connection:
        existing = connection.execute(
            """
            SELECT submissions.id
            FROM submissions
            JOIN runners ON runners.id = submissions.runner_id
            WHERE submissions.id = ? AND runners.id = ?
            """,
            (submission_id, user["runner_id"]),
        ).fetchone()
        if existing is None:
            raise ValueError("Submissão não encontrada")
        connection.execute(
            """
            UPDATE submissions
            SET race_name = ?,
                official_url = ?,
                proof_image = ?,
                distance_km = ?,
                total_seconds = ?,
                rank = ?,
                finishers = ?,
                elevation = ?,
                competition = ?,
                terrain = ?,
                season_year = ?,
                verified = 0,
                validation_status = 'pending'
            WHERE id = ?
            """,
            (
                payload["raceName"],
                payload["officialUrl"],
                proof_image_value(payload),
                payload["distanceKm"],
                payload["totalSeconds"],
                payload["rank"],
                payload["finishers"],
                payload["elevation"],
                payload["competition"],
                payload["terrain"],
                payload["seasonYear"],
                submission_id,
            ),
        )
    return {"submissions": fetch_submissions(), "message": "Correção enviada. A prova voltou a ficar pendente para validação."}


def delete_submission(payload, user):
    if user["role"] != "general":
        raise PermissionError("Só o acesso geral pode apagar provas")
    submission_id = payload.get("id")
    with connect() as connection:
        connection.execute("DELETE FROM submissions WHERE id = ?", (submission_id,))
    return fetch_submissions()


def delete_runner_submission(payload, user):
    if user["role"] != "runner":
        raise PermissionError("Só atletas podem apagar as suas provas")
    submission_id = payload.get("id")
    with connect() as connection:
        existing = connection.execute(
            """
            SELECT submissions.id
            FROM submissions
            JOIN runners ON runners.id = submissions.runner_id
            WHERE submissions.id = ? AND runners.id = ?
            """,
            (submission_id, user["runner_id"]),
        ).fetchone()
        if existing is None:
            raise ValueError("Submissão não encontrada")
        connection.execute("DELETE FROM submissions WHERE id = ?", (submission_id,))
    return {"submissions": fetch_submissions(), "message": "Prova apagada."}


def create_runner_account(payload, user):
    if user["role"] != "general":
        raise PermissionError("Só o acesso geral pode criar atletas")
    name = payload.get("name", "").strip()
    password = payload.get("password", "")
    birth_year = payload.get("birthYear") or None
    if len(name) < 2:
        raise ValueError("Nome do atleta demasiado curto")
    if len(password) < 6:
        raise ValueError("A password deve ter pelo menos 6 caracteres")
    if birth_year is not None:
        birth_year = int(birth_year)
        if birth_year < 1900 or birth_year > CURRENT_YEAR:
            raise ValueError("Ano de nascimento inválido")

    with connect() as connection:
        runner_id = runner_id_for(connection, name)
        connection.execute(
            """
            UPDATE runners
            SET photo_url = ?,
                email = ?,
                city = ?,
                country = ?,
                club = ?,
                birth_year = ?,
                bio = ?,
                share_profile = ?
            WHERE id = ?
            """,
            (
                photo_value(payload),
                payload.get("email", "").strip(),
                payload.get("city", "").strip(),
                payload.get("country", "").strip(),
                payload.get("club", "").strip(),
                birth_year,
                payload.get("bio", "").strip(),
                1 if payload.get("shareProfile", True) else 0,
                runner_id,
            ),
        )
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
    return {"profiles": fetch_profiles(), "runnerProfiles": fetch_runner_profiles(), "runners": fetch_runner_accounts()}


def delete_runner_account(payload, user):
    if user["role"] != "general":
        raise PermissionError("Só o acesso geral pode eliminar atletas")
    runner_id = payload.get("id")
    name = payload.get("name", "").strip()
    if not runner_id and not name:
        raise ValueError("Atleta não encontrado")

    with connect() as connection:
        if runner_id:
            runner = connection.execute("SELECT id, name FROM runners WHERE id = ?", (runner_id,)).fetchone()
        else:
            runner = connection.execute("SELECT id, name FROM runners WHERE name = ?", (name,)).fetchone()
        if runner is None:
            raise ValueError("Atleta não encontrado")
        name = runner["name"]
        user_rows = connection.execute(
            "SELECT id FROM users WHERE runner_id = ? OR (name = ? AND role = 'runner')",
            (runner["id"], name),
        ).fetchall()
        user_ids = [row["id"] for row in user_rows]
        if user_ids:
            placeholders = ",".join("?" for _ in user_ids)
            connection.execute(f"DELETE FROM sessions WHERE user_id IN ({placeholders})", user_ids)
            connection.execute(
                f"DELETE FROM messages WHERE sender_user_id IN ({placeholders}) OR recipient_user_id IN ({placeholders})",
                [*user_ids, *user_ids],
            )
        connection.execute("DELETE FROM password_reset_requests WHERE runner_id = ?", (runner["id"],))
        connection.execute("DELETE FROM submissions WHERE runner_id = ?", (runner["id"],))
        connection.execute("DELETE FROM users WHERE runner_id = ? OR (name = ? AND role = 'runner')", (runner["id"], name))
        connection.execute("DELETE FROM runners WHERE id = ?", (runner["id"],))

    return {
        "profiles": fetch_profiles(),
        "runnerProfiles": fetch_runner_profiles(),
        "runners": fetch_runner_accounts(),
        "submissions": fetch_submissions(),
        "message": "Atleta eliminado.",
    }


def register_runner_account(payload):
    name = payload.get("name", "").strip()
    password = payload.get("password", "")
    birth_year = payload.get("birthYear") or None
    if len(name) < 2:
        raise ValueError("Nome do atleta demasiado curto")
    if len(password) < 6:
        raise ValueError("A password deve ter pelo menos 6 caracteres")
    if birth_year is not None:
        birth_year = int(birth_year)
        if birth_year < 1900 or birth_year > CURRENT_YEAR:
            raise ValueError("Ano de nascimento inválido")

    with connect() as connection:
        existing = connection.execute("SELECT id FROM runners WHERE name = ?", (name,)).fetchone()
        if existing is not None:
            raise ValueError("Já existe um atleta com esse nome")
        cursor = connection.execute("INSERT INTO runners (name) VALUES (?)", (name,))
        runner_id = cursor.lastrowid
        connection.execute(
            """
            UPDATE runners
            SET photo_url = ?,
                email = ?,
                city = ?,
                country = ?,
                club = ?,
                birth_year = ?,
                bio = ?,
                share_profile = ?
            WHERE id = ?
            """,
            (
                photo_value(payload),
                payload.get("email", "").strip(),
                payload.get("city", "").strip(),
                payload.get("country", "").strip(),
                payload.get("club", "").strip(),
                birth_year,
                payload.get("bio", "").strip(),
                1 if payload.get("shareProfile", True) else 0,
                runner_id,
            ),
        )
        connection.execute(
            """
            INSERT INTO users (runner_id, name, role, password_hash)
            VALUES (?, ?, 'runner', ?)
            """,
            (runner_id, name, hash_password(password)),
        )
    try:
        notify_admin_new_registration(payload)
    except Exception:
        pass
    return {"profiles": fetch_profiles(), "runnerProfiles": fetch_runner_profiles(), "message": "Inscrição criada. Já podes entrar como atleta."}


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
        existing = connection.execute(
            """
            SELECT submissions.id, submissions.runner_id, submissions.race_name, users.id AS user_id
            FROM submissions
            JOIN users ON users.runner_id = submissions.runner_id AND users.role = 'runner'
            WHERE submissions.id = ?
            """,
            (submission_id,),
        ).fetchone()
        if existing is None:
            raise ValueError("Submissão não encontrada")
        connection.execute(
            "UPDATE submissions SET validation_status = ?, verified = ? WHERE id = ?",
            (status, 1 if status == "approved" else 0, submission_id),
        )
        if status in ("approved", "rejected"):
            subject = "Prova validada" if status == "approved" else "Prova rejeitada"
            body = (
                f'A tua prova "{existing["race_name"]}" foi aprovada e já conta para a liga.'
                if status == "approved"
                else f'A tua prova "{existing["race_name"]}" foi rejeitada. Contacta a gestão da liga se precisares de esclarecer.'
            )
            create_system_message(connection, existing["user_id"], subject, body, user["id"])
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
            self.send_json({"profiles": fetch_profiles(), "runnerProfiles": fetch_runner_profiles()})
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
        if self.path == "/api/me":
            user = self.require_auth()
            if user is None:
                return
            try:
                self.send_json({"profile": fetch_current_runner_profile(user)})
            except ValueError as error:
                self.send_json({"error": str(error)}, status=400)
            except PermissionError as error:
                self.send_json({"error": str(error)}, status=403)
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
        if self.path == "/api/messages":
            user = self.require_auth()
            if user is None:
                return
            self.send_json(
                {
                    "messages": fetch_messages(user),
                    "recipients": fetch_message_recipients(user),
                    "unreadCount": unread_message_count(user),
                }
            )
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
        if self.path == "/api/register":
            try:
                self.send_json(register_runner_account(self.read_json()), status=201)
            except ValueError as error:
                self.send_json({"error": str(error)}, status=400)
            return
        if self.path == "/api/me":
            user = self.require_auth()
            if user is None:
                return
            try:
                self.send_json(update_current_runner_profile(self.read_json(), user))
            except ValueError as error:
                self.send_json({"error": str(error)}, status=400)
            except PermissionError as error:
                self.send_json({"error": str(error)}, status=403)
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
        if self.path == "/api/runners/delete":
            user = self.require_auth()
            if user is None:
                return
            try:
                self.send_json(delete_runner_account(self.read_json(), user))
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
        if self.path == "/api/messages":
            user = self.require_auth()
            if user is None:
                return
            try:
                self.send_json(create_message(self.read_json(), user), status=201)
            except ValueError as error:
                self.send_json({"error": str(error)}, status=400)
            return
        if self.path == "/api/messages/read":
            user = self.require_auth()
            if user is None:
                return
            self.send_json(mark_messages_read(user))
            return
        if self.path == "/api/newsletter/monthly":
            user = self.require_auth()
            if user is None:
                return
            try:
                self.send_json(generate_monthly_newsletter(user))
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
        if self.path == "/api/submissions/runner-update":
            user = self.require_auth()
            if user is None:
                return
            try:
                self.send_json(update_runner_submission(self.read_json(), user))
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
        if self.path == "/api/submissions/runner-delete":
            user = self.require_auth()
            if user is None:
                return
            try:
                self.send_json(delete_runner_submission(self.read_json(), user))
            except ValueError as error:
                self.send_json({"error": str(error)}, status=400)
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
    if "--send-monthly-newsletter" in sys.argv:
        result = generate_monthly_newsletter()
        print(
            f"{result['message']} {result['recipientCount']} atletas, "
            f"{result['emailCount']} emails, mês {result['month']}."
        )
        raise SystemExit(0)
    port = int(os.environ.get("PORT", "4173"))
    host = os.environ.get("HOST", "127.0.0.1")
    server = ThreadingHTTPServer((host, port), RunnersLeagueHandler)
    print(f"Runners League em http://{host}:{port}")
    server.serve_forever()
