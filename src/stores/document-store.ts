import { create } from 'zustand';
import type { Document } from '@/types';
import { getDb } from '@/db/connection';
import { getRecentDocuments, getDocumentById } from '@/db/documents';
import { getFavorites, toggleFavorite as dbToggleFavorite, isFavorite } from '@/db/favorites';

interface DocumentState {
  currentDocument: Document | null;
  recentDocuments: (Document & { lastReadAt: string; progress: number })[];
  favorites: Document[];
  favoriteIds: Set<string>;
  isLoading: boolean;
  openDocument: (id: string) => Promise<void>;
  closeDocument: () => void;
  fetchRecentDocuments: () => Promise<void>;
  fetchFavorites: () => Promise<void>;
  toggleFavorite: (id: string) => Promise<void>;
}

export const useDocumentStore = create<DocumentState>((set, get) => ({
  currentDocument: null,
  recentDocuments: [],
  favorites: [],
  favoriteIds: new Set(),
  isLoading: false,

  openDocument: async (id) => {
    const db = await getDb();
    const doc = await getDocumentById(db, id);
    set({ currentDocument: doc });
  },

  closeDocument: () => {
    set({ currentDocument: null });
  },

  fetchRecentDocuments: async () => {
    const db = await getDb();
    const docs = await getRecentDocuments(db);
    set({ recentDocuments: docs });
  },

  fetchFavorites: async () => {
    const db = await getDb();
    const favs = await getFavorites(db);
    set({ favorites: favs as Document[] });
  },

  toggleFavorite: async (id) => {
    const db = await getDb();
    const nowFav = await dbToggleFavorite(db, id);
    const { favoriteIds } = get();
    const next = new Set(favoriteIds);
    if (nowFav) next.add(id);
    else next.delete(id);
    set({ favoriteIds: next });
    get().fetchFavorites();
  },
}));
