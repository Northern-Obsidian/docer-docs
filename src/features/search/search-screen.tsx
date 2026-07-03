import { View, Text } from 'react-native';
import { Search } from 'lucide-react-native';
import { useTheme } from '@/hooks/use-theme';

export function SearchScreen() {
  const c = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: c.background, alignItems: 'center', justifyContent: 'center', padding: 32 }}>
      <Search size={48} color={c.textTertiary} />
      <Text style={{ fontSize: 17, fontWeight: '600', color: c.text, marginTop: 16 }}>Full-Text Search</Text>
      <Text style={{ fontSize: 14, color: c.textSecondary, textAlign: 'center', marginTop: 8, lineHeight: 20 }}>
        Search across all your documents' content, bookmarks, and notes.
      </Text>
    </View>
  );
}
