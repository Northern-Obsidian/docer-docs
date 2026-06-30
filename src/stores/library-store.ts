import { create } from 'zustand';
import type { Document, ViewMode, SortBy, SortOrder } from '@/types';
import { getDb } from '@/db/connection';
import { getAllDocuments, getDocumentsByType, getCategoryCounts } from '@/db/documents';

interface CategoryCount {
  type: string;
  count: number;
}

interface LibraryState {
  documents: Document[];
  categories: CategoryCount[];
  selectedCategory: string | null;
  sortBy: SortBy;
  sortOrder: SortOrder;
  viewMode: ViewMode;
  isLoading: boolean;
  setSelectedCategory: (category: string | null) => void;
  setSortBy: (sort: SortBy) => void;
  setSortOrder: (order: SortOrder) => void;
  setViewMode: (mode: ViewMode) => void;
  fetchDocuments: () => Promise<void>;
  fetchCategories: () => Promise<void>;
  refreshLibrary: () => Promise<void>;
}

export const useLibraryStore = create<LibraryState>((set, get) => ({
  documents: [],
  categories: [],
  selectedCategory: null,
  sortBy: 'date',
  sortOrder: 'desc',
  viewMode: 'grid',
  isLoading: false,

  setSelectedCategory: (selectedCategory) => { set({ selectedCategory }); get().fetchDocuments(); },
  setSortBy: (sortBy) => { set({ sortBy }); get().fetchDocuments(); },
  setSortOrder: (sortOrder) => { set({ sortOrder }); get().fetchDocuments(); },
  setViewMode: (viewMode) => set({ viewMode }),

  fetchDocuments: async () => {
    set({ isLoading: true });
    try {
      const db = await getDb();
      const { selectedCategory, sortBy, sortOrder } = get();
      let docs: Document[];
      if (selectedCategory && selectedCategory !== 'all') {
        docs = await getDocumentsByType(db, selectedCategory);
      } else {
        docs = await getAllDocuments(db);
      }
      docs.sort((a, b) => {
        let cmp = 0;
        if (sortBy === 'name') cmp = a.name.localeCompare(b.name);
        else if (sortBy === 'date') cmp = new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
        else if (sortBy === 'type') cmp = a.type.localeCompare(b.type);
        else if (sortBy === 'size') cmp = (b.size || 0) - (a.size || 0);
        return sortOrder === 'asc' ? cmp : -cmp;
      });
      set({ documents: docs, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  fetchCategories: async () => {
    const db = await getDb();
    const cats = await getCategoryCounts(db);
    set({ categories: cats });
  },

  refreshLibrary: async () => {
    await get().fetchDocuments();
    await get().fetchCategories();
  },
}));
