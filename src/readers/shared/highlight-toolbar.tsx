import { View, Text, TouchableOpacity } from 'react-native';
import { Highlighter } from 'lucide-react-native';
import { useTheme } from '@/hooks/use-theme';

const HIGHLIGHT_COLORS = [
  { key: 'yellow', color: '#fde047' },
  { key: 'blue', color: '#93c5fd' },
  { key: 'green', color: '#86efac' },
  { key: 'pink', color: '#f9a8d4' },
  { key: 'orange', color: '#fdba74' },
] as const;

interface HighlightToolbarProps {
  visible: boolean;
  selectedText: string;
  onHighlight: (color: string) => void;
  onDismiss: () => void;
}

export function HighlightToolbar({ visible, selectedText, onHighlight, onDismiss }: HighlightToolbarProps) {
  const c = useTheme();

  if (!visible || !selectedText) return null;

  return (
    <View style={{
      position: 'absolute', bottom: 80, left: 16, right: 16,
      backgroundColor: c.surface, borderRadius: 16, padding: 14,
      shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 12, elevation: 8,
    }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
        <Highlighter size={16} color={c.primary} />
        <Text style={{ fontSize: 13, fontWeight: '600', color: c.text, marginLeft: 6, flex: 1 }} numberOfLines={1}>
          {'"'}{selectedText.length > 50 ? selectedText.slice(0, 50) + '...' : selectedText}{'"'}
        </Text>
        <TouchableOpacity onPress={onDismiss}>
          <Text style={{ fontSize: 13, color: c.textSecondary }}>Cancel</Text>
        </TouchableOpacity>
      </View>
      <View style={{ flexDirection: 'row', gap: 10, justifyContent: 'center' }}>
        {HIGHLIGHT_COLORS.map((h) => (
          <TouchableOpacity
            key={h.key}
            onPress={() => onHighlight(h.key)}
            style={{
              width: 32, height: 32, borderRadius: 16, backgroundColor: h.color,
              borderWidth: 2, borderColor: c.border,
            }}
            accessibilityLabel={`Highlight in ${h.key}`}
          />
        ))}
      </View>
    </View>
  );
}
