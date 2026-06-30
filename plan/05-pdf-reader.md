# Plan: PDF Reader

## Goal
Implement a professional PDF reader with fast rendering, zoom, scrolling modes, navigation, and annotation support.

## Architecture

```
readers/pdf/
├── index.ts              # PDFReader component (orchestrator)
├── pdf-engine.ts         # PDF rendering engine wrapper
├── pdf-engine.web.ts     # Web-specific PDF rendering (PDF.js)
├── pages/
│   ├── pdf-page.tsx      # Single page renderer
│   └── pdf-thumbnail.tsx # Thumbnail renderer
├── toolbar.tsx           # Top toolbar (title, actions)
├── bottom-bar.tsx        # Bottom controls (page nav, zoom)
├── sidebar.tsx           # Side drawer (thumbnails, outline)
├── overlay.tsx           # Tap zone overlays for navigation
├── types.ts
└── utils.ts
```

## Features

### Rendering
- Render PDF page-by-page using a native PDF library
- Use `react-native-pdf` or custom native module for Android/iOS
- Use `pdfjs-dist` for web
- Render at screen resolution with downscale for performance
- Cache rendered pages in memory (LRU cache, max ~20 pages)

### Scrolling Modes
- **Continuous**: Vertical scroll with all pages
- **Single Page**: One page at a time, swipe to advance
- **Double Page**: Two pages side-by-side (landscape)

### Zoom & Pan
- Pinch-to-zoom with `react-native-gesture-handler`
- Double-tap to zoom in/out
- Pan when zoomed in
- Zoom range: 0.5x to 5.0x

### Navigation
- Page number input
- Previous/Next buttons
- Swipe left/right in single page mode
- Scroll in continuous mode
- Outline navigation (table of contents)
- Internal link navigation

### Toolbar
- Document title (truncated)
- Search button
- Bookmark toggle
- Outline toggle
- Thumbnails toggle
- More menu (share, print, info)

### Bottom Bar
- Current page / total pages
- Zoom controls (+ / - / reset)
- Scroll mode toggle

### Sidebar (Drawer)
- **Thumbnails**: Grid of small page previews
- **Outline**: Tree view of document structure

### Annotations
- Highlight text (long-press selection)
- Add notes to pages
- View existing highlights/notes

### Night Mode
- Invert colors or apply dark overlay
- Sepia mode

## Performance Targets
- Open PDF < 1 second for files under 50MB
- Smooth scrolling at 60fps
- Memory usage < 200MB for large documents
- Page render < 100ms

## States
- **Loading**: Progress bar while document loads
- **Password prompt**: For encrypted PDFs
- **Error**: Corrupt file error with message
- **Empty**: No pages (shouldn't happen)
- **Rendering**: Page-level loading placeholder

## Edge Cases
- Very large PDFs (1000+ pages): Virtualized list, render only visible pages
- Password-protected: Prompt for password, cache in session
- Embedded fonts: Ensure correct rendering
- Forms: Read-only display initially
- Corrupted PDFs: Graceful error with recovery suggestion
