import { useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, Search as SearchIcon, X, FileText, Clock, FileSearch } from 'lucide-react-native';

import { useTheme } from '@/hooks/use-theme';
import { useSearchStore } from '@/stores/search-store';
import { EmptyState, LoadingState } from '@/components/empty-state';

function HighlightedSnippet({ text }: { text: string }) {
  if (!text.includes('<mark>')) {
    return <Text style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }} numberOfLines={2}>{text}</Text>;
  }
  const parts = text.split(/(<mark>|<\/mark>)/g);
  const nodes: React.ReactNode[] = [];
  let highlighting = false;
  for (const part of parts) {
    if (part === '<mark>') { highlighting = true; continue; }
    if (part === '</mark>') { highlighting = false; continue; }
    if (highlighting) {
      nodes.push(<Text key={nodes.length} style={{ fontSize: 12, marginTop: 2, backgroundColor: '#fde047', color: '#1c1c1e', fontWeight: '600' }}>{part}</Text>);
    } else {
      nodes.push(<Text key={nodes.length} style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>{part}</Text>);
    }
  }
  return <Text numberOfLines={2}>{nodes}</Text>;
}

export default function SearchScreen() {
  const c = useTheme();
  const query = useSearchStore((s) => s.query);
  const results = useSearchStore((s) => s.results);
  const recentSearches = useSearchStore((s) => s.recentSearches);
  const isSearching = useSearchStore((s) => s.isSearching);
  const setQuery = useSearchStore((s) => s.setQuery);
  const search = useSearchStore((s) => s.search);
  const clearSearch = useSearchStore((s) => s.clearSearch);
  const loadRecentSearches = useSearchStore((s) => s.loadRecentSearches);

  useEffect(() => {
    loadRecentSearches();
  }, [loadRecentSearches]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: c.background }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12, gap: 12 }}>
        <TouchableOpacity onPress={() => router.back()} accessibilityLabel="Go back" accessibilityRole="button">
          <ArrowLeft size={24} color={c.text} />
        </TouchableOpacity>
        <View style={{
          flex: 1, flexDirection: 'row', alignItems: 'center',
          backgroundColor: c.surface, borderRadius: 12, paddingHorizontal: 14, height: 44,
        }}>
          <SearchIcon size={18} color={c.textSecondary} />
          <TextInput
            style={{ flex: 1, marginLeft: 10, fontSize: 16, color: c.text }}
            placeholder="Search documents, content, notes..."
            placeholderTextColor={c.textTertiary}
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={search}
            autoFocus
            returnKeyType="search"
            accessibilityLabel="Search documents"
          />
          {query ? (
            <TouchableOpacity onPress={clearSearch} accessibilityLabel="Clear search" accessibilityRole="button">
              <X size={18} color={c.textSecondary} />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {!query ? (
        <View style={{ paddingHorizontal: 20 }}>
          <Text style={{ fontSize: 13, fontWeight: '600', color: c.textSecondary, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>
            Recent Searches
          </Text>
          {recentSearches.length === 0 ? (
            <Text style={{ color: c.textTertiary, fontSize: 14 }}>No recent searches</Text>
          ) : (
            recentSearches.map((s, i) => (
              <TouchableOpacity
                key={i}
                style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 12 }}
                onPress={() => { setQuery(s); search(); }}
                accessibilityLabel={`Search for ${s}`}
                accessibilityRole="button"
              >
                <Clock size={16} color={c.textSecondary} />
                <Text style={{ marginLeft: 12, fontSize: 15, color: c.text }}>{s}</Text>
              </TouchableOpacity>
            ))
          )}
        </View>
      ) : isSearching ? (
        <LoadingState />
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.documentId + item.snippet}
          contentContainerStyle={{ paddingHorizontal: 20, flexGrow: 1 }}
          renderItem={({ item }) => (
            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'flex-start', backgroundColor: c.surface, borderRadius: 12, padding: 14, marginBottom: 8 }} accessibilityLabel={`${item.documentName}`} accessibilityRole="button">
              <View style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: c.primaryContainer, alignItems: 'center', justifyContent: 'center', marginTop: 2 }}>
                {item.matchType === 'content' ? (
                  <FileSearch size={18} color={c.primary} />
                ) : (
                  <FileText size={18} color={c.primary} />
                )}
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Text style={{ fontSize: 15, fontWeight: '500', color: c.text }} numberOfLines={1}>{item.documentName}</Text>
                  {item.matchType === 'content' ? (
                    <View style={{ backgroundColor: c.primaryContainer, borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2 }}>
                      <Text style={{ fontSize: 10, fontWeight: '600', color: c.primary }}>CONTENT</Text>
                    </View>
                  ) : (
                    <View style={{ backgroundColor: c.surfaceVariant, borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2 }}>
                      <Text style={{ fontSize: 10, fontWeight: '600', color: c.textSecondary }}>NAME</Text>
                    </View>
                  )}
                </View>
                <HighlightedSnippet text={item.snippet} />
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={<EmptyState icon={SearchIcon} title="No results found" subtitle={`No matches for "${query}" in document names or content`} />}
        />
      )}
    </SafeAreaView>
  );
}
