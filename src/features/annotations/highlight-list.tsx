import { useEffect, useState, useCallback, startTransition } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlashList } from '@shopify/flash-list';
import { router } from 'expo-router';
import { ArrowLeft, Highlighter, Trash2 } from 'lucide-react-native';

import { useTheme } from '@/hooks/use-theme';
import { getDb } from '@/db/connection';
import { getAllHighlights, deleteHighlight } from '@/db/highlights';
import type { Highlight } from '@/types';
import { EmptyState, LoadingState, ErrorState } from '@/components/empty-state';

const HIGHLIGHT_COLORS: Record<string, string> = {
  yellow: '#FFD60A', blue: '#0A84FF', green: '#30D158',
  pink: '#FF6B9D', orange: '#FF9F0A',
};

export function HighlightListScreen() {
  const c = useTheme();
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const db = await getDb();
      setHighlights(await getAllHighlights(db));
    } catch (e: any) {
      setError(e.message || 'Failed to load highlights');
    }
    setLoading(false);
  }, []);

  useEffect(() => { startTransition(() => { load(); }); }, [load]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, [load]);

  const handleDelete = async (id: string) => {
    const db = await getDb();
    await deleteHighlight(db, id);
    load();
  };

  if (loading) return <SafeAreaView style={{ flex: 1, backgroundColor: c.background }}><LoadingState /></SafeAreaView>;
  if (error) return <SafeAreaView style={{ flex: 1, backgroundColor: c.background }}><ErrorState message={error} onRetry={load} /></SafeAreaView>;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: c.background }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16 }}>
        <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 16 }} accessibilityLabel="Go back" accessibilityRole="button"><ArrowLeft size={24} color={c.text} /></TouchableOpacity>
        <Text style={{ fontSize: 24, fontWeight: '700', color: c.text }}>Highlights</Text>
      </View>
      <FlashList
        data={highlights}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100, flexGrow: 1 }}
        refreshing={refreshing}
        onRefresh={onRefresh}
        renderItem={({ item }) => (
          <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: c.surface, borderRadius: 12, padding: 14, marginBottom: 8 }} accessibilityLabel={`Highlight: ${item.text}, page ${item.page}`} accessibilityRole="button">
            <View style={{ width: 4, height: 40, borderRadius: 2, backgroundColor: HIGHLIGHT_COLORS[item.color] || c.primary, marginRight: 12 }} />
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 14, color: c.text, lineHeight: 20 }} numberOfLines={2}>{item.text}</Text>
              <Text style={{ fontSize: 11, color: c.textTertiary, marginTop: 4 }}>Page {item.page}</Text>
            </View>
            <TouchableOpacity onPress={() => handleDelete(item.id)} style={{ padding: 8 }} accessibilityLabel="Delete highlight" accessibilityRole="button">
              <Trash2 size={16} color={c.textSecondary} />
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={<EmptyState icon={Highlighter} title="No highlights yet" subtitle="Select text in any document to highlight it" />}
      />
    </SafeAreaView>
  );
}
