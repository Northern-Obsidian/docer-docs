import { create } from 'zustand';
import { getDb } from '@/db/connection';
import { getTodayStats, getReadingStreak, getDateRangeStats } from '@/db/stats';

interface DailyStats {
  pagesRead: number;
  readingTime: number;
  documentsOpened: number;
}

interface DayStat {
  date: string;
  pages_read: number;
  reading_time: number;
  documents_opened: number;
}

interface StatsState {
  todayStats: DailyStats;
  readingStreak: number;
  rangeStats: DayStat[];
  isLoading: boolean;
  fetchTodayStats: () => Promise<void>;
  fetchReadingStreak: () => Promise<void>;
  fetchRangeStats: (from: string, to: string) => Promise<void>;
}

export const useStatsStore = create<StatsState>((set) => ({
  todayStats: { pagesRead: 0, readingTime: 0, documentsOpened: 0 },
  readingStreak: 0,
  rangeStats: [],
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

  fetchRangeStats: async (from: string, to: string) => {
    try {
      const db = await getDb();
      const rangeStats = await getDateRangeStats(db, from, to) as DayStat[];
      set({ rangeStats });
    } catch {
      set({ rangeStats: [] });
    }
  },
}));
