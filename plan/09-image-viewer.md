# Plan: Image Viewer

## Goal
Build a fast image viewer with zoom, pan, rotation, slideshow, gallery mode, and metadata display.

## Architecture

```
readers/image/
├── index.ts              # ImageViewer component
├── image-viewer.tsx      # Single image viewer with gestures
├── gallery.tsx           # Gallery mode (multiple images)
├── slideshow.tsx         # Auto-playing slideshow
├── metadata-panel.tsx    # EXIF and file info display
├── toolbar.tsx
└── types.ts
```

## Features

### Viewing
- Fast image loading with `expo-image`
- Pinch-to-zoom (0.25x – 10x)
- Double-tap to zoom in/out
- Pan when zoomed
- Rotation (90° increments)
- Fit-to-screen / fill-screen toggle
- Smooth transitions

### Gallery Mode
- Horizontal swipe between multiple images in the same folder
- Thumbnail strip at bottom
- Page indicator dots
- Cache adjacent images for smooth swiping

### Slideshow
- Auto-advance with configurable interval (3s, 5s, 10s)
- Play/pause controls
- Shuffle option
- Repeat option
- Exit on last image (or loop)

### Metadata
- File name, size, dimensions, type
- EXIF data: Camera, aperture, shutter speed, ISO, focal length, date taken
- GPS coordinates (with option to open in maps)
- Format: JPEG, PNG, WEBP, GIF, BMP, SVG

### Toolbar
- Image counter ("3 / 15")
- Zoom indicator
- Rotate button
- Info button
- Share button
- Slideshow button
- Delete button

## Implementation Notes
- Use `expo-image` for performant image loading and caching
- Gesture handling with `react-native-gesture-handler` + `react-native-reanimated`
- EXIF parsing with `expo-image-manipulator` or custom parser
- SVG rendering with `react-native-svg` via expo-image
- GIF animation support with playback controls

## States
- **Loading**: Progressive image load placeholder
- **Error**: Broken image icon with retry
- **Not found**: File deleted/moved warning
- **Gallery empty**: No images in folder

## Edge Cases
- Very large images (100MP+): Downsample for display
- SVG with complex paths: Ensure proper rendering
- Animated GIF: Play/pause control, memory management
- Corrupted images: Graceful error
- HEIC/HEIF: Check platform support, convert if needed
