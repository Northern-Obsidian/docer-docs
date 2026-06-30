import { create } from 'zustand';
import type { Theme } from '@/types';
import { appStorage } from '@/storage';

interface ThemeState {
  theme: Theme;
  font: string;
  fontSize: number;
  lineSpacing: number;
  margins: number;
  brightness: number;
  orientation: 'portrait' | 'landscape' | 'auto';
  scrollDirection: 'vertical' | 'horizontal';
  animationEnabled: boolean;
  setTheme: (theme: Theme) => void;
  setFont: (font: string) => void;
  setFontSize: (size: number) => void;
  setLineSpacing: (spacing: number) => void;
  setMargins: (margins: number) => void;
  setBrightness: (brightness: number) => void;
  setOrientation: (orientation: 'portrait' | 'landscape' | 'auto') => void;
  setScrollDirection: (direction: 'vertical' | 'horizontal') => void;
  toggleAnimation: () => void;
  loadFromStorage: () => void;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: 'light',
  font: 'system',
  fontSize: 16,
  lineSpacing: 1.5,
  margins: 16,
  brightness: 1.0,
  orientation: 'auto',
  scrollDirection: 'vertical',
  animationEnabled: true,

  loadFromStorage: () => {
    set({
      theme: appStorage.getTheme() as Theme,
      font: appStorage.getFont(),
      fontSize: appStorage.getFontSize(),
      lineSpacing: appStorage.getLineSpacing(),
      margins: appStorage.getMargins(),
      brightness: appStorage.getBrightness(),
      orientation: appStorage.getOrientation() as 'portrait' | 'landscape' | 'auto',
      scrollDirection: appStorage.getScrollDirection() as 'vertical' | 'horizontal',
      animationEnabled: appStorage.getAnimationEnabled(),
    });
  },

  setTheme: (theme) => { appStorage.setTheme(theme); set({ theme }); },
  setFont: (font) => { appStorage.setFont(font); set({ font }); },
  setFontSize: (fontSize) => { appStorage.setFontSize(fontSize); set({ fontSize }); },
  setLineSpacing: (lineSpacing) => { appStorage.setLineSpacing(lineSpacing); set({ lineSpacing }); },
  setMargins: (margins) => { appStorage.setMargins(margins); set({ margins }); },
  setBrightness: (brightness) => { appStorage.setBrightness(brightness); set({ brightness }); },
  setOrientation: (orientation) => { appStorage.setOrientation(orientation); set({ orientation }); },
  setScrollDirection: (scrollDirection) => { appStorage.setScrollDirection(scrollDirection); set({ scrollDirection }); },
  toggleAnimation: () => {
    const next = !get().animationEnabled;
    appStorage.setAnimationEnabled(next);
    set({ animationEnabled: next });
  },
}));
