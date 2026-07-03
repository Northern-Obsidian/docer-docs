import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { useThemeStore } from '@/stores/theme-store';
import { THEMES, FONTS } from '@/constants/theme-config';

export function ThemeSettings() {
  const c = useTheme();
  const theme = useThemeStore((s) => s.theme);
  const setTheme = useThemeStore((s) => s.setTheme);
  const currentFont = useThemeStore((s) => s.font);
  const setFont = useThemeStore((s) => s.setFont);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: c.background }} contentContainerStyle={{ padding: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: '600', color: c.text, marginBottom: 16 }}>Theme</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 32 }}>
        {THEMES.map((t) => (
          <TouchableOpacity
            key={t.key}
            onPress={() => setTheme(t.key)}
            style={{
              paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20,
              backgroundColor: t.key === theme ? c.primary : c.surface,
              borderWidth: 1, borderColor: t.key === theme ? c.primary : c.border,
            }}
          >
            <Text style={{ fontSize: 14, color: t.key === theme ? '#FFF' : c.text }}>{t.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={{ fontSize: 18, fontWeight: '600', color: c.text, marginBottom: 16 }}>Font</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
        {FONTS.map((f) => (
          <TouchableOpacity
            key={f.key}
            onPress={() => setFont(f.key)}
            style={{
              paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20,
              backgroundColor: f.key === currentFont ? c.primary : c.surface,
              borderWidth: 1, borderColor: f.key === currentFont ? c.primary : c.border,
            }}
          >
            <Text style={{ fontSize: 14, color: f.key === currentFont ? '#FFF' : c.text }}>{f.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}
