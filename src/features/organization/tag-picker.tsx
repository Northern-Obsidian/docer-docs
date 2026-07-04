import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList } from 'react-native';
import { X, Tag as TagIcon } from 'lucide-react-native';

import { useTheme } from '@/hooks/use-theme';
import { getDb } from '@/db/connection';
import { getAllTags, addTagToDocument, removeTagFromDocument, getTagsByDocument } from '@/db/tags';
import type { Tag } from '@/types';

interface TagPickerProps {
  visible: boolean;
  documentId: string;
  onClose: () => void;
}

export function TagPicker({ visible, documentId, onClose }: TagPickerProps) {
  const c = useTheme();
  const [tags, setTags] = useState<Tag[]>([]);
  const [assignedIds, setAssignedIds] = useState<Set<string>>(new Set());

  const load = async () => {
    const db = await getDb();
    setTags(await getAllTags(db));
    const assigned = await getTagsByDocument(db, documentId);
    setAssignedIds(new Set(assigned.map((t: Tag) => t.id)));
  };

  useEffect(() => { if (visible) startTransition(() => { load(); }); }, [visible, documentId]);

  const toggle = async (tagId: string) => {
    const db = await getDb();
    if (assignedIds.has(tagId)) {
      await removeTagFromDocument(db, tagId, documentId);
      assignedIds.delete(tagId);
      setAssignedIds(new Set(assignedIds));
    } else {
      await addTagToDocument(db, tagId, documentId);
      assignedIds.add(tagId);
      setAssignedIds(new Set(assignedIds));
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', padding: 32 }}>
        <View style={{ backgroundColor: c.surface, borderRadius: 20, padding: 24, maxHeight: 400 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <Text style={{ fontSize: 18, fontWeight: '600', color: c.text }}>Assign Tags</Text>
            <TouchableOpacity onPress={onClose} accessibilityLabel="Close" accessibilityRole="button"><X size={22} color={c.text} /></TouchableOpacity>
          </View>
          <FlatList
            data={tags}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              const assigned = assignedIds.has(item.id);
              return (
                <TouchableOpacity
                  style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 10, gap: 10 }}
                  onPress={() => toggle(item.id)}
                  accessibilityLabel={`${item.name} tag`}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: assigned }}
                >
                  <TagIcon size={18} color={item.color || c.primary} fill={item.color || c.primary} />
                  <Text style={{ fontSize: 16, color: c.text, flex: 1 }}>{item.name}</Text>
                  <View style={{ width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: assigned ? c.primary : c.border, backgroundColor: assigned ? c.primary : 'transparent', alignItems: 'center', justifyContent: 'center' }}>
                    {assigned && <Text style={{ color: '#FFF', fontSize: 12, fontWeight: '700' }}>✓</Text>}
                  </View>
                </TouchableOpacity>
              );
            }}
            ListEmptyComponent={<Text style={{ color: c.textSecondary, textAlign: 'center', padding: 20 }}>No tags yet</Text>}
          />
        </View>
      </View>
    </Modal>
  );
}
