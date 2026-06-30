import type { SQLiteDatabase } from 'expo-sqlite';
import type { Note } from '@/types';

export async function getNotesByDocument(db: SQLiteDatabase, documentId: string): Promise<Note[]> {
  return db.getAllAsync<Note>('SELECT * FROM notes WHERE document_id = ? ORDER BY created_at DESC', documentId);
}

export async function getAllNotes(db: SQLiteDatabase): Promise<Note[]> {
  return db.getAllAsync<Note>('SELECT * FROM notes ORDER BY created_at DESC');
}

export async function insertNote(db: SQLiteDatabase, n: Note): Promise<void> {
  await db.runAsync(
    'INSERT INTO notes (id, document_id, page, paragraph_index, content, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
    n.id, n.documentId, n.page, n.paragraphIndex, n.content, n.createdAt, n.updatedAt
  );
}

export async function updateNote(db: SQLiteDatabase, id: string, content: string): Promise<void> {
  await db.runAsync('UPDATE notes SET content = ?, updated_at = datetime("now") WHERE id = ?', content, id);
}

export async function deleteNote(db: SQLiteDatabase, id: string): Promise<void> {
  await db.runAsync('DELETE FROM notes WHERE id = ?', id);
}
