import type { SQLiteDatabase } from 'expo-sqlite';
import type { Collection } from '@/types';

export async function getAllCollections(db: SQLiteDatabase): Promise<Collection[]> {
  return db.getAllAsync<Collection>('SELECT * FROM collections ORDER BY sort_order ASC');
}

export async function insertCollection(db: SQLiteDatabase, c: Collection): Promise<void> {
  await db.runAsync(
    'INSERT INTO collections (id, name, icon, color, sort_order, pinned_to_home, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
    c.id, c.name, c.icon, c.color, c.sortOrder, c.pinnedToHome ? 1 : 0, c.createdAt
  );
}

export async function deleteCollection(db: SQLiteDatabase, id: string): Promise<void> {
  await db.runAsync('DELETE FROM collections WHERE id = ?', id);
}

export async function addDocumentToCollection(db: SQLiteDatabase, collectionId: string, documentId: string): Promise<void> {
  await db.runAsync('INSERT OR IGNORE INTO collection_documents (collection_id, document_id) VALUES (?, ?)', collectionId, documentId);
}

export async function removeDocumentFromCollection(db: SQLiteDatabase, collectionId: string, documentId: string): Promise<void> {
  await db.runAsync('DELETE FROM collection_documents WHERE collection_id = ? AND document_id = ?', collectionId, documentId);
}

export async function getDocumentsByCollection(db: SQLiteDatabase, collectionId: string) {
  return db.getAllAsync(
    `SELECT d.* FROM documents d
     JOIN collection_documents cd ON cd.document_id = d.id
     WHERE cd.collection_id = ?
     ORDER BY cd.added_at DESC`, collectionId
  );
}
