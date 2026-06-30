# Plan: Reading History & Statistics

## Goal
Track reading activity and provide insightful statistics about reading habits.

## Architecture

```
features/history/
├── reading-history.tsx     # Recently opened documents list
├── history-item.tsx        # Individual history entry
├── services/
│   └── history-service.ts  # History tracking logic
features/stats/
├── stats-screen.tsx        # Full statistics dashboard
├── stat-card.tsx           # Reusable stat display card
├── reading-calendar.tsx    # GitHub-style activity heatmap
├── reading-streak.tsx      # Streak counter display
├── daily-chart.tsx         # Bar chart (pages/time per day)
├── category-chart.tsx      # Pie/donut chart by category
├── stat-tile.tsx           # Single stat (icon + number + label)
└── services/
    └── stats-service.ts    # Stats calculation queries
```

## Reading History

### Features
- Automatically records each document open
- Shows: document name, last page, progress %, date, reading time
- Configurable history limit (default 50, configurable up to 200)
- "Clear history" option
- Tap → continue reading from last position
- Swipe to remove individual entries
- Search within history

### Data Collected Per Session
```ts
interface ReadingSession {
  documentId: string;
  startedAt: string;
  endedAt?: string;
  pagesRead: number;
  readingTime: number;  // seconds
  startPage: number;
  endPage: number;
}
```

## Reading Statistics

### Dashboard Stats
| Stat | Source |
|------|--------|
| Total pages read | Sum of `reading_stats.pages_read` |
| Total reading time | Sum of `reading_stats.reading_time` |
| Documents opened | Count of `reading_history` |
| Today's reading time | Filtered by today's date |
| Today's pages read | Filtered by today's date |
| Reading streak (days) | Consecutive days with reading activity |
| Favorite category | Most-read document type |
| Average session time | Average reading_time per session |
| Books completed | Documents with progress > 0.99 |

### Visualizations
- **Calendar Heatmap**: GitHub-style grid showing daily activity (color intensity by time/pages)
- **Daily Chart**: Bar chart of past 7/30 days
- **Category Donut**: Distribution of reading by document type
- **Streak Display**: Fire icon + "X days" with milestone markers

## Implementation Order

1. Session recording (start/end tracking)
2. History list UI
3. Daily stats aggregation
4. Stats dashboard layout
5. Calendar heatmap
6. Charts (daily bar, category donut)
7. Reading streak calculation
8. Stats on home dashboard (summary card)

## Background Tracking

- Start session timer when document opens
- Update reading time every 60 seconds while document is active
- Detect idle (no interaction for 5 minutes) → pause timer
- On document close → finalize session, save to DB
- On app background → pause all sessions
- On app foreground → resume current session if reader is open

## Edge Cases
- Midnight crossing: Correctly attribute time to correct day
- Multiple documents open (tabs): Track each independently
- Very short reads (<30s): Option to discard or include
- Offline: All tracking works offline, sync to DB when online (no cloud needed)
- Timezone: Use local time for daily aggregation
