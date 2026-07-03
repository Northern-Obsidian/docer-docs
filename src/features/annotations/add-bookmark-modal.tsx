import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, FlatList } from 'react-native';
import { X, Bookmark, ChevronDown, FolderOpen } from 'lucide-react-native';
import { useTheme } from '@/hooks/use-theme';
import { getDb } from '@/db/connection';
import { insertBookmark } from '@/db/bookmarks';
import { getAllFolders, type BookmarkFolder } from '@/db/bookmark-folders';

interface AddBookmarkModalProps {
  visible: boolean;
  documentId: string;
  page: number;
  onClose: () => void;
  onSaved: () => void;
}

export function AddBookmarkModal({ visible, documentId, page, onClose, onSaved }: AddBookmarkModalProps) {
  const c = useTheme();
  const [label, setLabel] = useState('');
  const [folders, setFolders] = useState<BookmarkFolder[]>([]);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [showFolderPicker, setShowFolderPicker] = useState(false);

  useEffect(() => {
    if (visible) {
      (async () => {
        const db = await getDb();
        setFolders(await getAllFolders(db));
        setSelectedFolderId(null);
      })();
    }
  }, [visible]);

  const handleSave = async () => {
    const db = await getDb();
    await insertBookmark(db, {
      id: `bm-${Date.now()}`,
      documentId,
      page,
      chapter: null,
      position: null,
      label: label || `Page ${page}`,
      folderId: selectedFolderId ?? undefined,
      createdAt: new Date().toISOString(),
    });
    setLabel('');
    setSelectedFolderId(null);
    onSaved();
    onClose();
  };

  const selectedFolderName = folders.find((f) => f.id === selectedFolderId)?.name ?? 'No folder';

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', padding: 32 }}>
        <View style={{ backgroundColor: c.surface, borderRadius: 20, padding: 24 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Bookmark size={20} color={c.primary} />
              <Text style={{ fontSize: 18, fontWeight: '600', color: c.text }}>Add Bookmark</Text>
            </View>
            <TouchableOpacity onPress={onClose}><X size={22} color={c.text} /></TouchableOpacity>
          </View>
          <Text style={{ color: c.textSecondary, fontSize: 14, marginBottom: 8 }}>Page {page}</Text>
          <TextInput
            style={{ backgroundColor: c.background, borderRadius: 12, padding: 14, fontSize: 16, color: c.text }}
            placeholder="Bookmark label (optional)"
            placeholderTextColor={c.textTertiary}
            value={label}
            onChangeText={setLabel}
            autoFocus
          />

          <TouchableOpacity
            onPress={() => setShowFolderPicker(!showFolderPicker)}
            style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: c.background, borderRadius: 12, padding: 14, marginTop: 10 }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <FolderOpen size={18} color={c.textSecondary} />
              <Text style={{ fontSize: 14, color: c.text }}>{selectedFolderName}</Text>
            </View>
            <ChevronDown size={18} color={c.textSecondary} style={{ transform: [{ rotate: showFolderPicker ? '180deg' : '0deg' }] }} />
          </TouchableOpacity>

          {showFolderPicker && (
            <View style={{ backgroundColor: c.background, borderRadius: 10, marginTop: 6, maxHeight: 120, overflow: 'hidden' }}>
              <TouchableOpacity
                onPress={() => { setSelectedFolderId(null); setShowFolderPicker(false); }}
                style={{ paddingVertical: 10, paddingHorizontal: 14, backgroundColor: selectedFolderId === null ? c.primaryContainer : 'transparent' }}
              >
                <Text style={{ fontSize: 14, color: selectedFolderId === null ? c.primary : c.text }}>No folder</Text>
              </TouchableOpacity>
              <FlatList
                data={folders}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => { setSelectedFolderId(item.id); setShowFolderPicker(false); }}
                    style={{ paddingVertical: 10, paddingHorizontal: 14, backgroundColor: selectedFolderId === item.id ? c.primaryContainer : 'transparent' }}
                  >
                    <Text style={{ fontSize: 14, color: selectedFolderId === item.id ? c.primary : c.text }}>{item.name}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          )}

          <View style={{ flexDirection: 'row', gap: 12, marginTop: 20 }}>
            <TouchableOpacity onPress={onClose} style={{ flex: 1, padding: 14, borderRadius: 12, backgroundColor: c.border, alignItems: 'center' }}>
              <Text style={{ color: c.text, fontWeight: '600' }}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSave} style={{ flex: 1, padding: 14, borderRadius: 12, backgroundColor: c.primary, alignItems: 'center' }}>
              <Text style={{ color: '#FFF', fontWeight: '600' }}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
