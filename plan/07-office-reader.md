# Plan: Office Reader

## Goal
Enable reading Microsoft Office documents (DOCX, DOC, XLSX, XLS, PPTX, PPT) with fast rendering, zoom, and search.

## Architecture

```
readers/office/
├── index.ts              # OfficeReader component
├── word-viewer.tsx       # Word document renderer
├── excel-viewer.tsx      # Spreadsheet renderer
├── ppt-viewer.tsx        # Presentation renderer
├── office-engine.ts      # Shared parsing/conversion logic
├── toolbar.tsx
├── search-bar.tsx
└── types.ts
```

## Rendering Approach

**Option A (Recommended): WebView-based**
- Use `mammoth.js` for DOCX → HTML conversion
- Use `sheetjs` (xlsx) for XLSX → HTML table conversion
- Use `pptxjs` for PPTX → HTML slide conversion
- Render resulting HTML in WebView
- Pros: Cross-platform, no native dependencies
- Cons: Limited fidelity for complex layouts

**Option B: Native module**
- Use platform-specific libraries
- Pros: Better fidelity
- Cons: Maintenance burden, platform-specific bugs

## Features

### Word Viewer
- Convert DOCX to styled HTML
- Support headings, paragraphs, lists, tables, images
- Font and styling preservation
- Zoom (pinch-to-zoom on WebView)
- Night mode (invert colors)

### Spreadsheet Viewer
- Render as scrollable HTML table
- Column widths, row heights preserved
- Cell formatting (bold, colors, alignment)
- Frozen panes support (scrollable headers)
- Search within cells
- Zoom

### Presentation Viewer
- Convert slides to images or HTML
- Swipe left/right between slides
- Slide thumbnails (grid overview)
- Zoom on individual slides
- Notes display option

## Implementation Order

1. DOCX viewer (most common format)
2. XLSX viewer
3. PPTX viewer
4. DOC/XLS/PPT support (legacy formats)
5. Search across all office types

## States
- **Converting**: Progress indicator during conversion
- **Rendering**: WebView loading state
- **Error**: Format conversion failure with fallback "Open as text"
- **Unsupported features**: Warning banner for unsupported elements

## Edge Cases
- Very large spreadsheets (100K+ rows): Virtual scrolling
- Embedded media (video/audio): Show placeholder
- Password-protected docs: Prompt for password
- Corrupted files: Graceful error handling
- Complex formatting: Degrade gracefully, show plain-text fallback
