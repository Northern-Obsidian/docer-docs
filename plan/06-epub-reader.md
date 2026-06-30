# Plan: EPUB Reader

## Goal
Implement a reflowable EPUB reader with font/themes customization, chapter navigation, bookmarks, and notes.

## Architecture

```
readers/epub/
├── index.ts              # EPUBReader component
├── epub-engine.ts        # EPUB parsing and rendering
├── pages/
│   ├── chapter-view.tsx  # Single chapter renderer
│   └── chapter-list.tsx  # Chapter navigation
├── toolbar.tsx
├── bottom-bar.tsx
├── font-controls.tsx     # Font size, family, spacing
├── theme-picker.tsx      # Inline theme switching
├── types.ts
└── utils.ts
```

## Features

### Rendering
- Parse EPUB (unzip, read OPF, parse XHTML/HTML)
- Render reflowable text using WebView or custom renderer
- Apply CSS for font, size, margins, line height, theme
- Respect EPUB's built-in CSS while allowing user overrides

### Chapter Navigation
- Extract chapter list from EPUB spine/toc.ncx
- Side drawer with chapter tree
- Swipe left/right for next/prev chapter
- Chapter progress indicator

### Font Customization
- Font family: system fonts + bundled fonts
- Font size: range 12–48pt
- Line spacing: 1.0–2.5
- Margins: narrow–wide
- Text alignment: left, justify, center

### Themes
- Light, Dark, Sepia, AMOLED
- Background color + text color
- Apply CSS variables to WebView

### Annotations
- Long-press to select text → highlight or add note
- View existing highlights inline
- Bookmark current position

### Progress & Position
- Save reading position (chapter ID + character offset)
- Progress bar (% complete)
- Continue reading from last position

### Search
- Search within EPUB content
- Results shown with chapter + context

## Implementation Notes
- Use `jszip` or native unzip for EPUB extraction
- Render in WebView for best HTML/CSS support
- Inject custom CSS via `injectedJavaScript`
- Cache parsed EPUB metadata and chapter list
- Support reflowable (not fixed-layout) EPUBs initially

## States
- **Loading**: Parsing EPUB structure
- **Error**: Invalid EPUB format
- **Empty**: No content
- **Chapter loading**: Spinner when switching chapters

## Edge Cases
- EPUBs with no TOC: Auto-generate chapter detection from heading tags
- Very large EPUBs: Lazy-load chapters
- Embedded fonts: Allow through or block based on setting
- Images in EPUB: Render inline with max-width constraint
- RTL languages: Support right-to-left text direction
