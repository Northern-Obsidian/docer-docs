import type { SQLiteDatabase } from 'expo-sqlite';
import type { ReadingGoal } from '@/types';

export async function getActiveGoals(db: SQLiteDatabase): Promise<ReadingGoal[]> {
  return db.getAllAsync<ReadingGoal>('SELECT * FROM reading_goals ORDER BY created_at DESC');
}

export async function insertGoal(db: SQLiteDatabase, g: ReadingGoal): Promise<void> {
  await db.runAsync(
    'INSERT INTO reading_goals (id, type, target_value, current_value, period_start, period_end, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
    g.id, g.type, g.targetValue, g.currentValue, g.periodStart, g.periodEnd, g.createdAt
  );
}

export async function updateGoalProgress(db: SQLiteDatabase, id: string, currentValue: number): Promise<void> {
  await db.runAsync('UPDATE reading_goals SET current_value = ? WHERE id = ?', currentValue, id);
}

export async function deleteGoal(db: SQLiteDatabase, id: string): Promise<void> {
  await db.runAsync('DELETE FROM reading_goals WHERE id = ?', id);
}
