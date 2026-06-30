# Plan: Architecture & Navigation

## Goal
Establish the project's folder structure, navigation system, and foundational app shell.

## Folder Structure

```
src/
├── app/                   # Expo Router pages
│   ├── _layout.tsx        # Root layout (providers, theme)
│   ├── index.tsx          # Home Dashboard
│   ├── explore.tsx        # Document Library
│   ├── library/           # Library sub-routes
│   │   ├── _layout.tsx
│   │   ├── index.tsx
│   │   ├── [id].tsx       # Document detail
│   │   └── collections.tsx
│   ├── reader/            # Reader routes
│   │   ├── _layout.tsx
│   │   ├── pdf/[id].tsx
│   │   ├── epub/[id].tsx
│   │   ├── text/[id].tsx
│   │   ├── image/[id].tsx
│   │   ├── office/[id].tsx
│   │   └── archive/[id].tsx
│   ├── search/            # Search routes
│   │   ├── _layout.tsx
│   │   └── index.tsx
│   ├── bookmarks/         # Bookmarks route
│   │   └── index.tsx
│   ├── notes/             # Notes route
│   │   └── index.tsx
│   ├── settings/          # Settings routes
│   │   ├── _layout.tsx
│   │   ├── index.tsx
│   │   ├── appearance.tsx
│   │   ├── storage.tsx
│   │   ├── backup.tsx
│   │   ├── security.tsx
│   │   └── about.tsx
│   └── stats/             # Reading statistics
│       └── index.tsx
├── components/            # Shared UI components
│   ├── ui/                # Primitives (Button, Card, etc.)
│   ├── reader/            # Reader-shared components
│   ├── library/           # Library-shared components
│   └── layout/            # Shell components (header, tabs)
├── constants/             # Theme, typography, config
├── hooks/                 # Shared hooks
├── stores/                # Zustand stores
├── db/                    # SQLite layer
├── storage/               # MMKV storage layer
├── services/              # Business logic
├── readers/               # Reader engine implementations
├── types/                 # Shared TypeScript types
└── utils/                 # Utilities
```

## Navigation Architecture

- **Root Layout** (`_layout.tsx`): Wraps app with ThemeProvider, DB init, splash screen
- **Tab Navigation**: Home, Library, Search, Bookmarks, Settings (bottom tabs)
- **Stack Navigation**: Reader routes push on top of tabs
- **Deep Linking**: Support `docer://` scheme for document opening

## App Shell

- StatusBar configuration
- GestureHandlerRootView wrapper
- SafeAreaProvider
- Database connection provider
- Theme provider

## Key Decision Points

- Use Expo Router's file-based routing for all screens
- Tab bar icons from Lucide Icons
- Reader screens use stack navigation (no tabs visible while reading)
- Modal presentation for file info, share sheet
