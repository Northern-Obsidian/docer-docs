import * as SQLite from 'expo-sqlite';

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

export function getDb(): Promise<SQLite.SQLiteDatabase> {
  if (!dbPromise) {
    dbPromise = SQLite.openDatabaseAsync('docer.db');
  }
  return dbPromise;
}

export async function closeDb(): Promise<void> {
  const db = await getDb();
  await db.closeAsync();
  dbPromise = null;
}
