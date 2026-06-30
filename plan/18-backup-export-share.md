# Plan: Backup, Export & Share

## Goal
Provide complete offline backup/restore, document export in multiple formats, and system sharing.

## Architecture

```
features/backup/
├── backup-screen.tsx       # Backup management UI
├── backup-service.ts       # Backup/restore logic
├── restore-screen.tsx      # Restore flow
├── auto-backup.ts          # Scheduled auto-backup (future)
└── types.ts
features/export/
├── export-service.ts       # Export logic per format
├── export-options.tsx      # Format picker UI
└── types.ts
features/sharing/
├── share-service.ts        # System share integration
├── share-sheet.tsx         # Share options UI
└── types.ts
```

## Backup

### What Gets Backed Up
- All SQLite data (documents index, history, bookmarks, highlights, notes, collections, tags, favorites, stats, goals)
- App settings (MMKV exported as JSON)
- Thumbnail cache (future)
- Reader preferences per document (future)

### Backup Format
- Single `.docer-backup` file (ZIP archive containing SQLite dump + settings JSON)
- Encrypted backup (optional, future)

### Backup Flow
1. User taps "Create Backup"
2. App collects all DB data + settings
3. Compresses into single file
4. Prompts user where to save (FileSystem picker)
5. Shows progress bar

### Restore Flow
1. User taps "Restore from Backup"
2. File picker to select `.docer-backup` file
3. Warning: "This will replace all current data"
4. Confirmation with backup details (date, size, stats)
5. Restore with progress
6. App restart required

### Auto-Backup (Future)
- Daily/weekly/monthly schedule
- Keep last N backups
- Backup location configurable

## Export

### Supported Export Formats

| Source Format | Export To |
|--------------|-----------|
| Any | PDF (print-like) |
| TXT, MD | TXT, PDF |
| Notes | TXT, JSON, CSV |
| Bookmarks | JSON, CSV |
| Highlights | TXT, JSON |
| Library index | CSV, JSON |
| Stats | CSV, JSON |

### Export Options
- Format picker sheet
- Quality options (for PDF: screen vs print)
- Include/exclude metadata
- Export destination (FileSystem picker)
- Share after export option

## Sharing

### Share Types
| Action | Implementation |
|--------|---------------|
| Share original file | System share sheet (`expo-sharing`) |
| Share as PDF | Convert + share |
| Share as text | Extract text + share |
| Share notes | Compile notes + share |
| Share link | Deep link to document |

### Share Integration Points
- Reader toolbar: Share button
- Document context menu: Share
- Library multi-select: Share multiple (future: ZIP and share)

## Implementation Notes
- Use `expo-file-system` for reading/writing backup files
- Use `expo-sharing` for system share sheet
- Use `expo-document-picker` for restore file selection
- SQLite attach/detach for backup (or programmatic dump)
- Backup files: `Docer_Backup_2026-06-30.docer-backup`
- Progress callbacks for large backups (via task/event system)

## States
- **Backing up**: Progress bar with "Creating backup..."
- **Restoring**: "Restoring data... (X/Y tables)"
- **Restore warning**: Confirmation with data loss warning
- **Exporting**: Progress indicator
- **Error**: Specific failure messages (disk full, permission denied, corrupt backup)
