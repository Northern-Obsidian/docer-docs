import { useThemeStore } from '@/stores/theme-store';
import { THEME_COLORS } from '@/constants/theme-config';
import type { ThemeColors } from '@/types';

export function useTheme(): ThemeColors {
  const theme = useThemeStore((s) => s.theme);
  return THEME_COLORS[theme];
}
