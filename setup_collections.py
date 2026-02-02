#!/usr/bin/env python3
"""
Script de migration PocketBase pour BetPromo.
- Crée la collection 'monthly_stats'
- Ajoute les champs 'role' et 'status' à la collection 'users'
- Ouvre les règles API de 'users' pour l'admin
- Migre les données de 'admin_users' vers 'users' (optionnel)

Usage: python3 setup_collections.py
PocketBase doit être arrêté avant l'exécution.
"""

import sqlite3
import json
import os
import sys

DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'pocketbase', 'pb_data', 'data.db')


def get_connection():
    if not os.path.exists(DB_PATH):
        print(f"ERREUR: Base de données non trouvée: {DB_PATH}")
        sys.exit(1)
    return sqlite3.connect(DB_PATH)


def create_monthly_stats_collection(conn):
    """Crée la collection monthly_stats si elle n'existe pas."""
    cursor = conn.cursor()

    # Vérifier si elle existe déjà
    cursor.execute("SELECT id FROM _collections WHERE name = 'monthly_stats'")
    if cursor.fetchone():
        print("[OK] Collection 'monthly_stats' existe déjà")
        return

    collection_id = 'pbc_monthly_stats'

    fields = json.dumps([
        {
            "autogeneratePattern": "[a-z0-9]{15}",
            "hidden": False,
            "id": "text3208210256",
            "max": 15,
            "min": 15,
            "name": "id",
            "pattern": "^[a-z0-9]+$",
            "presentable": False,
            "primaryKey": True,
            "required": True,
            "system": True,
            "type": "text"
        },
        {
            "hidden": False,
            "id": "number_month",
            "max": 12,
            "min": 1,
            "name": "month",
            "onlyInt": True,
            "presentable": False,
            "required": True,
            "system": False,
            "type": "number"
        },
        {
            "hidden": False,
            "id": "number_year",
            "max": None,
            "min": 2024,
            "name": "year",
            "onlyInt": True,
            "presentable": False,
            "required": True,
            "system": False,
            "type": "number"
        },
        {
            "hidden": False,
            "id": "number_clicks",
            "max": None,
            "min": 0,
            "name": "clicks",
            "onlyInt": True,
            "presentable": False,
            "required": False,
            "system": False,
            "type": "number"
        },
        {
            "hidden": False,
            "id": "number_conversions",
            "max": None,
            "min": 0,
            "name": "conversions",
            "onlyInt": True,
            "presentable": False,
            "required": False,
            "system": False,
            "type": "number"
        },
        {
            "hidden": False,
            "id": "number_visitors",
            "max": None,
            "min": 0,
            "name": "visitors",
            "onlyInt": True,
            "presentable": False,
            "required": False,
            "system": False,
            "type": "number"
        },
        {
            "hidden": False,
            "id": "number_revenue",
            "max": None,
            "min": 0,
            "name": "revenue",
            "onlyInt": False,
            "presentable": False,
            "required": False,
            "system": False,
            "type": "number"
        },
        {
            "hidden": False,
            "id": "autodate2990389176",
            "name": "created",
            "onCreate": True,
            "onUpdate": False,
            "presentable": False,
            "system": False,
            "type": "autodate"
        },
        {
            "hidden": False,
            "id": "autodate3332085495",
            "name": "updated",
            "onCreate": True,
            "onUpdate": True,
            "presentable": False,
            "system": False,
            "type": "autodate"
        }
    ])

    indexes = json.dumps([
        "CREATE UNIQUE INDEX `idx_monthly_stats_month_year` ON `monthly_stats` (`month`, `year`)"
    ])

    cursor.execute("""
        INSERT INTO _collections (id, system, type, name, fields, indexes,
            listRule, viewRule, createRule, updateRule, deleteRule, options, created, updated)
        VALUES (?, 0, 'base', 'monthly_stats', ?, ?, '', '', '', '', '', '{}',
            datetime('now'), datetime('now'))
    """, (collection_id, fields, indexes))

    # Créer la table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS monthly_stats (
            id TEXT PRIMARY KEY DEFAULT ('r'||lower(hex(randomblob(7)))) NOT NULL,
            month INTEGER NOT NULL,
            year INTEGER NOT NULL,
            clicks INTEGER DEFAULT 0,
            conversions INTEGER DEFAULT 0,
            visitors INTEGER DEFAULT 0,
            revenue REAL DEFAULT 0,
            created TEXT DEFAULT '' NOT NULL,
            updated TEXT DEFAULT '' NOT NULL
        )
    """)

    # Créer l'index unique
    cursor.execute("""
        CREATE UNIQUE INDEX IF NOT EXISTS idx_monthly_stats_month_year
        ON monthly_stats (month, year)
    """)

    print("[OK] Collection 'monthly_stats' créée avec succès")


def add_role_status_to_users(conn):
    """Ajoute les champs role et status à la collection users."""
    cursor = conn.cursor()

    # Lire les champs actuels
    cursor.execute("SELECT fields FROM _collections WHERE name = 'users'")
    row = cursor.fetchone()
    if not row:
        print("[ERREUR] Collection 'users' non trouvée")
        return

    fields = json.loads(row[0])
    field_names = [f['name'] for f in fields]

    # Vérifier si les champs existent déjà
    if 'role' in field_names and 'status' in field_names:
        print("[OK] Champs 'role' et 'status' déjà présents dans 'users'")
        return

    # Ajouter les champs avant les autodate fields
    new_fields = []
    for f in fields:
        if f['name'] == 'created' and 'role' not in field_names:
            # Insérer role et status avant created
            new_fields.append({
                "autogeneratePattern": "",
                "hidden": False,
                "id": "text_role_users",
                "max": 20,
                "min": 0,
                "name": "role",
                "pattern": "",
                "presentable": False,
                "primaryKey": False,
                "required": False,
                "system": False,
                "type": "text"
            })
            new_fields.append({
                "autogeneratePattern": "",
                "hidden": False,
                "id": "text_status_users",
                "max": 20,
                "min": 0,
                "name": "status",
                "pattern": "",
                "presentable": False,
                "primaryKey": False,
                "required": False,
                "system": False,
                "type": "text"
            })
            new_fields.append({
                "hidden": False,
                "id": "date_lastlogin_users",
                "max": "",
                "min": "",
                "name": "lastLogin",
                "presentable": False,
                "required": False,
                "system": False,
                "type": "date"
            })
        new_fields.append(f)

    # Mettre à jour les champs dans _collections
    cursor.execute(
        "UPDATE _collections SET fields = ?, updated = datetime('now') WHERE name = 'users'",
        (json.dumps(new_fields),)
    )

    # Ajouter les colonnes à la table users si elles n'existent pas
    cursor.execute("PRAGMA table_info(users)")
    existing_cols = [col[1] for col in cursor.fetchall()]

    if 'role' not in existing_cols:
        cursor.execute("ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'viewer'")
    if 'status' not in existing_cols:
        cursor.execute("ALTER TABLE users ADD COLUMN status TEXT DEFAULT 'active'")
    if 'lastLogin' not in existing_cols:
        cursor.execute("ALTER TABLE users ADD COLUMN lastLogin TEXT DEFAULT ''")

    # Ouvrir les règles API pour permettre l'administration
    # listRule/viewRule: vide = accès public (nécessaire pour que l'admin puisse lister les users)
    cursor.execute("""
        UPDATE _collections SET
            listRule = '',
            viewRule = '',
            createRule = '',
            updateRule = '',
            deleteRule = '',
            updated = datetime('now')
        WHERE name = 'users'
    """)

    print("[OK] Champs 'role', 'status', 'lastLogin' ajoutés à 'users'")
    print("[OK] Règles API de 'users' ouvertes")


def migrate_admin_users(conn):
    """Migre les données de admin_users vers users (optionnel)."""
    cursor = conn.cursor()

    # Vérifier si admin_users a des données
    try:
        cursor.execute("SELECT id, name, email, role, status, lastLogin FROM admin_users")
        rows = cursor.fetchall()
    except Exception:
        print("[INFO] Pas de table admin_users ou pas de données")
        return

    if not rows:
        print("[INFO] Aucune donnée dans admin_users à migrer")
        return

    migrated = 0
    for row in rows:
        old_id, name, email, role, status, last_login = row

        # Vérifier si l'email existe déjà dans users
        cursor.execute("SELECT id FROM users WHERE email = ?", (email,))
        if cursor.fetchone():
            print(f"  [SKIP] {email} existe déjà dans users")
            continue

        # Générer un nouveau ID
        cursor.execute("SELECT lower(hex(randomblob(7)))")
        random_hex = cursor.fetchone()[0]
        new_id = f"r{random_hex}"[:15]

        # Note: on ne peut pas migrer les mots de passe car admin_users n'en a pas
        # Les utilisateurs migrés devront se faire réinitialiser leur mot de passe
        print(f"  [MIGRE] {email} ({role}) - mot de passe à définir manuellement")
        migrated += 1

    if migrated > 0:
        print(f"[INFO] {migrated} utilisateur(s) à migrer manuellement (pas de mot de passe dans admin_users)")
        print("[INFO] Créez-les via l'interface admin avec un mot de passe")
    else:
        print("[INFO] Aucun utilisateur à migrer")


def main():
    print("=" * 60)
    print("Migration PocketBase - BetPromo")
    print("=" * 60)
    print(f"DB: {DB_PATH}")
    print()

    conn = get_connection()

    try:
        create_monthly_stats_collection(conn)
        add_role_status_to_users(conn)
        migrate_admin_users(conn)

        conn.commit()
        print()
        print("=" * 60)
        print("Migration terminée avec succès !")
        print("Vous pouvez maintenant démarrer PocketBase.")
        print("=" * 60)
    except Exception as e:
        conn.rollback()
        print(f"\n[ERREUR] Migration échouée: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
    finally:
        conn.close()


if __name__ == '__main__':
    main()
