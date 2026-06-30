import { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, RefreshControl, ScrollView, TextInput, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, Bookmark, Trash2, FolderOpen, Plus, X, Pencil } from 'lucide-react-native';

import { useTheme } from '@/hooks/use-theme';
import { getDb } from '@/db/connection';
import { getAllBookmarks, deleteBookmark } from '@/db/bookmarks';
import { getAllFolders, createFolder, renameFolder, deleteFolder, type BookmarkFolder } from '@/db/bookmark-folders';
import type { Bookmark as BookmarkType } from '@/types';
import { EmptyState, LoadingState, ErrorState } from '@/components/empty-state';

export function BookmarksListScreen() {
  const c = useTheme();
  const [bookmarks, setBookmarks] = useState<(BookmarkType & { documentName?: string })[]>([]);
  const [folders, setFolders] = useState<BookmarkFolder[]>([]);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showFolderManager, setShowFolderManager] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [editingFolder, setEditingFolder] = useState<BookmarkFolder | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const db = await getDb();
      const [allBookmarks, allFolders] = await Promise.all([getAllBookmarks(db), getAllFolders(db)]);
      setBookmarks(allBookmarks);
      setFolders(allFolders);
    } catch (e: any) {
      setError(e.message || 'Failed to load bookmarks');
    }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, [load]);

  const handleDelete = async (id: string) => {
    const db = await getDb();
    await deleteBookmark(db, id);
    load();
  };

  const filteredBookmarks = selectedFolderId === null
    ? bookmarks
    : bookmarks.filter((b) => (b as any).folderId === selectedFolderId);

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;
    const db = await getDb();
    await createFolder(db, `folder-${Date.now()}`, newFolderName.trim());
    setNewFolderName('');
    load();
  };

  const handleRenameFolder = async () => {
    if (!editingFolder || !newFolderName.trim()) return;
    const db = await getDb();
    await renameFolder(db, editingFolder.id, newFolderName.trim());
    setEditingFolder(null);
    setNewFolderName('');
    load();
  };

  const handleDeleteFolder = async (id: string) => {
    const db = await getDb();
    await deleteFolder(db, id);
    if (selectedFolderId === id) setSelectedFolderId(null);
    load();
  };

  if (loading) return <SafeAreaView style={{ flex: 1, backgroundColor: c.background }}><LoadingState /></SafeAreaView>;
  if (error) return <SafeAreaView style={{ flex: 1, backgroundColor: c.background }}><ErrorState message={error} onRetry={load} /></SafeAreaView>;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: c.background }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16 }}>
        <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 16 }} accessibilityLabel="Go back" accessibilityRole="button">
          <ArrowLeft size={24} color={c.text} />
        </TouchableOpacity>
        <Text style={{ fontSize: 24, fontWeight: '700', color: c.text, flex: 1 }}>Bookmarks</Text>
        <TouchableOpacity onPress={() => setShowFolderManager(true)} style={{ padding: 6 }} accessibilityLabel="Manage folders" accessibilityRole="button">
          <FolderOpen size={22} color={c.textSecondary} />
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap: 8, marginBottom: 12 }}>
        <TouchableOpacity
          onPress={() => setSelectedFolderId(null)}
          style={{ paddingHorizontal: 14, paddingVertical: 7, borderRadius: 16, backgroundColor: selectedFolderId === null ? c.primary : c.surface }}
        >
          <Text style={{ fontSize: 13, fontWeight: '500', color: selectedFolderId === null ? '#FFF' : c.textSecondary }}>All</Text>
        </TouchableOpacity>
        {folders.map((folder) => (
          <TouchableOpacity
            key={folder.id}
            onPress={() => setSelectedFolderId(folder.id)}
            style={{ paddingHorizontal: 14, paddingVertical: 7, borderRadius: 16, backgroundColor: selectedFolderId === folder.id ? c.primary : c.surface }}
          >
            <Text style={{ fontSize: 13, fontWeight: '500', color: selectedFolderId === folder.id ? '#FFF' : c.textSecondary }}>{folder.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList
        data={filteredBookmarks}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100, flexGrow: 1 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={c.primary} />}
        renderItem={({ item }) => (
          <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: c.surface, borderRadius: 12, padding: 14, marginBottom: 8 }} accessibilityLabel={`Bookmark: ${item.label}, ${item.documentName || 'Document'}, page ${item.page}`} accessibilityRole="button">
            <Bookmark size={20} color={c.primary} style={{ marginRight: 12 }} />
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 15, fontWeight: '500', color: c.text }}>{item.label}</Text>
              <Text style={{ fontSize: 12, color: c.textSecondary, marginTop: 2 }}>
                {item.documentName || 'Document'} · Page {item.page}
              </Text>
            </View>
            <TouchableOpacity onPress={() => handleDelete(item.id)} style={{ padding: 8 }} accessibilityLabel={`Delete bookmark ${item.label}`} accessibilityRole="button">
              <Trash2 size={18} color={c.textSecondary} />
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={<EmptyState icon={Bookmark} title="No bookmarks yet" subtitle="Bookmark pages while reading to find them later" />}
      />

      <Modal visible={showFolderManager} transparent animationType="fade" onRequestClose={() => setShowFolderManager(false)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', padding: 32 }}>
          <View style={{ backgroundColor: c.surface, borderRadius: 20, padding: 24, maxHeight: 450 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <Text style={{ fontSize: 18, fontWeight: '600', color: c.text }}>Manage Folders</Text>
              <TouchableOpacity onPress={() => { setShowFolderManager(false); setEditingFolder(null); setNewFolderName(''); }}><X size={22} color={c.text} /></TouchableOpacity>
            </View>

            <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
              <TextInput
                style={{ flex: 1, backgroundColor: c.background, borderRadius: 10, padding: 12, fontSize: 14, color: c.text }}
                placeholder={editingFolder ? 'Rename folder...' : 'New folder name...'}
                placeholderTextColor={c.textTertiary}
                value={newFolderName}
                onChangeText={setNewFolderName}
              />
              <TouchableOpacity
                onPress={editingFolder ? handleRenameFolder : handleCreateFolder}
                style={{ backgroundColor: c.primary, borderRadius: 10, paddingHorizontal: 16, alignItems: 'center', justifyContent: 'center' }}
              >
                <Plus size={20} color="#FFF" />
              </TouchableOpacity>
            </View>

            <FlatList
              data={folders}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 12, gap: 10 }}>
                  <FolderOpen size={20} color={c.primary} />
                  <Text style={{ fontSize: 16, color: c.text, flex: 1 }}>{item.name}</Text>
                  <TouchableOpacity onPress={() => { setEditingFolder(item); setNewFolderName(item.name); }} style={{ padding: 6 }}>
                    <Pencil size={16} color={c.textSecondary} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDeleteFolder(item.id)} style={{ padding: 6 }}>
                    <Trash2 size={16} color={c.error} />
                  </TouchableOpacity>
                </View>
              )}
              ListEmptyComponent={<Text style={{ color: c.textSecondary, textAlign: 'center', padding: 20 }}>No folders yet</Text>}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
