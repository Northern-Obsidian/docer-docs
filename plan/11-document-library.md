# Plan: Document Library

## Goal
Build the document library that automatically indexes files, categorizes them, and provides browsing, sorting, and filtering.

## Architecture

```
features/library/
├── index.tsx             # LibraryScreen (grid/list view)
├── library-header.tsx    # Category tabs, sort, view toggle
├── document-card.tsx     # Grid item (thumbnail + name)
├── document-row.tsx      # List row (icon, name, date, size)
├── document-grid.tsx     # Grid layout with FlatList
├── document-list.tsx     # List layout with FlatList
├── category-bar.tsx      # Horizontal category filter chips
├── sort-picker.tsx       # Sort options sheet
├── filter-bar.tsx        # Advanced filter options
├── empty-state.tsx       # Empty library state
└── types.ts
```

## Categories

- All Documents (default)
- PDFs
- Books (EPUB, MOBI)
- Office (DOC, DOCX, XLS, XLSX, PPT, PPTX)
- Images (PNG, JPG, JPEG, GIF, WEBP, BMP, SVG)
- Archives (ZIP, RAR, 7Z, TAR)
- Text & Code (TXT, MD, JSON, XML, HTML, CSS, JS, TS, etc.)
- Downloads (files in Downloads folder)
- Favorites
- Recent

## Views

### Grid View
- 2-3 column grid
- Thumbnail preview (generated or generic icon)
- File name (truncated to 2 lines)
- File type badge (small icon)

### List View
- Single column
- File type icon (colored)
- File name
- File size + date
- Swipe actions: favorite, delete, info

## Features

### Auto-Indexing
- On first launch, scan device storage for supported file types
- Watch configured folders for new files
- Background indexing with progress notification

### Sort
- Name (A-Z, Z-A)
- Date added (newest, oldest)
- Date modified
- File type
- File size (largest, smallest)

### Filter (Advanced)
- By file type (checkbox multi-select)
- By date range
- By tags
- By collection
- By read status (read, unread, in progress)

### Search Integration
- Search bar at top → navigates to Smart Search
- Results filtered to current category

## Data Flow

1. FileScanner service walks configured directories
2. For each supported file, creates/updates DB record
3. Generates thumbnail for PDF/Image/Office files
4. Library screen queries SQLite with sort/filter params
5. Pull-to-refresh triggers re-scan

## States
- **Loading**: Skeleton grid/list
- **Empty**: "No documents found" with import CTA
- **Empty (filtered)**: "No documents match filters" with clear filter button
- **Scanning**: Progress banner at top during initial index
- **Error**: Database error with retry

## Performance
- Thumbnails: Generated async, cached in filesystem
- FlatList with `windowSize` tuning for smooth scrolling
- Debounce sort/filter changes (300ms)
- Batch DB inserts during indexing (100 at a time)
