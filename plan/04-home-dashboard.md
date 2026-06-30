# Plan: Home Dashboard

## Goal
Build the central home screen showing recent documents, favorites, collections, reading progress, storage overview, and quick actions.

## Layout

```
┌─────────────────────────┐
│  Header                  │
│  "Good morning, User"    │
│  Settings   Search  icon │
├─────────────────────────┤
│  Quick Actions Row       │
│  [Scan] [Import] [New]   │
├─────────────────────────┤
│  Recent Documents        │
│  ┌────┐ ┌────┐ ┌────┐   │
│  │Doc1│ │Doc2│ │Doc3│   │
│  └────┘ └────┘ └────┘   │
│  See All →               │
├─────────────────────────┤
│  Continue Reading        │
│  ┌──────────────────┐    │
│  │ Book Title   45%  │    │
│  └──────────────────┘    │
├─────────────────────────┤
│  Favorites               │
│  [icon] [icon] [icon]    │
├─────────────────────────┤
│  Collections             │
│  School  Work  Research   │
├─────────────────────────┤
│  Reading Stats Summary   │
│  Today: 15min  Streak: 5d│
├─────────────────────────┤
│  Storage Overview        │
│  Used: 2.3GB / 32GB     │
└─────────────────────────┘
```

## Components

- `DashboardHeader` — Greeting, search shortcut, settings button
- `QuickActionsRow` — Horizontal scrollable action buttons
- `RecentDocumentsGrid` — Horizontal scroll of document cards
- `ContinueReadingCard` — Single card with progress bar
- `FavoritesStrip` — Horizontal icon strip
- `CollectionsGrid` — Collection cards
- `StatsSummaryCard` — Today's reading stats + streak
- `StorageBar` — Storage usage indicator

## Data Sources

- `documentStore.recentDocuments` — recent from SQLite `reading_history`
- `documentStore.favorites` — from `favorites` table
- `libraryStore` — collections from `collections` table
- `statsStore` — today's stats from `reading_stats`

## States

- **Empty state**: Illustration + "Import your first document" CTA
- **Loading**: Skeleton placeholders for each section
- **Error**: Section-level error with retry button

## Implementation Order

1. DashboardHeader + QuickActionsRow
2. RecentDocumentsGrid (horizontal ScrollView)
3. ContinueReadingCard
4. FavoritesStrip
5. CollectionsGrid
6. StatsSummaryCard + StorageBar
7. Pull-to-refresh
8. Empty/loading/error states
