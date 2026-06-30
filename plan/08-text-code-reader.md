# Plan: Text & Code Reader

## Goal
Provide an optimized reading experience for plain text, Markdown, and source code files with syntax highlighting.

## Architecture

```
readers/text/
├── index.ts              # TextReader component
├── markdown-renderer.tsx # Markdown → styled view
├── code-viewer.tsx       # Syntax-highlighted code viewer
├── plain-text.tsx        # Plain text renderer
├── toolbar.tsx
├── search-bar.tsx
└── types.ts
```

## Supported Formats

- **Plain text**: TXT, LOG, CFG, INI, ENV
- **Markdown**: MD, MDX
- **Code**: JSON, XML, HTML, CSS, JS, TS, JSX, TSX, Java, C, C++, Python, PHP, SQL, YAML, and more

## Features

### Plain Text
- Large file support with virtualized rendering (lazy-load chunks)
- Line numbers toggle
- Word wrap toggle
- Font: monospace or system
- Font size adjustment
- Search within text

### Markdown
- Parse MD → styled native components (not WebView)
- Support headings (H1–H6), paragraphs, lists, code blocks, tables, blockquotes
- Images rendered inline
- Links tappable (open in-app or external)
- Code blocks with syntax highlighting
- TOC auto-generation from headings
- Dark mode support

### Code Viewer
- Language auto-detection from file extension
- Syntax highlighting using a library (e.g., `react-syntax-highlighter` or custom)
- Theme: Light, Dark, Monokai, GitHub, etc.
- Line numbers
- Copy to clipboard
- Search within code

## Performance

### Large Files (>10MB)
- Use react-native `FlatList` with windowed rendering
- Load file in chunks (e.g., 1000 lines at a time)
- Display "File is large (X MB)" warning with option to proceed
- Estimated line count from file size

## Implementation Order

1. Plain text viewer with search
2. Markdown renderer (headings, lists, code blocks, images)
3. Syntax highlighting engine
4. Code viewer integration
5. Large file optimization
6. Line numbers, word wrap toggles

## States
- **Loading**: Progress for large files
- **Error**: Unreadable encoding, binary file detection
- **Encoding detection**: Auto-detect UTF-8, UTF-16, Latin-1
- **Binary warning**: "This appears to be a binary file" with abort option

## Edge Cases
- Mixed encoding: Fall back to UTF-8 with replacement chars
- Extremely long lines: Horizontal scroll option
- Very deep Markdown nesting: Limit heading depth
- Emoji and special characters: Ensure UTF-8 rendering
- Right-to-left text: Support if detected
