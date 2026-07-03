import { create } from 'zustand';
import { getDb } from '@/db/connection';
import { searchAll } from '@/db/search';
import { appStorage } from '@/storage';

interface SearchFilters {
  fileTypes: string[];
  inNotes: boolean;
  inBookmarks: boolean;
  inContent: boolean;
}

interface SearchResult {
  documentId: string;
  documentName: string;
  documentType: string;
  snippet: string;
  rank: number;
  matchType: 'name' | 'content';
}

interface SearchState {
  query: string;
  results: SearchResult[];
  recentSearches: string[];
  filters: SearchFilters;
  isSearching: boolean;
  setQuery: (query: string) => void;
  setFilters: (filters: Partial<SearchFilters>) => void;
  search: () => Promise<void>;
  clearSearch: () => void;
  loadRecentSearches: () => void;
}

export const useSearchStore = create<SearchState>((set, get) => ({
  query: '',
  results: [],
  recentSearches: [],
  filters: { fileTypes: [], inNotes: false, inBookmarks: false, inContent: true },
  isSearching: false,

  loadRecentSearches: () => {
    set({ recentSearches: appStorage.getSearchHistory() });
  },

  setQuery: (query) => set({ query }),

  setFilters: (filters) => {
    set((s) => ({ filters: { ...s.filters, ...filters } }));
  },

  search: async () => {
    const { query } = get();
    if (!query.trim()) {
      set({ results: [] });
      return;
    }
    set({ isSearching: true });
    try {
      appStorage.addSearchHistory(query);
      const db = await getDb();
      const results = await searchAll(db, query);
      set({ results, isSearching: false, recentSearches: appStorage.getSearchHistory() });
    } catch {
      set({ isSearching: false });
    }
  },

  clearSearch: () => {
    set({ query: '', results: [] });
  },
}));
