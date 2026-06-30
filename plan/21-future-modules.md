# Plan: Future Modules

## Goal
Define the architecture and design for future features that will extend DOCER into a complete productivity platform.

## Future Feature Pipeline

### Phase A (Post-v1.0)
- OCR document scanner
- MOBI support
- CBR support
- Split view (dual document)
- Markdown editor
- Print support

### Phase B (v2.0)
- AI Assistant (local/cloud)
- Cloud sync (optional)
- Cloud storage connectors
- Digital signatures

### Phase C (v3.0+)
- Desktop application
- Progressive Web App (PWA)
- Collaborative document review
- Note-taking workspace
- Git repository browser
- Citation manager

---

## OCR Module (Future)

### Architecture
```
future/ocr/
├── ocr-engine.ts          # Tesseract.js or native OCR
├── ocr-scanner-screen.tsx # Camera-based document scanner
├── text-extraction.ts     # Image → text pipeline
├── ocr-results.tsx        # Review and correct OCR text
└── types.ts
```

### Features
- Scan documents with camera
- Extract text from images and scanned PDFs
- Perspective correction and image cleanup
- Multi-language support
- Batch OCR for multi-page documents
- Export OCR results as text/searchable PDF

---

## AI Assistant (Future)

### Architecture
```
future/ai/
├── ai-service.ts          # LLM integration (local/cloud)
├── ai-provider.ts         # Provider abstraction (Ollama, OpenAI, etc.)
├── summary-view.tsx       # Document summary display
├── qa-interface.tsx       # Q&A interface for documents
├── flashcard-view.tsx     # Generated flashcards
├── explain-panel.tsx      # Concept explanation
├── translate-panel.tsx    # Inline translation
└── types.ts
```

### Features
- **Summarization**: Generate document summaries (TL;DR)
- **Q&A**: Answer questions about document content using RAG
- **Explanation**: Explain difficult concepts from the text
- **Translation**: Translate text passages
- **Flashcards**: Auto-generate flashcards from content
- **Key Points**: Extract key points and action items
- **Local-first**: Support local models via Ollama/Llama.cpp
- **Optional Cloud**: OpenAI API or similar as opt-in

---

## Cloud Sync (Future)

### Architecture
```
future/sync/
├── sync-service.ts        # Sync orchestration
├── sync-provider.ts       # Provider abstraction
├── conflict-resolver.tsx  # Conflict resolution UI
├── sync-status.tsx        # Sync status indicator
└── providers/
    ├── webdav.ts          # WebDAV support
    ├── googledrive.ts     # Google Drive connector
    ├── onedrive.ts        # OneDrive connector
    ├── dropbox.ts         # Dropbox connector
    └── custom.ts          # Custom WebDAV endpoint
```

### Principles
- Offline-first: All features work without sync
- Optional: User must explicitly enable sync
- Encrypted: Data encrypted before upload
- Conflict resolution: Last-write-wins with history
- Selective sync: Choose which collections/folders to sync

---

## Split View (Future)

### Implementation
- Two-pane layout in landscape/tablet
- Drag handle to resize panes (50/50, 60/40, 70/30)
- Each pane independently opens any document
- Sync scroll between panes (for comparison)
- Bookmarks/notes remain per-document

---

## Markdown Editor (Future)

### Features
- Live preview split pane
- Markdown syntax highlighting
- Insert images, links, tables
- Export to PDF/HTML
- Open existing MD files
- Save to device

---

## Desktop Application (Future)

- Electron or Tauri wrapper
- Native file system access (full directory tree)
- System tray integration
- File type association
- Drag-and-drop support
- Keyboard shortcuts
- Multiple windows

---

## PWA (Future)

- WebAssembly-based readers for PDF/EPUB
- Service worker for offline access
- IndexedDB for storage
- File System Access API for local files
- Share target API

---

## Implementation Guidelines for Future Modules

1. Each future module should be independently implementable
2. Use plugin/extension architecture where possible
3. Feature flags to hide incomplete modules
4. All future modules respect the offline-first principle
5. API-first design enables multiple UIs (mobile, desktop, web)
