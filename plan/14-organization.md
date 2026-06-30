# Plan: Organization

## Goal
Provide users with flexible document organization through collections, tags, and favorites.

## Architecture

```
features/organization/
├── collections/
│   ├── collection-list.tsx    # Grid/list of collections
│   ├── collection-detail.tsx  # Documents in a collection
│   ├── collection-editor.tsx  # Create/edit collection
│   ├── collection-picker.tsx  # Modal to pick/add to collections
│   └── services/
│       └── collection-service.ts
├── tags/
│   ├── tag-list.tsx           # Tag cloud/badge list
│   ├── tag-editor.tsx         # Create/edit/delete tags
│   ├── tag-picker.tsx         # Modal to assign tags
│   ├── tag-badge.tsx          # Individual tag pill/chip
│   └── services/
│       └── tag-service.ts
├── favorites/
│   ├── favorite-button.tsx    # Heart/star toggle
│   ├── favorite-list.tsx      # All favorites
│   └── services/
│       └── favorite-service.ts
└── types.ts
```

## Collections

### Features
- Create custom collections (e.g., "School", "Work", "Research")
- Each collection has name, icon, color
- Add/remove documents from collections
- Document can belong to multiple collections
- Reorder collections manually
- Default collections on first launch: School, Work, Research, Books, Finance, Personal
- Collection detail shows grid of contained documents
- Pin collections to home dashboard
- Share collection (future)

### Data Model
```ts
interface Collection {
  id: string;
  name: string;
  icon?: string;
  color?: string;
  sortOrder: number;
  pinnedToHome: boolean;
  createdAt: string;
}
```

## Tags

### Features
- Create custom tags (e.g., "Important", "Exam", "Invoice", "Project")
- Tags have name + optional color
- Assign multiple tags to a document
- Tag cloud view (sized by usage count)
- Filter library by tag
- Tap tag badge → show all documents with that tag
- Merge tags
- Rename/delete tags (reassign or remove)

### Data Model
```ts
interface Tag {
  id: string;
  name: string;
  color?: string;
}
```

## Favorites

### Features
- Toggle favorite from any document context (toolbar, card, row)
- Heart/star icon, animated toggle
- Favorites section on home dashboard
- Quick filter in library: "Favorites"
- Favorites persisted to SQLite

## UI Integration Points

- **Document Card/Row**: Favorite icon top-right, collection badges, tag chips
- **Document Info Panel**: Full list of collections + tags with edit button
- **Library Filter Bar**: Filter by collection, filter by tag
- **Document Context Menu** (long-press): "Add to collection", "Add tag", "Toggle favorite"
- **Library Header**: Favorites shortcut button

## Implementation Order

1. Favorites (quick win, used everywhere)
2. Collections CRUD + document assignment
3. Tags CRUD + document assignment
4. Collection/Tag filter integration in library
5. Home dashboard integration
6. Tag cloud and statistics
