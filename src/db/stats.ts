import type { SQLiteDatabase } from 'expo-sqlite';

export async function getTodayStats(db: SQLiteDatabase): Promise<{ pagesRead: number; readingTime: number; documentsOpened: number }> {
  const today = new Date().toISOString().split('T')[0];
  const row = await db.getFirstAsync<{ pages_read: number; reading_time: number; documents_opened: number }>(
    'SELECT pages_read, reading_time, documents_opened FROM reading_stats WHERE date = ?', today
  );
  return { pagesRead: row?.pages_read ?? 0, readingTime: row?.reading_time ?? 0, documentsOpened: row?.documents_opened ?? 0 };
}

export async function upsertTodayStats(db: SQLiteDatabase, stats: { pagesRead: number; readingTime: number; documentsOpened: number }): Promise<void> {
  const today = new Date().toISOString().split('T')[0];
  const id = `stats-${today}`;
  await db.runAsync(
    `INSERT INTO reading_stats (id, date, pages_read, reading_time, documents_opened)
     VALUES (?, ?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET
       pages_read = excluded.pages_read,
       reading_time = excluded.reading_time,
       documents_opened = excluded.documents_opened`,
    id, today, stats.pagesRead, stats.readingTime, stats.documentsOpened
  );
}

export async function getDateRangeStats(db: SQLiteDatabase, from: string, to: string) {
  return db.getAllAsync(
    'SELECT * FROM reading_stats WHERE date >= ? AND date <= ? ORDER BY date ASC', from, to
  );
}

export async function getReadingStreak(db: SQLiteDatabase): Promise<number> {
  const rows = await db.getAllAsync<{ date: string }>('SELECT DISTINCT date FROM reading_stats WHERE pages_read > 0 OR reading_time > 0 ORDER BY date DESC');
  if (rows.length === 0) return 0;
  let streak = 1;
  for (let i = 1; i < rows.length; i++) {
    const prev = new Date(rows[i - 1].date);
    const curr = new Date(rows[i].date);
    const diff = (prev.getTime() - curr.getTime()) / (1000 * 60 * 60 * 24);
    if (diff === 1) streak++;
    else break;
  }
  return streak;
}
