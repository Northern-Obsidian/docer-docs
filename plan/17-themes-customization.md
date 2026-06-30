# Plan: Themes & Customization

## Goal
Implement a flexible theme system with 9 themes and deep reading customization options.

## Architecture

```
features/themes/
├── theme-provider.tsx       # Theme context + provider
├── theme-config.ts          # Theme definitions (colors, values)
├── theme-picker.tsx         # Theme selection grid
├── font-picker.tsx          # Font selector
├── reading-settings.tsx     # All reading customization options
├── use-theme.ts             # Hook to access current theme
└── types.ts
```

## Theme Definitions

```ts
interface ThemeColors {
  // Background hierarchy
  background: string;        // Main background
  surface: string;           // Cards, sheets
  surfaceVariant: string;    // Elevated surfaces
  
  // Text hierarchy
  text: string;              // Primary text
  textSecondary: string;     // Secondary text
  textTertiary: string;      // Muted/hint text
  
  // Interactive
  primary: string;           // Primary accent
  primaryContainer: string;  // Container for primary elements
  secondary: string;         // Secondary accent
  
  // Semantic
  success: string;
  warning: string;
  error: string;
  info: string;
  
  // Reader-specific
  readerBackground: string;  // Reading area background
  readerText: string;        // Reading area text
  readerAccent: string;      // Links, selections in reader
  
  // Utility
  border: string;
  separator: string;
  overlay: string;           // Modal/overlay backdrop
  highlight: string;         // Text selection/highlight
}
```

## Theme Presets

| Theme | Background | Text | Accent | Mood |
|-------|-----------|------|--------|------|
| Light | White (#FFF) | Near-black | Blue (#208AEF) | Clean, default |
| Dark | Dark gray (#1A1A2E) | Light gray | Blue | Eye comfort |
| AMOLED | Pure black (#000) | Light gray | Blue | Battery saving |
| Sepia | Warm beige (#F5E6C8) | Dark brown | Orange | Reading comfort |
| Paper | Off-white (#F8F8F6) | Dark gray | Green | Book-like |
| Midnight | Deep blue (#0D1B2A) | Cool gray | Cyan | Night reading |
| Forest | Dark green (#1B3A1B) | Light green | Lime | Nature calm |
| Ocean | Teal dark (#0F2B38) | Light cyan | Aqua | Water calm |
| Glass | Frosted white | Soft gray | Purple | Modern, blur |

## Reading Customization

Available in reader toolbar + Settings > Appearance:

### Typography
- **Font**: System default, Serif, Sans-serif, Monospace, OpenDyslexic, custom fonts
- **Font Size**: Slider 12–48pt (with preview)
- **Line Spacing**: Slider 1.0–2.5
- **Margins**: Narrow / Normal / Wide buttons
- **Text Alignment**: Left, Justify, Center (for EPUB/text)

### Display
- **Brightness**: Slider overlay, can be set independent of system
- **Orientation**: Portrait, Landscape, Auto (sensor)
- **Scroll Direction**: Vertical, Horizontal
- **Animation**: Enable/disable page transitions

## Persistence

- All theme + customization settings saved to MMKV (not SQLite)
- Restore on app restart
- Per-document customization (future: remember font size per book)

## Implementation Order

1. Theme provider with context
2. Light and Dark themes
3. Theme picker UI
4. All additional themes
5. Font size + line spacing controls
6. Reader customization panel
7. Brightness overlay
8. Orientation lock

## Integration

- Theme provider wraps root layout
- All components use `useTheme()` hook for colors
- NativeWind classes adapt based on theme
- Reader components apply additional CSS variables
- Settings > Appearance manages all customization options
