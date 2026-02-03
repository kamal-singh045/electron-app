import Database from 'better-sqlite3';

export const name = '0001_add_last_login_at';

export function up(db: Database.Database) {
  db.exec(`
    ALTER TABLE users
    ADD COLUMN last_login_at DATETIME DEFAULT NULL
  `);
}
