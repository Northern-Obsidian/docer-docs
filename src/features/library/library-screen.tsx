import { View, Text } from 'react-native';
import { BookOpen } from 'lucide-react-native';
import { useTheme } from '@/hooks/use-theme';

export function LibraryScreen() {
  const c = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: c.background, alignItems: 'center', justifyContent: 'center', padding: 32 }}>
      <BookOpen size={48} color={c.textTertiary} />
      <Text style={{ fontSize: 17, fontWeight: '600', color: c.text, marginTop: 16 }}>Document Library</Text>
      <Text style={{ fontSize: 14, color: c.textSecondary, textAlign: 'center', marginTop: 8, lineHeight: 20 }}>
        Browse and manage your document collection, collections, and tags.
      </Text>
    </View>
  );
}
