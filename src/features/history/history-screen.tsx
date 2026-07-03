import { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { Clock, Trash2 } from 'lucide-react-native';
import { useTheme } from '@/hooks/use-theme';
import { getDb } from '@/db/connection';
import { getRecentDocuments } from '@/db/documents';
import { clearHistory } from '@/db/history';
import type { Document } from '@/types';

export function HistoryScreen() {
  const c = useTheme();
  const [history, setHistory] = useState<(Document & { lastReadAt: string; progress: number })[]>([]);

  useEffect(() => {
    getDb().then((db) => getRecentDocuments(db, 50)).then(setHistory);
  }, []);

  const handleClear = async () => {
    const db = await getDb();
    await clearHistory(db);
    setHistory([]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: c.background }}>
      <FlatList
        data={history}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <View style={{ flexDirection: 'row', alignItems: 'center', padding: 14, backgroundColor: c.surface, borderRadius: 10, marginBottom: 6 }}>
            <Clock size={20} color={c.textSecondary} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={{ fontSize: 15, fontWeight: '500', color: c.text }} numberOfLines={1}>{item.name}</Text>
              <Text style={{ fontSize: 12, color: c.textSecondary }}>{Math.round(item.progress * 100)}% read</Text>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={{ padding: 40, alignItems: 'center' }}>
            <Clock size={48} color={c.textTertiary} />
            <Text style={{ color: c.textSecondary, marginTop: 12, fontSize: 16 }}>No reading history yet</Text>
          </View>
        }
      />
      {history.length > 0 && (
        <TouchableOpacity
          onPress={handleClear}
          style={{ padding: 16, alignItems: 'center', borderTopWidth: 1, borderTopColor: c.border }}
        >
          <Text style={{ color: c.error, fontWeight: '600' }}>Clear History</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
