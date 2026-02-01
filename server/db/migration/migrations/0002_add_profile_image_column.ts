import Database from 'better-sqlite3';

export const name = "0002_add_profile_image_column";

export function up(db: Database.Database) {
  db.exec(`
    ALTER TABLE users
    ADD COLUMN profile_image TEXT DEFAULT NULL
  `);
}
