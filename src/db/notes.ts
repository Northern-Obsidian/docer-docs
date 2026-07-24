import type { SQLiteDatabase } from 'expo-sqlite';
import type { Note } from '@/types';
import { encryptContent, decryptContent, isNoteEncryptionEnabled } from '@/services/encryption-service';

export async function getNotesByDocument(db: SQLiteDatabase, documentId: string): Promise<Note[]> {
  const notes = await db.getAllAsync<Note & { is_encrypted: number }>(
    'SELECT *, is_encrypted AS isEncrypted FROM notes WHERE document_id = ? ORDER BY created_at DESC',
    documentId
  );
  return notes.map((n) => ({
    ...n,
    isEncrypted: !!n.isEncrypted,
    content: n.isEncrypted ? decryptContent(n.content) : n.content,
  }));
}

export async function getAllNotes(db: SQLiteDatabase): Promise<Note[]> {
  const notes = await db.getAllAsync<Note & { is_encrypted: number }>(
    'SELECT *, is_encrypted AS isEncrypted FROM notes ORDER BY created_at DESC'
  );
  return notes.map((n) => ({
    ...n,
    isEncrypted: !!n.isEncrypted,
    content: n.isEncrypted ? decryptContent(n.content) : n.content,
  }));
}

export async function insertNote(db: SQLiteDatabase, n: Note): Promise<void> {
  const shouldEncrypt = isNoteEncryptionEnabled();
  const content = shouldEncrypt ? encryptContent(n.content) : n.content;
  await db.runAsync(
    'INSERT INTO notes (id, document_id, page, paragraph_index, content, created_at, updated_at, is_encrypted) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    n.id, n.documentId, n.page, n.paragraphIndex, content, n.createdAt, n.updatedAt, shouldEncrypt ? 1 : 0
  );
}

export async function updateNote(db: SQLiteDatabase, id: string, content: string): Promise<void> {
  const shouldEncrypt = isNoteEncryptionEnabled();
  const encryptedContent = shouldEncrypt ? encryptContent(content) : content;
  await db.runAsync('UPDATE notes SET content = ?, is_encrypted = ?, updated_at = datetime("now") WHERE id = ?', encryptedContent, shouldEncrypt ? 1 : 0, id);
}

export async function deleteNote(db: SQLiteDatabase, id: string): Promise<void> {
  await db.runAsync('DELETE FROM notes WHERE id = ?', id);
}

export const getAllNotesByDocument = getNotesByDocument;
