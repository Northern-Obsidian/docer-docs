# Plan: File Manager

## Goal
Provide a lightweight built-in file manager for renaming, moving, copying, deleting, sharing, and viewing document properties.

## Architecture

```
features/file-manager/
├── file-actions.tsx         # Action sheet / context menu
├── rename-dialog.tsx        # Rename modal
├── move-sheet.tsx           # Folder picker for move/copy
├── delete-confirmation.tsx  # Delete with undo option
├── properties-panel.tsx     # File properties viewer
├── share-sheet.tsx          # Share options
├── services/
│   ├── file-operations.ts   # Rename, move, copy, delete logic
│   └── share-service.ts     # Share intent handling
└── types.ts
```

## Features

### Actions (available from long-press or toolbar menu)
| Action | Description |
|--------|-------------|
| Rename | Inline rename with extension preservation |
| Move | Select destination folder via folder picker |
| Copy | Copy file to another location |
| Duplicate | Create "Copy of filename" in same folder |
| Delete | Move to trash / permanent delete |
| Share | System share sheet (original file) |
| Open with... | System app picker for the file |
| Properties | View detailed file info |

### Rename
- Pre-fill current name (without extension)
- Extension preserved automatically
- Validate: no illegal characters, no duplicate name in folder
- Rename also updates the DB record + re-index

### Move/Copy
- Folder picker modal showing directory tree
- "New Folder" button in picker
- Recent folders shortcut
- Progress bar for large files
- On move: Update document path in DB

### Delete
- Confirmation dialog with file info
- Option: "Move to trash" (recoverable) vs "Delete permanently"
- Trash folder accessible from settings
- Auto-clean trash after 30 days (future)
- Cascade: Remove bookmarks/highlights/notes for deleted doc

### Properties Panel
```
┌─────────────────────┐
│  File Properties     │
│                      │
│  Name: report.pdf    │
│  Type: PDF Document  │
│  Size: 2.4 MB        │
│  Location: /Docs/    │
│  Created: 10 May 2026│
│  Modified: 15 Jun 26 │
│  Pages: 47           │
│  Author: John Doe    │
│  Added to Docer: ... │
│  Last read: ...      │
│  Total reading: ...  │
│  Tags: [work] [pdf]  │
│  Collections: [Work] │
└─────────────────────┘
```

### Share
- Share original file via system share sheet
- Share as PDF (for supported formats) — future
- Share notes/highlights as text — future

## Integration Points

- **Document Card/Row**: Long-press → context menu with actions
- **Document Info**: Tap info icon → properties panel
- **Library**: Multi-select mode → batch actions (delete, move, add to collection)
- **Reader Toolbar**: "More" menu → rename, move, delete, share, properties

## Implementation Notes

- Use `expo-file-system` for file operations
- Move: Copy + delete original, with transaction rollback on failure
- Delete confirmation includes file name + size
- Undo delete: Keep in trash table for 30 days
- Batch operations show progress via notification

## States
- **Operating**: Progress overlay during move/copy/delete
- **Error**: Specific error messages (permission denied, disk full, file in use)
- **Conflict**: "File already exists" → overwrite/rename/skip options
- **Success**: Brief toast confirmation
