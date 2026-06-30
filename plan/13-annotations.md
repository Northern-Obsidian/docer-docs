# Plan: Annotations

## Goal
Implement a complete annotation system with bookmarks, highlights, and notes across all document types.

## Architecture

```
features/annotations/
├── bookmarks/
│   ├── bookmark-list.tsx      # List of all bookmarks
│   ├── bookmark-button.tsx    # Toggle bookmark on toolbar
│   ├── bookmark-folder.tsx    # Folder organization for bookmarks
│   └── services/
│       └── bookmark-service.ts
├── highlights/
│   ├── highlight-list.tsx     # List of all highlights
│   ├── highlight-selector.tsx # Color picker overlay
│   ├── highlight-renderer.tsx # Inline highlight in text
│   └── services/
│       └── highlight-service.ts
├── notes/
│   ├── note-list.tsx          # List of all notes
│   ├── note-editor.tsx        # Rich text note editor
│   ├── note-card.tsx          # Inline note display
│   └── services/
│       └── note-service.ts
├── annotation-provider.tsx    # Context provider for reader integration
└── types.ts
```

## Bookmarks

### Features
- Bookmark current page/chapter/position
- Bookmark label/name (editable)
- Organize bookmarks into folders
- Reorder bookmarks within folders
- View all bookmarks across documents
- Tap bookmark → navigate to position
- Swipe to delete bookmark

### Data Model
```ts
interface Bookmark {
  id: string;
  documentId: string;
  page?: number;
  chapter?: string;
  position?: { scrollOffset: number; elementSelector?: string };
  label: string;
  folderId?: string;
  createdAt: string;
}
```

## Highlights

### Features
- Select text → highlight with color picker
- Highlight colors: Yellow, Blue, Green, Pink, Orange
- Remove highlight (tap → delete)
- View all highlights grouped by document
- Tap highlight → navigate to exact position
- Export highlights as text

### Data Model
```ts
interface Highlight {
  id: string;
  documentId: string;
  page: number;
  color: 'yellow' | 'blue' | 'green' | 'pink' | 'orange';
  text: string;
  position: { startOffset: number; endOffset: number; startElement?: string; endElement?: string };
  createdAt: string;
}
```

## Notes

### Features
- Create notes attached to page/paragraph/document level
- Rich text editing (bold, italic, lists via Markdown)
- View all notes grouped by document
- Search within notes
- Edit/delete notes
- Export notes

### Data Model
```ts
interface Note {
  id: string;
  documentId: string;
  page?: number;
  paragraphIndex?: number;
  content: string;       // Markdown-formatted rich text
  createdAt: string;
  updatedAt: string;
}
```

## Reader Integration

Each reader type integrates annotations via `AnnotationProvider`:

- **PDF**: Long-press text → select → highlight/note
- **EPUB**: Long-press text → select → highlight/note
- **Text/MD**: Long-press → select → highlight/note
- **Image**: Note at image level only (no text selection)

### Annotation Toolbar (in reader)
- Toggle highlight mode on/off
- Color picker when highlight mode active
- "Add note" button
- View annotations on current page button
- Annotation indicator dots on scrollbar/thumbnails

## Implementation Order

1. Bookmark system (add, list, navigate)
2. Bookmark folders
3. Highlight system (PDF + EPUB)
4. Note system (create, edit, list)
5. Annotation export
6. Cross-document annotation browser
