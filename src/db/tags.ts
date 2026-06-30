import type { SQLiteDatabase } from 'expo-sqlite';
import type { Tag } from '@/types';

export async function getAllTags(db: SQLiteDatabase): Promise<Tag[]> {
  return db.getAllAsync<Tag>('SELECT * FROM tags ORDER BY name ASC');
}

export async function insertTag(db: SQLiteDatabase, t: Tag): Promise<void> {
  await db.runAsync('INSERT OR IGNORE INTO tags (id, name, color) VALUES (?, ?, ?)', t.id, t.name, t.color);
}

export async function deleteTag(db: SQLiteDatabase, id: string): Promise<void> {
  await db.runAsync('DELETE FROM tags WHERE id = ?', id);
}

export async function addTagToDocument(db: SQLiteDatabase, tagId: string, documentId: string): Promise<void> {
  await db.runAsync('INSERT OR IGNORE INTO tag_documents (tag_id, document_id) VALUES (?, ?)', tagId, documentId);
}

export async function removeTagFromDocument(db: SQLiteDatabase, tagId: string, documentId: string): Promise<void> {
  await db.runAsync('DELETE FROM tag_documents WHERE tag_id = ? AND document_id = ?', tagId, documentId);
}

export async function getTagsByDocument(db: SQLiteDatabase, documentId: string): Promise<Tag[]> {
  return db.getAllAsync<Tag>(
    `SELECT t.* FROM tags t
     JOIN tag_documents td ON td.tag_id = t.id
     WHERE td.document_id = ?`, documentId
  );
}
