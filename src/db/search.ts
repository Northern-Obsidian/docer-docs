import type { SQLiteDatabase } from 'expo-sqlite';
import { searchContent } from './content-index';

export interface SearchResult {
  documentId: string;
  documentName: string;
  documentType: string;
  snippet: string;
  rank: number;
  matchType?: 'name' | 'content';
}

export async function searchAll(db: SQLiteDatabase, query: string): Promise<SearchResult[]> {
  if (!query.trim()) return [];
  return searchContent(db, query);
}

export async function searchNotes(db: SQLiteDatabase, query: string) {
  if (!query.trim()) return [];
  const term = `%${query}%`;
  return db.getAllAsync(
    `SELECT n.*, d.name as documentName, d.type as documentType
     FROM notes n
     JOIN documents d ON d.id = n.document_id
     WHERE n.content LIKE ?
     ORDER BY n.updated_at DESC`,
    term
  );
}

export async function searchBookmarks(db: SQLiteDatabase, query: string) {
  if (!query.trim()) return [];
  const term = `%${query}%`;
  return db.getAllAsync(
    `SELECT b.*, d.name as documentName
     FROM bookmarks b
     JOIN documents d ON d.id = b.document_id
     WHERE b.label LIKE ?
     ORDER BY b.created_at DESC`,
    term
  );
}
