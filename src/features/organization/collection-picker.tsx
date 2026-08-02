import { useEffect, useState, startTransition } from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { X, FolderOpen, Check } from 'lucide-react-native';

import { useTheme } from '@/hooks/use-theme';
import { getDb } from '@/db/connection';
import { getAllCollections, getDocumentsByCollection, addDocumentToCollection, removeDocumentFromCollection } from '@/db/collections';
import type { Collection } from '@/types';

interface CollectionPickerProps {
  visible: boolean;
  documentId: string;
  onClose: () => void;
}

export function CollectionPicker({ visible, documentId, onClose }: CollectionPickerProps) {
  const c = useTheme();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [memberIds, setMemberIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!visible) return;
    const load = async () => {
      const db = await getDb();
      const allCollections = await getAllCollections(db);
      setCollections(allCollections);
      const memberShips = new Set<string>();
      for (const col of allCollections) {
        const docs = await getDocumentsByCollection(db, col.id);
        if (docs.some((d: any) => d.id === documentId)) memberShips.add(col.id);
      }
      setMemberIds(memberShips);
    };
    startTransition(() => { load(); });
  }, [visible, documentId]);

  const toggle = async (collectionId: string) => {
    const db = await getDb();
    if (memberIds.has(collectionId)) {
      await removeDocumentFromCollection(db, collectionId, documentId);
      memberIds.delete(collectionId);
      setMemberIds(new Set(memberIds));
    } else {
      await addDocumentToCollection(db, collectionId, documentId);
      memberIds.add(collectionId);
      setMemberIds(new Set(memberIds));
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', padding: 32 }}>
        <View style={{ backgroundColor: c.surface, borderRadius: 20, padding: 24, maxHeight: 400 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <Text style={{ fontSize: 18, fontWeight: '600', color: c.text }}>Add to Collection</Text>
            <TouchableOpacity onPress={onClose} accessibilityLabel="Close" accessibilityRole="button"><X size={22} color={c.text} /></TouchableOpacity>
          </View>
          <FlashList
            data={collections}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              const isMember = memberIds.has(item.id);
              return (
                <TouchableOpacity
                  style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 12, gap: 12 }}
                  onPress={() => toggle(item.id)}
                  accessibilityLabel={`${item.name} collection`}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: isMember }}
                >
                  <View style={{ width: 24, height: 24, borderRadius: 6, borderWidth: 2, borderColor: isMember ? c.primary : c.border, alignItems: 'center', justifyContent: 'center', backgroundColor: isMember ? c.primary : 'transparent' }}>
                    {isMember && <Check size={16} color="#FFF" />}
                  </View>
                  <FolderOpen size={20} color={c.primary} />
                  <Text style={{ fontSize: 16, color: c.text, flex: 1 }}>{item.name}</Text>
                </TouchableOpacity>
              );
            }}
            ListEmptyComponent={<Text style={{ color: c.textSecondary, textAlign: 'center', padding: 20 }}>No collections yet</Text>}
          />
        </View>
      </View>
    </Modal>
  );
}
