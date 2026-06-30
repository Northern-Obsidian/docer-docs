import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, Minus, Plus } from 'lucide-react-native';

import { useTheme } from '@/hooks/use-theme';
import { useThemeStore } from '@/stores/theme-store';

const FONTS = ['system', 'serif', 'monospace', 'Georgia', 'Palatino', 'Merriweather'];

export default function AppearanceScreen() {
  const c = useTheme();
  const fontSize = useThemeStore((s) => s.fontSize);
  const lineSpacing = useThemeStore((s) => s.lineSpacing);
  const margins = useThemeStore((s) => s.margins);
  const font = useThemeStore((s) => s.font);
  const orientation = useThemeStore((s) => s.orientation);
  const animationEnabled = useThemeStore((s) => s.animationEnabled);
  const setFontSize = useThemeStore((s) => s.setFontSize);
  const setLineSpacing = useThemeStore((s) => s.setLineSpacing);
  const setMargins = useThemeStore((s) => s.setMargins);
  const setFont = useThemeStore((s) => s.setFont);
  const setOrientation = useThemeStore((s) => s.setOrientation);
  const toggleAnimation = useThemeStore((s) => s.toggleAnimation);

  const Slider = ({ label, value, min, max, step, onChange, format }: any) => (
    <View style={{ marginBottom: 20 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
        <Text style={{ color: c.text, fontSize: 15 }}>{label}</Text>
        <Text style={{ color: c.textSecondary, fontSize: 14 }}>{format ? format(value) : value}</Text>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <TouchableOpacity onPress={() => onChange(Math.max(min, +(value - step).toFixed(2)))} style={{ padding: 8 }}>
          <Minus size={20} color={c.text} />
        </TouchableOpacity>
        <View style={{ flex: 1, height: 4, backgroundColor: c.border, borderRadius: 2 }}>
          <View style={{ width: `${((value - min) / (max - min)) * 100}%`, height: 4, backgroundColor: c.primary, borderRadius: 2 }} />
        </View>
        <TouchableOpacity onPress={() => onChange(Math.min(max, +(value + step).toFixed(2)))} style={{ padding: 8 }}>
          <Plus size={20} color={c.text} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: c.background }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16 }}>
        <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 16 }}><ArrowLeft size={24} color={c.text} /></TouchableOpacity>
        <Text style={{ fontSize: 24, fontWeight: '700', color: c.text }}>Appearance</Text>
      </View>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}>
        <View style={{ backgroundColor: c.surface, borderRadius: 16, padding: 20, marginBottom: 16 }}>
          <Text style={{ fontSize: 13, fontWeight: '600', color: c.textSecondary, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>Font</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
            {FONTS.map((f) => (
              <TouchableOpacity key={f} onPress={() => setFont(f)}
                style={{ paddingHorizontal: 18, paddingVertical: 10, borderRadius: 20, backgroundColor: font === f ? c.primary : c.background }}>
                <Text style={{ color: font === f ? '#FFF' : c.text, fontWeight: '500', fontSize: 14 }}>{f === 'system' ? 'System' : f}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={{ backgroundColor: c.surface, borderRadius: 16, padding: 20, marginBottom: 16 }}>
          <Slider label="Font Size" value={fontSize} min={12} max={48} step={2} onChange={setFontSize} format={(v: number) => `${v}px`} />
          <Slider label="Line Spacing" value={lineSpacing} min={1} max={2.5} step={0.1} onChange={setLineSpacing} format={(v: number) => `${v.toFixed(1)}x`} />
          <Slider label="Margins" value={margins} min={8} max={40} step={4} onChange={setMargins} format={(v: number) => `${v}px`} />
        </View>

        <View style={{ backgroundColor: c.surface, borderRadius: 16, padding: 20, marginBottom: 16 }}>
          <Text style={{ fontSize: 13, fontWeight: '600', color: c.textSecondary, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>Orientation</Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {(['portrait', 'landscape', 'auto'] as const).map((o) => (
              <TouchableOpacity key={o} onPress={() => setOrientation(o)}
                style={{ flex: 1, paddingVertical: 12, borderRadius: 12, backgroundColor: orientation === o ? c.primary : c.background, alignItems: 'center' }}>
                <Text style={{ color: orientation === o ? '#FFF' : c.text, fontWeight: '500', fontSize: 14, textTransform: 'capitalize' }}>{o}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={{ backgroundColor: c.surface, borderRadius: 16, padding: 20 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ color: c.text, fontSize: 15 }}>Animations</Text>
            <TouchableOpacity
              style={{ width: 48, height: 28, borderRadius: 14, padding: 2, backgroundColor: animationEnabled ? c.primary : c.border }}
              onPress={toggleAnimation}
            >
              <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: '#FFF', transform: [{ translateX: animationEnabled ? 20 : 0 }] }} />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
