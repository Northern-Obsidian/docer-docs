# Plan: State Management

## Goal
Design Zustand stores for global application state.

## Store Architecture

### themeStore
```ts
interface ThemeState {
  theme: Theme;             // light, dark, amoled, sepia, etc.
  font: string;
  fontSize: number;
  lineSpacing: number;
  margins: number;
  brightness: number;
  orientation: 'portrait' | 'landscape' | 'auto';
  scrollDirection: 'vertical' | 'horizontal';
  animationEnabled: boolean;
  setTheme: (theme: Theme) => void;
  setFont: (font: string) => void;
  setFontSize: (size: number) => void;
  setLineSpacing: (spacing: number) => void;
  setMargins: (margins: number) => void;
  setBrightness: (brightness: number) => void;
  setOrientation: (orientation: string) => void;
  setScrollDirection: (direction: string) => void;
  toggleAnimation: () => void;
}
```

### documentStore
```ts
interface DocumentState {
  currentDocument: Document | null;
  recentDocuments: Document[];
  favorites: Document[];
  isLoading: boolean;
  openDocument: (id: string) => Promise<void>;
  closeDocument: () => void;
  fetchRecentDocuments: () => Promise<void>;
  fetchFavorites: () => Promise<void>;
  toggleFavorite: (id: string) => Promise<void>;
}
```

### libraryStore
```ts
interface LibraryState {
  documents: Document[];
  categories: CategoryCount[];
  selectedCategory: string | null;
  sortBy: 'name' | 'date' | 'type' | 'size';
  sortOrder: 'asc' | 'desc';
  viewMode: 'grid' | 'list';
  isLoading: boolean;
  setSelectedCategory: (category: string | null) => void;
  setSortBy: (sort: string) => void;
  setSortOrder: (order: string) => void;
  setViewMode: (mode: 'grid' | 'list') => void;
  fetchDocuments: () => Promise<void>;
  refreshLibrary: () => Promise<void>;
}
```

### searchStore
```ts
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
}

interface SearchFilters {
  fileTypes: string[];
  dateFrom: string | null;
  dateTo: string | null;
  inNotes: boolean;
  inBookmarks: boolean;
  inContent: boolean;
}
```

### readerStore
```ts
interface ReaderState {
  // PDF/EPUB reader state
  currentPage: number;
  totalPages: number;
  zoom: number;
  isScrolling: boolean;
  scrollMode: 'continuous' | 'single' | 'double';
  showThumbnails: boolean;
  showOutline: boolean;
  setCurrentPage: (page: number) => void;
  setZoom: (zoom: number) => void;
  setScrollMode: (mode: string) => void;
  toggleThumbnails: () => void;
  toggleOutline: () => void;
}
```

### navigationStore
```ts
interface NavigationState {
  currentRoute: string;
  tabs: TabInfo[];           // Open tabs (multi-document)
  activeTabId: string | null;
  setCurrentRoute: (route: string) => void;
  openTab: (doc: Document) => void;
  closeTab: (tabId: string) => void;
  switchTab: (tabId: string) => void;
}
```

### settingsStore
```ts
interface SettingsState {
  notificationsEnabled: boolean;
  readingGoalEnabled: boolean;
  dailyReadingGoal: number;
  appLockEnabled: boolean;
  appLockType: 'pin' | 'biometric' | null;
  setNotificationsEnabled: (enabled: boolean) => void;
  setReadingGoalEnabled: (enabled: boolean) => void;
  setDailyReadingGoal: (goal: number) => void;
  setAppLock: (enabled: boolean, type?: string) => void;
}
```

### statsStore
```ts
interface StatsState {
  todayStats: DailyStats;
  weeklyStats: WeeklyStats;
  monthlyStats: MonthlyStats;
  allTimeStats: AllTimeStats;
  readingStreak: number;
  fetchStats: () => Promise<void>;
  fetchReadingStreak: () => Promise<void>;
}
```

## Persistence

- **Stores persisted to MMKV**: themeStore, settingsStore, navigationStore (partial)
- **Stores backed by SQLite**: documentStore, libraryStore, searchStore, statsStore
- **Ephemeral stores**: readerStore (reset on document close)

## Implementation Notes

- Each store is a separate file under `src/stores/`
- Use `zustand/middleware` persist for MMKV-backed stores
- Async actions use try/catch with error state
- Avoid store circular dependencies
