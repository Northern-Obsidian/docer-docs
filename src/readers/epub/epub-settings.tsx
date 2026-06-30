import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { X, Minus, Plus } from 'lucide-react-native';
import { useTheme } from '@/hooks/use-theme';
import { useThemeStore } from '@/stores/theme-store';

interface EpubSettingsProps {
  onClose: () => void;
}

export function EpubSettings({ onClose }: EpubSettingsProps) {
  const c = useTheme();
  const fontSize = useThemeStore((s) => s.fontSize);
  const setFontSize = useThemeStore((s) => s.setFontSize);
  const lineSpacing = useThemeStore((s) => s.lineSpacing);
  const setLineSpacing = useThemeStore((s) => s.setLineSpacing);

  return (
    <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: c.surface, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.15, shadowRadius: 12, elevation: 10 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <Text style={{ fontSize: 18, fontWeight: '600', color: c.text }}>Reading Settings</Text>
        <TouchableOpacity onPress={onClose}><X size={22} color={c.text} /></TouchableOpacity>
      </View>

      <Text style={{ fontSize: 14, color: c.textSecondary, marginBottom: 8 }}>Font Size</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
        <TouchableOpacity onPress={() => setFontSize(Math.max(12, fontSize - 2))} style={{ padding: 8 }}><Minus size={20} color={c.text} /></TouchableOpacity>
        <View style={{ flex: 1, height: 4, backgroundColor: c.border, borderRadius: 2 }}>
          <View style={{ width: `${((fontSize - 12) / 36) * 100}%`, height: 4, backgroundColor: c.primary, borderRadius: 2 }} />
        </View>
        <TouchableOpacity onPress={() => setFontSize(Math.min(48, fontSize + 2))} style={{ padding: 8 }}><Plus size={20} color={c.text} /></TouchableOpacity>
        <Text style={{ color: c.text, fontSize: 14, minWidth: 32, textAlign: 'center' }}>{fontSize}</Text>
      </View>

      <Text style={{ fontSize: 14, color: c.textSecondary, marginTop: 16, marginBottom: 8 }}>Line Spacing</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
        <TouchableOpacity onPress={() => setLineSpacing(Math.max(1.0, lineSpacing - 0.25))} style={{ padding: 8 }}><Minus size={20} color={c.text} /></TouchableOpacity>
        <View style={{ flex: 1, height: 4, backgroundColor: c.border, borderRadius: 2 }}>
          <View style={{ width: `${((lineSpacing - 1.0) / 1.5) * 100}%`, height: 4, backgroundColor: c.primary, borderRadius: 2 }} />
        </View>
        <TouchableOpacity onPress={() => setLineSpacing(Math.min(2.5, lineSpacing + 0.25))} style={{ padding: 8 }}><Plus size={20} color={c.text} /></TouchableOpacity>
        <Text style={{ color: c.text, fontSize: 14, minWidth: 32, textAlign: 'center' }}>{lineSpacing.toFixed(1)}</Text>
      </View>
    </View>
  );
}
