# DOCER

An offline-first document viewer, reader, and file management platform built with React Native and Expo.

## Features

- **Multi-format support**: PDF, EPUB, DOC/DOCX, XLS/XLSX, PPT/PPTX, TXT, Markdown, CSV, code files, images, and archives
- **6 specialized readers**: PDF (WebView/PDF.js), EPUB (custom parser), Office (mammoth/xlsx/XML), Text/Code (syntax highlighting), Image (zoom/rotate), Archive (browse/extract)
- **Full-text search**: FTS5-powered search across document names, content, and notes
- **Annotations**: Bookmarks, highlights (5 colors), and notes per document
- **Organization**: Collections, tags, favorites, and document filtering
- **Reading statistics**: Daily stats, streaks, weekly/monthly charts
- **Themes**: 9 built-in themes (light, dark, AMOLED, sepia, paper, midnight, forest, ocean, glass)
- **Security**: PIN/biometric app lock, note encryption, hidden documents
- **Export**: Export library, notes, highlights, bookmarks, and stats as CSV
- **Backup**: Database backup and restore with sharing
- **Offline-first**: No cloud dependency, all data stored locally

## Tech Stack

- Expo SDK 56 with Expo Router (file-based routing)
- React Native 0.85.3, React 19.2.3
- TypeScript 6.0
- NativeWind / Tailwind CSS 3.4
- Zustand for state management
- SQLite (expo-sqlite) with FTS5 full-text search
- MMKV for fast key-value storage
- Lucide icons
- React Native WebView for PDF, EPUB, text, and office rendering
- React Native Reanimated for animations

## Get Started

1. Install dependencies
   ```bash
   npm install
   ```

2. Start the app
   ```bash
   npx expo start
   ```

3. Open in:
   - [Expo Go](https://expo.dev/go) (limited)
   - [Development build](https://docs.expo.dev/develop/development-builds/introduction/)
   - [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
   - [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)

## Project Structure

```
src/
  app/              # Expo Router file-based routes
    (tabs)/         # Tab navigation screens
    reader/         # Document reader screens (pdf, epub, text, image, office, archive)
    settings/       # Settings sub-screens
  components/       # Reusable UI components
  constants/        # Theme configs, constants
  db/               # SQLite database, migrations, queries
  features/         # Feature modules (annotations, backup, file-manager, security, sharing, export)
  hooks/            # Custom React hooks
  readers/          # Reader engines (pdf, epub, office, text, archive)
  services/         # Business logic (import, export, notifications, file operations)
  storage/          # MMKV key-value storage
  stores/           # Zustand state stores
  types/            # TypeScript type definitions
```

## Supported Formats

| Category | Formats |
|----------|---------|
| PDF | .pdf |
| eBooks | .epub |
| Office | .doc, .docx, .xls, .xlsx, .ppt, .pptx, .csv, .rtf |
| Text/Code | .txt, .md, .json, .xml, .html, .css, .js, .ts, .py, .java, .c, .cpp, .php, .sql, .yaml |
| Images | .png, .jpg, .jpeg, .gif, .webp, .bmp, .svg |
| Archives | .zip, .cbz, .tar |

## License

Cadmus Labs
