import type { SQLiteDatabase } from 'expo-sqlite';

export interface BookmarkFolder {
  id: string;
  name: string;
  sortOrder: number;
  createdAt: string;
}

export async function getAllFolders(db: SQLiteDatabase): Promise<BookmarkFolder[]> {
  return db.getAllAsync<BookmarkFolder>(
    'SELECT id, name, sort_order AS sortOrder, created_at AS createdAt FROM bookmark_folders ORDER BY sort_order ASC, name ASC'
  );
}

export async function createFolder(db: SQLiteDatabase, id: string, name: string): Promise<void> {
  const max = await db.getFirstAsync<{ m: number }>('SELECT COALESCE(MAX(sort_order), 0) AS m FROM bookmark_folders');
  await db.runAsync(
    'INSERT INTO bookmark_folders (id, name, sort_order) VALUES (?, ?, ?)',
    id, name, (max?.m ?? 0) + 1
  );
}

export async function renameFolder(db: SQLiteDatabase, id: string, name: string): Promise<void> {
  await db.runAsync('UPDATE bookmark_folders SET name = ? WHERE id = ?', name, id);
}

export async function deleteFolder(db: SQLiteDatabase, id: string): Promise<void> {
  await db.runAsync('UPDATE bookmarks SET folder_id = NULL WHERE folder_id = ?', id);
  await db.runAsync('DELETE FROM bookmark_folders WHERE id = ?', id);
}

export async function reorderFolders(db: SQLiteDatabase, orderedIds: string[]): Promise<void> {
  for (let i = 0; i < orderedIds.length; i++) {
    await db.runAsync('UPDATE bookmark_folders SET sort_order = ? WHERE id = ?', i, orderedIds[i]);
  }
}
