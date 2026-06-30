import type { SQLiteDatabase } from 'expo-sqlite';

export async function getFavoriteIds(db: SQLiteDatabase): Promise<string[]> {
  const rows = await db.getAllAsync<{ document_id: string }>('SELECT document_id FROM favorites ORDER BY added_at DESC');
  return rows.map(r => r.document_id);
}

export async function getFavorites(db: SQLiteDatabase) {
  return db.getAllAsync(
    `SELECT d.*, f.added_at as favorited_at FROM documents d
     JOIN favorites f ON f.document_id = d.id
     ORDER BY f.added_at DESC`
  );
}

export async function toggleFavorite(db: SQLiteDatabase, documentId: string): Promise<boolean> {
  const existing = await db.getFirstAsync<{ document_id: string }>('SELECT document_id FROM favorites WHERE document_id = ?', documentId);
  if (existing) {
    await db.runAsync('DELETE FROM favorites WHERE document_id = ?', documentId);
    return false;
  } else {
    await db.runAsync('INSERT INTO favorites (document_id) VALUES (?)', documentId);
    return true;
  }
}

export async function isFavorite(db: SQLiteDatabase, documentId: string): Promise<boolean> {
  const row = await db.getFirstAsync<{ document_id: string }>('SELECT document_id FROM favorites WHERE document_id = ?', documentId);
  return !!row;
}
