# DOCER Implementation Plans

> Implementation plans for DOCER v1.0.0 — an offline-first document viewer and reader built with React Native + Expo.

## Architecture Overview

```
src/
├── app/          # Expo Router pages (file-based routing)
├── components/   # Shared UI components
├── constants/    # Theme, config constants
├── hooks/        # Shared React hooks
├── stores/       # Zustand state stores
├── db/           # SQLite database layer
├── storage/      # MMKV key-value storage
├── services/     # Business logic services
├── readers/      # Document reader engines
├── types/        # TypeScript type definitions
├── utils/        # Utility functions
└── features/     # Feature-specific modules (library, search, etc.)
```

## Plan Index

| # | Plan | Priority | Status |
|---|------|----------|--------|
| 01 | [Architecture & Navigation](./01-architecture.md) | High | Draft |
| 02 | [Database & Storage](./02-database-storage.md) | High | Draft |
| 03 | [State Management](./03-state-management.md) | High | Draft |
| 04 | [Home Dashboard](./04-home-dashboard.md) | Medium | Draft |
| 05 | [PDF Reader](./05-pdf-reader.md) | High | Draft |
| 06 | [EPUB Reader](./06-epub-reader.md) | High | Draft |
| 07 | [Office Reader](./07-office-reader.md) | Medium | Draft |
| 08 | [Text & Code Reader](./08-text-code-reader.md) | Medium | Draft |
| 09 | [Image Viewer](./09-image-viewer.md) | Medium | Draft |
| 10 | [Archive Explorer](./10-archive-explorer.md) | Medium | Draft |
| 11 | [Document Library](./11-document-library.md) | High | Draft |
| 12 | [Smart Search](./12-smart-search.md) | High | Draft |
| 13 | [Annotations](./13-annotations.md) | High | Draft |
| 14 | [Organization](./14-organization.md) | Medium | Draft |
| 15 | [Reading History & Stats](./15-reading-history-stats.md) | Medium | Draft |
| 16 | [File Manager](./16-file-manager.md) | Medium | Draft |
| 17 | [Themes & Customization](./17-themes-customization.md) | Medium | Draft |
| 18 | [Backup, Export & Share](./18-backup-export-share.md) | Medium | Draft |
| 19 | [Settings, Goals & Notifications](./19-settings-goals-notifications.md) | Medium | Draft |
| 20 | [Security & Accessibility](./20-security-accessibility.md) | Low | Draft |
| 21 | [Future Modules](./21-future-modules.md) | Low | Draft |

## Implementation Order

**Phase 1 — Foundation**
Architecture → Database & Storage → State Management → Theme System → Home Dashboard

**Phase 2 — Reading Core**
PDF Reader → EPUB Reader → Text/Code Reader → Image Viewer → Archive Explorer → Office Reader

**Phase 3 — Management**
Document Library → Smart Search → Annotations → Organization → Reading History & Stats

**Phase 4 — Productivity**
File Manager → Backup/Export/Share → Settings/Goals/Notifications

**Phase 5 — Polish**
Security & Accessibility → Future Modules
