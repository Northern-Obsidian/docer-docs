# Plan: Archive Explorer

## Goal
Allow users to browse archive contents (ZIP, RAR, 7Z, TAR) without extraction, with optional preview of documents inside.

## Architecture

```
readers/archive/
├── index.ts              # ArchiveExplorer component
├── archive-engine.ts     # Archive parsing (file listing)
├── file-list.tsx         # Scrollable file/folder tree
├── file-preview.tsx      # Preview supported files in-archive
├── extract-dialog.tsx    # Extract files confirmation
├── toolbar.tsx
└── types.ts
```

## Supported Formats

| Format | Listing | Preview | Extraction |
|--------|---------|---------|------------|
| ZIP    | Yes     | Yes     | Future     |
| RAR    | Yes     | Yes     | Future     |
| 7Z     | Yes     | Yes     | Future     |
| TAR    | Yes     | Yes     | Future     |

## Features

### Archive Browsing
- List contents with folder tree structure
- File icons by type
- File sizes
- Sort by name, size, type, date
- Search within archive

### In-Archive Preview
- Preview supported files without extraction:
  - Images (PNG, JPG, WEBP, GIF)
  - Text files (TXT, MD, JSON, XML, etc.)
  - PDFs (first page)
- Unsupported files show icon + size

### File Operations
- Extract single file
- Extract all (future)
- Share extracted file (future)

## Implementation Notes
- Use a native module or JS library for archive listing
- Options: `react-native-fs` + native unzip, or WASM-based unrar/7z
- For ZIP: Use `jszip` (pure JS, works cross-platform)
- For RAR/7z: Use native modules or WASM
- Preview: Extract to temp directory, open with appropriate reader

## States
- **Loading**: Parsing archive structure
- **Error**: Corrupted or unsupported archive
- **Password prompt**: For encrypted archives
- **Empty**: Archive contains no files
- **Extracting**: Progress bar during extraction

## Edge Cases
- Nested archives (ZIP inside ZIP): Show as file, allow reopening
- Very large archives (1GB+): Lazy-load file listing
- Archives with many files (10K+): Virtualized list
- Encrypted archives: Password prompt
- Archives with long paths: Truncate display, preserve full path for extraction
