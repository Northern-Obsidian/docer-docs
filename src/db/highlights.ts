import type { SQLiteDatabase } from 'expo-sqlite';
import type { Highlight } from '@/types';

export async function getHighlightsByDocument(db: SQLiteDatabase, documentId: string): Promise<Highlight[]> {
  return db.getAllAsync<Highlight>('SELECT * FROM highlights WHERE document_id = ? ORDER BY page ASC', documentId);
}

export async function getAllHighlights(db: SQLiteDatabase): Promise<Highlight[]> {
  return db.getAllAsync<Highlight>('SELECT * FROM highlights ORDER BY created_at DESC');
}

export async function insertHighlight(db: SQLiteDatabase, h: Highlight): Promise<void> {
  await db.runAsync(
    'INSERT INTO highlights (id, document_id, page, color, text, position, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
    h.id, h.documentId, h.page, h.color, h.text, h.position, h.createdAt
  );
}

export async function deleteHighlight(db: SQLiteDatabase, id: string): Promise<void> {
  await db.runAsync('DELETE FROM highlights WHERE id = ?', id);
}
