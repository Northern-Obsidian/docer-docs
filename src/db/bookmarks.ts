import type { SQLiteDatabase } from 'expo-sqlite';
import type { Bookmark } from '@/types';

export async function getBookmarksByDocument(db: SQLiteDatabase, documentId: string): Promise<Bookmark[]> {
  return db.getAllAsync<Bookmark>('SELECT * FROM bookmarks WHERE document_id = ? ORDER BY page ASC', documentId);
}

export async function getAllBookmarks(db: SQLiteDatabase): Promise<Bookmark[]> {
  return db.getAllAsync<Bookmark>('SELECT * FROM bookmarks ORDER BY created_at DESC');
}

export async function getBookmarkByPage(db: SQLiteDatabase, documentId: string, page: number): Promise<Bookmark | null> {
  return db.getFirstAsync<Bookmark>('SELECT * FROM bookmarks WHERE document_id = ? AND page = ?', documentId, page);
}

export async function deleteBookmarkByPage(db: SQLiteDatabase, documentId: string, page: number): Promise<void> {
  await db.runAsync('DELETE FROM bookmarks WHERE document_id = ? AND page = ?', documentId, page);
}

export async function insertBookmark(db: SQLiteDatabase, bm: Bookmark): Promise<void> {
  await db.runAsync(
    'INSERT INTO bookmarks (id, document_id, page, chapter, position, label, folder_id, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    bm.id, bm.documentId, bm.page, bm.chapter, bm.position, bm.label, bm.folderId ?? null, bm.createdAt
  );
}

export async function deleteBookmark(db: SQLiteDatabase, id: string): Promise<void> {
  await db.runAsync('DELETE FROM bookmarks WHERE id = ?', id);
}

export const getAllBookmarksByDocument = getBookmarksByDocument;
