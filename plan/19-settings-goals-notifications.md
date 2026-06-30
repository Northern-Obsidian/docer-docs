# Plan: Settings, Goals & Notifications

## Goal
Build the settings screen, reading goals system, and optional notification reminders.

## Architecture

```
features/settings/
├── settings-screen.tsx      # Main settings list
├── settings-section.tsx     # Reusable section wrapper
├── settings-item.tsx        # Reusable row (toggle, nav, value)
├── appearance-settings.tsx  # Theme, font, display options
├── storage-settings.tsx     # Storage management, cache clear
├── about-screen.tsx         # App info, licenses, version
└── types.ts
features/goals/
├── goal-setup.tsx           # Goal creation wizard
├── goal-progress.tsx        # Goal progress display
├── goal-card.tsx            # Single goal card
├── goal-notification.tsx    # Notification scheduling
└── services/
    └── goal-service.ts      # Goal tracking logic
features/notifications/
├── notification-service.ts  # Local notification scheduling
├── notification-permission.tsx # Permission request UI
└── types.ts
```

## Settings Sections

### Appearance
- Theme selector (grid of 9 themes)
- Font picker (system, serif, sans, mono, OpenDyslexic)
- Font size slider
- Line spacing slider
- Reader default margins
- Brightness slider (system-independent)
- Orientation lock toggle

### Reading
- Default scroll direction
- Animation toggle
- Default zoom level
- Double page mode (landscape) toggle
- Night mode auto-schedule (future)

### Storage
- Total storage used
- Database size
- Cache size
- Thumbnail cache size
- "Clear cache" button
- "Clear reading history" button
- "Clear search history" button

### Backup
- Create backup button
- Restore from backup button
- Last backup date
- Auto-backup toggle (future)

### Goals & Notifications
(see below)

### Security
- App lock toggle (PIN / Biometric)
- Change PIN
- Face/Touch ID toggle
- Hide sensitive content in app switcher (future)

### About
- App version
- Build number
- Licenses (open source credits)
- Rate the app
- Share the app
- Contact / support
- Privacy policy

## Reading Goals

### Goal Types
| Type | Target | Tracking |
|------|--------|----------|
| Daily pages | Number of pages | Pages read today |
| Daily reading time | Minutes | Time read today |
| Weekly pages | Number of pages | Sum of week |
| Weekly reading time | Minutes | Sum of week |
| Monthly pages | Number of pages | Sum of month |
| Monthly reading time | Minutes | Sum of month |
| Books per month | Number of books | Documents with >99% progress |

### Goal Management
- Create goal with type + target value
- View progress as circular progress ring
- Edit/delete existing goals
- Multiple goals can be active simultaneously
- Goal progress shown on home dashboard

### Goal Achievement
- Confetti/celebration on goal completion
- Goal history (past goals and achievements)
- Streak bonuses (consecutive days meeting daily goal)

## Notifications

### Notification Types
| Type | When | Customization |
|------|------|--------------|
| Continue reading | After N hours of inactivity on a document | Toggle, time window |
| Daily reading goal | At configured time if goal not met | Toggle, time |
| Reading streak | When streak milestone reached (7, 30, 100 days) | Toggle |
| Weekly summary | Every Sunday evening, summary of week's reading | Toggle |

### Implementation
- Use `expo-notifications` for local notifications
- Schedule daily/weekly repeating notifications
- Cancel all notifications when notifications disabled
- Respect system notification permissions
- Notification tap → open relevant screen

## Implementation Order

1. Settings screen structure with navigation
2. Appearance settings
3. Storage settings
4. Reading goals CRUD + tracking
5. Goal progress UI on dashboard
6. Local notifications for reading reminders
7. About screen
8. Goal celebration animation
