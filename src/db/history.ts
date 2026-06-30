import type { SQLiteDatabase } from 'expo-sqlite';

export async function getHistoryByDocument(db: SQLiteDatabase, documentId: string) {
  return db.getFirstAsync<{
    id: string; document_id: string; last_page: number; last_position: string | null;
    progress: number; started_at: string; last_read_at: string; read_count: number; total_reading_time: number;
  }>('SELECT * FROM reading_history WHERE document_id = ?', documentId);
}

export async function upsertHistory(db: SQLiteDatabase, entry: {
  id: string; documentId: string; lastPage: number; lastPosition: string | null;
  progress: number; startedAt: string; lastReadAt: string; readCount: number; totalReadingTime: number;
}) {
  await db.runAsync(
    `INSERT INTO reading_history (id, document_id, last_page, last_position, progress, started_at, last_read_at, read_count, total_reading_time)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(document_id) DO UPDATE SET
       last_page = excluded.last_page,
       last_position = excluded.last_position,
       progress = excluded.progress,
       last_read_at = excluded.last_read_at,
       read_count = excluded.read_count,
       total_reading_time = excluded.total_reading_time`,
    entry.id, entry.documentId, entry.lastPage, entry.lastPosition, entry.progress,
    entry.startedAt, entry.lastReadAt, entry.readCount, entry.totalReadingTime
  );
}

export async function deleteHistory(db: SQLiteDatabase, id: string) {
  await db.runAsync('DELETE FROM reading_history WHERE id = ?', id);
}

export async function clearAllHistory(db: SQLiteDatabase) {
  await db.runAsync('DELETE FROM reading_history');
}
