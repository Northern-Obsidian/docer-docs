# Plan: Security & Accessibility

## Goal
Implement app lock with biometric authentication and ensure the app is accessible to all users.

## Architecture

```
features/security/
├── app-lock-screen.tsx      # PIN entry / biometric prompt
├── app-lock-provider.tsx    # Lock state provider
├── set-pin-screen.tsx       # PIN creation/change
├── biometric-prompt.tsx     # Biometric authentication
├── security-settings.tsx    # Security configuration
└── services/
    ├── app-lock-service.ts  # Lock/unlock logic
    └── encryption-service.ts # Data encryption (future)
features/accessibility/
├── accessibility-settings.tsx # Accessibility options
├── screen-reader.tsx         # Screen reader support helpers
├── high-contrast.tsx         # High contrast theme variant
└── types.ts
```

## Security

### App Lock
- **Lock types**: PIN (4-6 digits), Biometric (Face ID / Touch ID / Fingerprint)
- PIN stored securely (hashed, not plaintext)
- Biometric as alternative to PIN
- Lock activates after app background → foreground
- Configurable timeout (immediately, 1min, 5min, 15min)
- Lock screen shows only time + date (no content preview)

### Biometric Authentication
- Use `expo-local-authentication`
- Fall back to PIN if biometric unavailable
- Support Face ID, Touch ID, Android fingerprint
- Handle biometric enrollment changes (re-prompt for PIN)
- Graceful degradation on devices without biometrics

### PIN Management
- Set PIN on first enable
- Confirm PIN (enter twice)
- Change PIN (require old PIN first)
- Reset PIN via security questions (future)
- Lockout after 5 failed attempts (30-second delay)

### Data Protection (Future)
- Encrypt notes at rest
- Hidden folders (PIN/biometric to access)
- Hide sensitive content in app switcher

## Accessibility

### Design Principles
- All interactive elements: minimum 48x48dp touch target
- Color contrast ratios: WCAG AA minimum (4.5:1 for text)
- Support screen readers (TalkBack, VoiceOver)
- Tappable labels for all icons
- Semantic heading hierarchy

### Features

#### Visual
- **Large Text**: System-wide font size increase beyond standard max
- **High Contrast**: Alternative theme with maximum contrast ratios
- **Color-safe Palettes**: Avoid color-only indicators (use icons + labels)
- **Reduce Motion**: Disable animations and transitions
- **Bold Text**: System-wide bold toggle
- **Zoom**: System-level zoom support

#### Auditory (Future)
- Text-to-speech for document content
- Audio playback speed control
- Voice commands for navigation

#### Motor
- Extended touch targets for all controls
- Swipe gesture alternatives (buttons)
- Adjustable long-press duration

### Implementation Details
- Use React Native's `AccessibilityInfo` and `accessibility*` props
- `accessibilityLabel` on all interactive elements
- `accessibilityRole` for proper element identification
- `accessibilityHint` for complex interactions
- `accessibilityState` for toggle states
- Support system `reduceMotion` and `reduceTransparency` settings
- Test with TalkBack (Android) and VoiceOver (iOS)
- Animations respect `AccessibilityInfo.isReduceMotionEnabled()`

## Implementation Order

1. Accessibility basics: labels, roles, touch targets (integrate from start)
2. App lock screen UI
3. PIN creation and verification
4. Biometric authentication integration
5. Lock on app background/foreground
6. High contrast theme variant
7. Reduce motion support
8. Accessibility settings screen
