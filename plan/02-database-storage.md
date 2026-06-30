# Plan: Database & Storage

## Goal
Design and implement the SQLite database schema and MMKV fast storage layer.

## SQLite Database

### Tables

```sql
-- Documents index
CREATE TABLE documents (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  path TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL,          -- pdf, epub, docx, txt, image, etc.
  mime_type TEXT,
  size INTEGER,
  page_count INTEGER,
  author TEXT,
  created_at TEXT,
  modified_at TEXT,
  added_at TEXT DEFAULT (datetime('now')),
  metadata TEXT,               -- JSON blob for format-specific metadata
  thumbnail_path TEXT
);

-- Reading history
CREATE TABLE reading_history (
  id TEXT PRIMARY KEY,
  document_id TEXT NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  last_page INTEGER DEFAULT 0,
  last_position TEXT,          -- JSON position data (scroll offset, etc.)
  progress REAL DEFAULT 0,    -- 0.0 to 1.0
  started_at TEXT,
  last_read_at TEXT,
  read_count INTEGER DEFAULT 0,
  total_reading_time INTEGER DEFAULT 0  -- seconds
);

-- Bookmarks
CREATE TABLE bookmarks (
  id TEXT PRIMARY KEY,
  document_id TEXT NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  page INTEGER,
  chapter TEXT,
  position TEXT,               -- JSON position data
  label TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

-- Highlights
CREATE TABLE highlights (
  id TEXT PRIMARY KEY,
  document_id TEXT NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  page INTEGER,
  color TEXT DEFAULT 'yellow', -- yellow, blue, green, pink, orange
  text TEXT,
  position TEXT,               -- JSON selection range data
  created_at TEXT DEFAULT (datetime('now'))
);

-- Notes
CREATE TABLE notes (
  id TEXT PRIMARY KEY,
  document_id TEXT NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  page INTEGER,
  paragraph_index INTEGER,
  content TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Collections
CREATE TABLE collections (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT,
  color TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now'))
);

-- Collection-Document join
CREATE TABLE collection_documents (
  collection_id TEXT NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
  document_id TEXT NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  added_at TEXT DEFAULT (datetime('now')),
  PRIMARY KEY (collection_id, document_id)
);

-- Tags
CREATE TABLE tags (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  color TEXT
);

-- Tag-Document join
CREATE TABLE tag_documents (
  tag_id TEXT NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  document_id TEXT NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  PRIMARY KEY (tag_id, document_id)
);

-- Favorites
CREATE TABLE favorites (
  document_id TEXT PRIMARY KEY REFERENCES documents(id) ON DELETE CASCADE,
  added_at TEXT DEFAULT (datetime('now'))
);

-- Reading goals
CREATE TABLE reading_goals (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,           -- daily_pages, daily_time, weekly, monthly
  target_value REAL NOT NULL,
  current_value REAL DEFAULT 0,
  period_start TEXT,
  period_end TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

-- Reading statistics
CREATE TABLE reading_stats (
  id TEXT PRIMARY KEY,
  date TEXT NOT NULL,            -- YYYY-MM-DD
  pages_read INTEGER DEFAULT 0,
  reading_time INTEGER DEFAULT 0, -- seconds
  documents_opened INTEGER DEFAULT 0
);

-- FTS for search
CREATE VIRTUAL TABLE documents_fts USING fts5(
  name, author, content='documents', content_rowid='rowid'
);

-- Triggers to keep FTS in sync
CREATE TRIGGER documents_ai AFTER INSERT ON documents BEGIN
  INSERT INTO documents_fts(rowid, name, author) VALUES (new.rowid, new.name, new.author);
END;

CREATE TRIGGER documents_ad AFTER DELETE ON documents BEGIN
  INSERT INTO documents_fts(documents_fts, rowid, name, author) VALUES('delete', old.rowid, old.name, old.author);
END;

CREATE TRIGGER documents_au AFTER UPDATE ON documents BEGIN
  INSERT INTO documents_fts(documents_fts, rowid, name, author) VALUES('delete', old.rowid, old.name, old.author);
  INSERT INTO documents_fts(rowid, name, author) VALUES (new.rowid, new.name, new.author);
END;
```

## MMKV Storage Keys

```
app_theme              -> string (light|dark|amoled|sepia|etc)
app_font               -> string (font family name)
app_font_size          -> number
app_line_spacing       -> number
app_margins            -> number
app_brightness         -> number
app_orientation        -> string (portrait|landscape|auto)
app_scroll_direction   -> string (vertical|horizontal)
app_animation_enabled  -> boolean
last_opened_document   -> string (document ID)
last_opened_folder     -> string (folder path)
recent_folders[]       -> string[] (JSON array)
reading_goal_enabled   -> boolean
daily_reading_goal     -> number
notifications_enabled  -> boolean
onboarding_complete    -> boolean
app_lock_enabled       -> boolean
app_lock_type          -> string (pin|biometric)
search_history[]       -> string[] (JSON array, max 50)
```

## DB Service Layer (`src/db/`)

```
db/
├── connection.ts       # Open/close DB, migrations
├── migrations.ts       # Schema versioning and migrations
├── documents.ts        # Document CRUD
├── bookmarks.ts        # Bookmark CRUD
├── highlights.ts       # Highlights CRUD
├── notes.ts            # Notes CRUD
├── collections.ts      # Collections CRUD
├── tags.ts             # Tags CRUD
├── favorites.ts        # Favorites CRUD
├── history.ts          # Reading history CRUD
├── stats.ts            # Statistics CRUD
├── goals.ts            # Reading goals CRUD
├── search.ts           # FTS search queries
└── backup.ts           # Export/import full DB
```

## Implementation Notes

- Use Expo's SQLite module (`expo-sqlite`)
- Run migrations on first launch
- Use parameterized queries to prevent SQL injection
- Batch operations for bulk indexing
- FTS queries use `MATCH` syntax with snippet highlighting
