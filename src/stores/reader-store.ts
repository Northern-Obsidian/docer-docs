import { create } from 'zustand';
import type { ScrollMode } from '@/types';

interface ReaderState {
  currentPage: number;
  totalPages: number;
  zoom: number;
  scrollMode: ScrollMode;
  showThumbnails: boolean;
  showOutline: boolean;
  isSearching: boolean;
  searchQuery: string;
  setCurrentPage: (page: number) => void;
  setTotalPages: (pages: number) => void;
  setZoom: (zoom: number) => void;
  setScrollMode: (mode: ScrollMode) => void;
  toggleThumbnails: () => void;
  toggleOutline: () => void;
  setSearchQuery: (query: string) => void;
  setIsSearching: (isSearching: boolean) => void;
  reset: () => void;
}

export const useReaderStore = create<ReaderState>((set) => ({
  currentPage: 1,
  totalPages: 0,
  zoom: 1.0,
  scrollMode: 'continuous',
  showThumbnails: false,
  showOutline: false,
  isSearching: false,
  searchQuery: '',

  setCurrentPage: (currentPage) => set({ currentPage }),
  setTotalPages: (totalPages) => set({ totalPages }),
  setZoom: (zoom) => set({ zoom }),
  setScrollMode: (scrollMode) => set({ scrollMode }),
  toggleThumbnails: () => set((s) => ({ showThumbnails: !s.showThumbnails })),
  toggleOutline: () => set((s) => ({ showOutline: !s.showOutline })),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setIsSearching: (isSearching) => set({ isSearching }),
  reset: () => set({
    currentPage: 1, totalPages: 0, zoom: 1.0,
    scrollMode: 'continuous', showThumbnails: false,
    showOutline: false, isSearching: false, searchQuery: '',
  }),
}));
