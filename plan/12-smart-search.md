# Plan: Smart Search

## Goal
Implement a powerful search system using SQLite FTS5 that searches filenames, content, notes, bookmarks, tags, and metadata.

## Architecture

```
features/search/
├── index.tsx             # SearchScreen
├── search-bar.tsx        # Animated search input
├── search-filters.tsx    # Filter chips and advanced filters
├── search-results.tsx    # Results list with context snippets
├── search-result-item.tsx # Single result row
├── recent-searches.tsx   # Recent search history
├── search-suggestions.tsx # Auto-complete suggestions
└── services/
    └── search-service.ts # Search orchestration logic
```

## Search Types

| Type | Source | Engine |
|------|--------|--------|
| Filename | SQLite `documents` table | FTS5 on name, author |
| Content (PDF) | Extracted text index | FTS5 (future: OCR) |
| Content (EPUB) | Extracted text index | FTS5 |
| Content (TXT/MD) | Extracted text index | FTS5 |
| Notes | SQLite `notes` table | FTS5 on content |
| Bookmarks | SQLite `bookmarks` table | LIKE query on label |
| Tags | SQLite `tags` table | Exact match |
| Metadata | SQLite `documents.metadata` | JSON extract + LIKE |

## Search Service

```ts
interface SearchService {
  search(params: SearchParams): Promise<SearchResult[]>;
  getSuggestions(query: string): Promise<string[]>;
  getRecentSearches(): string[];
  saveRecentSearch(query: string): void;
  clearRecentSearches(): void;
}

interface SearchParams {
  query: string;
  filters: {
    fileTypes?: string[];
    dateFrom?: string;
    dateTo?: string;
    inNotes?: boolean;
    inBookmarks?: boolean;
    inContent?: boolean;
    inFilenames?: boolean;
  };
  sort?: 'relevance' | 'date' | 'name';
  limit?: number;
  offset?: number;
}
```

## UI Features

### Search Bar
- Animated expand/collapse
- Clear button
- Voice search button (future)

### Filters
- Horizontal chip row: "All", "PDFs", "Books", "Office", "Images", "Notes"
- Expandable advanced filters panel
- Active filter count badge

### Results
- Grouped by document (with child highlights/notes)
- Snippet with matched text highlighted
- File type icon + name
- Breadcrumb: location path
- Tap → open document at relevant position

### Recent Searches
- Show last 10 unique searches
- Tap to re-search
- Swipe to delete individual entry
- "Clear all" button

### Suggestions
- Auto-complete from filenames and tags
- Show as dropdown below search bar
- Debounced (300ms)

## Ranking

Results ranked by:
1. Filename exact match (highest)
2. Filename partial match
3. Content match (multiple matches rank higher)
4. Tag match
5. Note/bookmark match
6. Metadata match

## Implementation Notes

- Use SQLite FTS5 for full-text search queries
- Content extraction: Extract text during document indexing
- PDF text extraction via PDF library
- EPUB text extraction from XHTML content
- Store extracted text in FTS tables
- Use `MATCH` syntax with `*` prefix for partial matching
- Limit results to 100, with pagination (load more)

## States
- **Idle**: Recent searches + suggestions
- **Searching**: Spinner + "Searching..." text
- **Results**: List of grouped results
- **No results**: "No results for 'query'" with suggestions
- **Error**: Search failed with retry
