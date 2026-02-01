import Database from 'better-sqlite3';
import * as m0001 from './migrations/0001_add_last_login_at';
import * as m0002 from './migrations/0002_add_profile_image_column';

const migrations = [m0001, m0002];

export function runMigrations(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS migrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      run_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  for (const migration of migrations) {
    const hasRun = hasMigrationRun(db, migration.name);
    if (!hasRun) {
      db.transaction(() => {
        migration.up(db);
        db.prepare(`INSERT INTO migrations (name) VALUES (?)`)
          .run(migration.name);
      })();
      console.log(`✅ Migration applied: ${migration.name}`);
    }
  }
}

// Check if a migration has already been run
function hasMigrationRun(db: Database.Database, name: string): boolean {
  const row = db
    .prepare(`SELECT 1 FROM migrations WHERE name = ?`)
    .get(name);

  return !!row;
}
