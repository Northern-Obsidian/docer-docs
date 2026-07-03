export const colors = {
  highlight: ['yellow', 'blue', 'green', 'pink', 'orange'] as const,
  tag: ['#208AEF', '#34C759', '#FF9500', '#FF3B30', '#AF52DE', '#5AC8FA', '#FFD60A'] as const,
  progress: {
    low: '#FF3B30',
    medium: '#FF9500',
    high: '#34C759',
  },
} as const;

export function getProgressColor(progress: number): string {
  if (progress < 0.25) return colors.progress.low;
  if (progress < 0.75) return colors.progress.medium;
  return colors.progress.high;
}
