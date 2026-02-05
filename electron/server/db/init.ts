import Database from 'better-sqlite3';
import path from 'node:path';
import { app } from 'electron';
import { runMigrations } from './migration/migrate';

let dbInstance: Database.Database | null = null;

// Get database instance (lazy initialization)
export function getDbInstance(): Database.Database {
  if (!dbInstance) {
    // Use Electron's userData directory for the database
    // This ensures the database is stored in a proper location
    const dbPath = app.isPackaged
      ? path.join(app.getPath('userData'), 'database.sqlite')
      : path.join(process.cwd(), 'electron', 'server', 'db', 'database.sqlite');

    // Create/connect to database
    dbInstance = new Database(dbPath);

    // Enable foreign keys
    dbInstance.pragma('foreign_keys = ON');

    console.log(`✅ Database connected at: ${dbPath}`);
  }

  return dbInstance;
}

// For backward compatibility
export { dbInstance };

// Initialize schema
export function initializeDatabase() {
  try {
    const db = getDbInstance();

    // Run migrations
    runMigrations(db);
    console.log('✅ Database initialized successfully');
  } catch (error) {
    console.error('❌ Database initialization error:', error)
    throw error;
  }
}
