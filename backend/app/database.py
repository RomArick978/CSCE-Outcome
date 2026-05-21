import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data", "csce.db")


def get_db():
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL")
    return conn


def init_db():
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS squads (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT UNIQUE NOT NULL,
            region TEXT,
            lead TEXT
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS outputs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            csf_outcome TEXT,
            csce_outcome TEXT,
            measure TEXT,
            output_keyword TEXT,
            output TEXT NOT NULL,
            impact TEXT,
            quarter TEXT,
            year INTEGER,
            priority TEXT,
            metric_baseline REAL DEFAULT 0,
            metric_value REAL DEFAULT 0,
            metric_target REAL DEFAULT 1,
            output_status TEXT DEFAULT 'Not Started',
            checkpoint_status TEXT,
            checkpoint_description TEXT,
            risk TEXT,
            issue TEXT,
            owner TEXT,
            platform TEXT DEFAULT 'Cyber Security Culture & Enablement',
            squad TEXT NOT NULL,
            country TEXT,
            region TEXT,
            division TEXT,
            status_notes TEXT,
            ai_status TEXT,
            ai_alignment TEXT,
            ai_outcome TEXT,
            ai_business_value TEXT,
            ai_output_quality TEXT,
            ai_comment TEXT,
            ai_suggestion TEXT,
            ai_validated_by TEXT,
            ai_validated_on TEXT,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
    """)

    conn.commit()
    conn.close()


def get_all_outputs(squad: str = None):
    conn = get_db()
    if squad and squad != "All":
        rows = conn.execute(
            "SELECT * FROM outputs WHERE squad = ? ORDER BY id DESC", (squad,)
        ).fetchall()
    else:
        rows = conn.execute("SELECT * FROM outputs ORDER BY id DESC").fetchall()
    conn.close()
    return [dict(r) for r in rows]


def get_output(output_id: int):
    conn = get_db()
    row = conn.execute("SELECT * FROM outputs WHERE id = ?", (output_id,)).fetchone()
    conn.close()
    return dict(row) if row else None


def create_output(data: dict):
    conn = get_db()
    columns = ", ".join(data.keys())
    placeholders = ", ".join(["?" for _ in data])
    values = list(data.values())
    cursor = conn.execute(
        f"INSERT INTO outputs ({columns}) VALUES ({placeholders})", values
    )
    conn.commit()
    output_id = cursor.lastrowid
    conn.close()
    return output_id


def update_output(output_id: int, data: dict):
    conn = get_db()
    set_clause = ", ".join([f"{k} = ?" for k in data.keys()])
    values = list(data.values()) + [output_id]
    conn.execute(
        f"UPDATE outputs SET {set_clause}, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
        values,
    )
    conn.commit()
    conn.close()


def delete_output(output_id: int):
    conn = get_db()
    conn.execute("DELETE FROM outputs WHERE id = ?", (output_id,))
    conn.commit()
    conn.close()


def get_squads():
    conn = get_db()
    rows = conn.execute("SELECT * FROM squads ORDER BY name").fetchall()
    conn.close()
    return [dict(r) for r in rows]


def create_squad(name: str, region: str = "", lead: str = ""):
    conn = get_db()
    try:
        conn.execute(
            "INSERT INTO squads (name, region, lead) VALUES (?, ?, ?)",
            (name, region, lead),
        )
        conn.commit()
    except sqlite3.IntegrityError:
        pass
    conn.close()
