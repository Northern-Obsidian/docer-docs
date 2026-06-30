import { create } from 'zustand';
import { getDb } from '@/db/connection';
import { getTodayStats, getReadingStreak, getDateRangeStats } from '@/db/stats';

interface DailyStats {
  pagesRead: number;
  readingTime: number;
  documentsOpened: number;
}

interface StatsState {
  todayStats: DailyStats;
  readingStreak: number;
  isLoading: boolean;
  fetchTodayStats: () => Promise<void>;
  fetchReadingStreak: () => Promise<void>;
}

export const useStatsStore = create<StatsState>((set) => ({
  todayStats: { pagesRead: 0, readingTime: 0, documentsOpened: 0 },
  readingStreak: 0,
  isLoading: false,

  fetchTodayStats: async () => {
    set({ isLoading: true });
    try {
      const db = await getDb();
      const todayStats = await getTodayStats(db);
      set({ todayStats, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  fetchReadingStreak: async () => {
    try {
      const db = await getDb();
      const readingStreak = await getReadingStreak(db);
      set({ readingStreak });
    } catch {
      // silent
    }
  },
}));
