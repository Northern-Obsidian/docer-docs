import { useEffect, useState, useCallback, startTransition } from 'react';
import { View, Text, TouchableOpacity, TextInput, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, Tag, Plus, X } from 'lucide-react-native';

import { useTheme } from '@/hooks/use-theme';
import { getDb } from '@/db/connection';
import { getAllTags, insertTag, deleteTag } from '@/db/tags';
import type { Tag as TagType } from '@/types';
import { EmptyState, LoadingState, ErrorState } from '@/components/empty-state';

const TAG_COLORS = ['#FF6B6B', '#FFD93D', '#6BCB77', '#4D96FF', '#FF6B9D', '#C084FC', '#FB923C', '#38BDF8'];

export function TagsScreen() {
  const c = useTheme();
  const [tags, setTags] = useState<TagType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const db = await getDb();
      setTags(await getAllTags(db));
    } catch (e: any) {
      setError(e.message || 'Failed to load tags');
    }
    setLoading(false);
  }, []);

  useEffect(() => { startTransition(() => { load(); }); }, [load]);

  const handleCreate = async () => {
    if (!newName.trim()) return;
    const db = await getDb();
    const color = TAG_COLORS[tags.length % TAG_COLORS.length];
    await insertTag(db, { id: `tag-${Date.now()}`, name: newName.trim().toLowerCase(), color });
    setNewName('');
    setShowCreate(false);
    load();
  };

  const handleDelete = async (id: string) => {
    const db = await getDb();
    await deleteTag(db, id);
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
          <Text style={{ fontSize: 24, fontWeight: '700', color: c.text }}>Tags</Text>
        </View>
        <TouchableOpacity onPress={() => setShowCreate(true)} style={{ backgroundColor: c.primary, width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' }} accessibilityLabel="Create new tag" accessibilityRole="button">
          <Plus size={20} color="#FFF" />
        </TouchableOpacity>
      </View>

      {tags.length > 0 && (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingHorizontal: 20, paddingBottom: 20 }}>
          {tags.map((tag) => (
            <TouchableOpacity
              key={tag.id}
              style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: tag.color || c.surface, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8, gap: 6 }}
              onLongPress={() => handleDelete(tag.id)}
              accessibilityLabel={`Tag: ${tag.name}`}
              accessibilityHint="Long press to delete"
              accessibilityRole="button"
            >
              <Text style={{ color: '#FFF', fontSize: 14, fontWeight: '500' }}>{tag.name}</Text>
              <X size={14} color="rgba(255,255,255,0.7)" />
            </TouchableOpacity>
          ))}
        </View>
      )}

      {tags.length === 0 && <EmptyState icon={Tag} title="No tags yet" subtitle="Create tags to organize your documents" actionLabel="Create Tag" onAction={() => setShowCreate(true)} />}

      <Modal visible={showCreate} transparent animationType="fade" onRequestClose={() => setShowCreate(false)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', padding: 32 }}>
          <View style={{ backgroundColor: c.surface, borderRadius: 20, padding: 24 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <Text style={{ fontSize: 18, fontWeight: '600', color: c.text }}>New Tag</Text>
              <TouchableOpacity onPress={() => setShowCreate(false)} accessibilityLabel="Close" accessibilityRole="button"><X size={22} color={c.text} /></TouchableOpacity>
            </View>
            <TextInput
              style={{ backgroundColor: c.background, borderRadius: 12, padding: 14, fontSize: 16, color: c.text }}
              placeholder="Tag name"
              placeholderTextColor={c.textTertiary}
              value={newName}
              onChangeText={setNewName}
              autoFocus
              accessibilityLabel="Tag name"
            />
            <TouchableOpacity onPress={handleCreate} style={{ backgroundColor: c.primary, borderRadius: 12, padding: 14, alignItems: 'center', marginTop: 16 }} accessibilityLabel="Create tag" accessibilityRole="button">
              <Text style={{ color: '#FFF', fontWeight: '600' }}>Create</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
