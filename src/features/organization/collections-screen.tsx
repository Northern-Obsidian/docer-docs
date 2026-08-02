import { useEffect, useState, useCallback, startTransition } from 'react';
import { View, Text, TouchableOpacity, TextInput, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlashList } from '@shopify/flash-list';
import { router } from 'expo-router';
import { ArrowLeft, Folder, Plus, X, FolderOpen } from 'lucide-react-native';

import { useTheme } from '@/hooks/use-theme';
import { getDb } from '@/db/connection';
import { getAllCollections, insertCollection, deleteCollection } from '@/db/collections';
import type { Collection } from '@/types';
import { EmptyState, LoadingState, ErrorState } from '@/components/empty-state';

export function CollectionsScreen() {
  const c = useTheme();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const db = await getDb();
      setCollections(await getAllCollections(db));
    } catch (e: any) {
      setError(e.message || 'Failed to load collections');
    }
    setLoading(false);
  }, []);

  useEffect(() => { startTransition(() => { load(); }); }, [load]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, [load]);

  const handleCreate = async () => {
    if (!newName.trim()) return;
    const db = await getDb();
    await insertCollection(db, {
      id: `col-${Date.now()}`,
      name: newName.trim(),
      icon: null,
      color: null,
      sortOrder: collections.length,
      pinnedToHome: false,
      createdAt: new Date().toISOString(),
    });
    setNewName('');
    setShowCreate(false);
    load();
  };

  const handleDelete = async (id: string) => {
    const db = await getDb();
    await deleteCollection(db, id);
    load();
  };

  if (loading) return <SafeAreaView style={{ flex: 1, backgroundColor: c.background }}><LoadingState /></SafeAreaView>;
  if (error) return <SafeAreaView style={{ flex: 1, backgroundColor: c.background }}><ErrorState message={error} onRetry={load} /></SafeAreaView>;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: c.background }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 16 }} accessibilityLabel="Go back" accessibilityRole="button">
            <ArrowLeft size={24} color={c.text} />
          </TouchableOpacity>
          <Text style={{ fontSize: 24, fontWeight: '700', color: c.text }}>Collections</Text>
        </View>
        <TouchableOpacity onPress={() => setShowCreate(true)} style={{ backgroundColor: c.primary, width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' }} accessibilityLabel="Create new collection" accessibilityRole="button">
          <Plus size={20} color="#FFF" />
        </TouchableOpacity>
      </View>

      <FlashList
        data={collections}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100, flexGrow: 1 }}
        refreshing={refreshing}
        onRefresh={onRefresh}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: c.surface, borderRadius: 12, padding: 16, marginBottom: 8 }}
            onLongPress={() => handleDelete(item.id)}
            accessibilityLabel={`Collection: ${item.name}`}
            accessibilityHint="Long press to delete"
            accessibilityRole="button"
          >
            <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: c.primaryContainer, alignItems: 'center', justifyContent: 'center' }}>
              <FolderOpen size={22} color={c.primary} />
            </View>
            <View style={{ flex: 1, marginLeft: 14 }}>
              <Text style={{ fontSize: 16, fontWeight: '500', color: c.text }}>{item.name}</Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<EmptyState icon={Folder} title="No collections yet" subtitle="Group your documents into collections" actionLabel="Create Collection" onAction={() => setShowCreate(true)} />}
      />

      <Modal visible={showCreate} transparent animationType="fade" onRequestClose={() => setShowCreate(false)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', padding: 32 }}>
          <View style={{ backgroundColor: c.surface, borderRadius: 20, padding: 24 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <Text style={{ fontSize: 18, fontWeight: '600', color: c.text }}>New Collection</Text>
              <TouchableOpacity onPress={() => setShowCreate(false)} accessibilityLabel="Close" accessibilityRole="button"><X size={22} color={c.text} /></TouchableOpacity>
            </View>
            <TextInput
              style={{ backgroundColor: c.background, borderRadius: 12, padding: 14, fontSize: 16, color: c.text }}
              placeholder="Collection name"
              placeholderTextColor={c.textTertiary}
              value={newName}
              onChangeText={setNewName}
              autoFocus
              accessibilityLabel="Collection name"
            />
            <TouchableOpacity onPress={handleCreate} style={{ backgroundColor: c.primary, borderRadius: 12, padding: 14, alignItems: 'center', marginTop: 16 }} accessibilityLabel="Create collection" accessibilityRole="button">
              <Text style={{ color: '#FFF', fontWeight: '600' }}>Create</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
