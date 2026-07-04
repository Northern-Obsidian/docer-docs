import { useEffect, useState, useCallback, startTransition } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, Modal, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, StickyNote, Plus, X, Trash2 } from 'lucide-react-native';

import { useTheme } from '@/hooks/use-theme';
import { getDb } from '@/db/connection';
import { getAllNotes, insertNote, deleteNote } from '@/db/notes';
import type { Note } from '@/types';
import { EmptyState, LoadingState, ErrorState } from '@/components/empty-state';

export function NotesListScreen() {
  const c = useTheme();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newContent, setNewContent] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const db = await getDb();
      setNotes(await getAllNotes(db));
    } catch (e: any) {
      setError(e.message || 'Failed to load notes');
    }
    setLoading(false);
  }, []);

  useEffect(() => { startTransition(() => { load(); }); }, [load]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, [load]);

  const handleAdd = async () => {
    if (!newContent.trim()) return;
    const db = await getDb();
    await insertNote(db, {
      id: `note-${Date.now()}`,
      documentId: 'temp',
      page: null,
      paragraphIndex: null,
      content: newContent,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    setNewContent('');
    setShowAdd(false);
    load();
  };

  const handleDelete = async (id: string) => {
    const db = await getDb();
    await deleteNote(db, id);
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
          <Text style={{ fontSize: 24, fontWeight: '700', color: c.text }}>Notes</Text>
        </View>
        <TouchableOpacity onPress={() => setShowAdd(true)} style={{ backgroundColor: c.primary, width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' }} accessibilityLabel="Add new note" accessibilityRole="button">
          <Plus size={20} color="#FFF" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={notes}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100, flexGrow: 1 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={c.primary} />}
        renderItem={({ item }) => (
          <View style={{ backgroundColor: c.surface, borderRadius: 12, padding: 16, marginBottom: 8 }} accessibilityLabel={`Note: ${item.content}`} accessibilityRole="button">
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 14, color: c.text, flex: 1, lineHeight: 20 }}>{item.content}</Text>
              <TouchableOpacity onPress={() => handleDelete(item.id)} style={{ marginLeft: 8 }} accessibilityLabel="Delete note" accessibilityRole="button">
                <Trash2 size={16} color={c.textSecondary} />
              </TouchableOpacity>
            </View>
            <Text style={{ fontSize: 11, color: c.textTertiary, marginTop: 8 }}>
              {new Date(item.createdAt).toLocaleDateString()}
            </Text>
          </View>
        )}
        ListEmptyComponent={<EmptyState icon={StickyNote} title="No notes yet" subtitle="Add notes while reading to capture your thoughts" actionLabel="Add Note" onAction={() => setShowAdd(true)} />}
      />

      <Modal visible={showAdd} transparent animationType="fade" onRequestClose={() => setShowAdd(false)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', padding: 32 }}>
          <View style={{ backgroundColor: c.surface, borderRadius: 20, padding: 24 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <Text style={{ fontSize: 18, fontWeight: '600', color: c.text }}>New Note</Text>
              <TouchableOpacity onPress={() => setShowAdd(false)} accessibilityLabel="Close" accessibilityRole="button"><X size={22} color={c.text} /></TouchableOpacity>
            </View>
            <TextInput
              style={{ backgroundColor: c.background, borderRadius: 12, padding: 14, fontSize: 16, color: c.text, minHeight: 120, textAlignVertical: 'top' }}
              placeholder="Write your note..."
              placeholderTextColor={c.textTertiary}
              value={newContent}
              onChangeText={setNewContent}
              multiline
              autoFocus
              accessibilityLabel="Note content"
            />
            <TouchableOpacity onPress={handleAdd} style={{ backgroundColor: c.primary, borderRadius: 12, padding: 14, alignItems: 'center', marginTop: 16 }} accessibilityLabel="Save note" accessibilityRole="button">
              <Text style={{ color: '#FFF', fontWeight: '600' }}>Save Note</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
