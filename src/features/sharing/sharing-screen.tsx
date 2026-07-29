import { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Share2, FileText, FileSpreadsheet, Presentation, Image as ImageIcon, FileArchive } from 'lucide-react-native';
import * as Sharing from 'expo-sharing';

import { useTheme } from '@/hooks/use-theme';
import { useLibraryStore } from '@/stores/library-store';
import type { DocumentType } from '@/types';

function getTypeIcon(type: DocumentType) {
  switch (type) {
    case 'pdf': return FileText;
    case 'epub': return FileText;
    case 'xls': case 'xlsx': case 'csv': return FileSpreadsheet;
    case 'ppt': case 'pptx': return Presentation;
    case 'image': return ImageIcon;
    case 'archive': return FileArchive;
    default: return FileText;
  }
}

export function SharingScreen() {
  const c = useTheme();
  const documents = useLibraryStore((s) => s.documents);
  const fetchDocuments = useLibraryStore((s) => s.fetchDocuments);
  const [selectedDocs, setSelectedDocs] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const toggleSelect = useCallback((id: string) => {
    setSelectedDocs((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const handleShare = useCallback(async () => {
    if (selectedDocs.size === 0) {
      Alert.alert('No Selection', 'Select one or more documents to share.');
      return;
    }
    const available = await Sharing.isAvailableAsync();
    if (!available) {
      Alert.alert('Not Available', 'Sharing is not available on this device.');
      return;
    }
    const selected = documents.filter((d) => selectedDocs.has(d.id));
    if (selected.length === 1) {
      await Sharing.shareAsync(selected[0].path);
    } else {
      for (const doc of selected) {
        await Sharing.shareAsync(doc.path);
      }
    }
    setSelectedDocs(new Set());
  }, [selectedDocs, documents]);

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <View style={{ flex: 1, backgroundColor: c.background }}>
      {selectedDocs.size > 0 && (
        <View style={{ paddingHorizontal: 20, paddingVertical: 12, backgroundColor: c.primaryContainer }}>
          <TouchableOpacity
            onPress={handleShare}
            style={{ backgroundColor: c.primary, borderRadius: 12, padding: 14, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8 }}
          >
            <Share2 size={20} color="#FFF" />
            <Text style={{ color: '#FFF', fontWeight: '600', fontSize: 16 }}>
              Share {selectedDocs.size} Document{selectedDocs.size !== 1 ? 's' : ''}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={documents}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 12, paddingBottom: 100 }}
        renderItem={({ item }) => {
          const Icon = getTypeIcon(item.type);
          const selected = selectedDocs.has(item.id);
          return (
            <TouchableOpacity
              style={{
                flexDirection: 'row', alignItems: 'center', backgroundColor: c.surface,
                borderRadius: 12, padding: 14, marginBottom: 8,
                borderWidth: selected ? 2 : 0, borderColor: selected ? c.primary : 'transparent',
              }}
              onPress={() => toggleSelect(item.id)}
              accessibilityLabel={`${item.name}${selected ? ', selected' : ''}`}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: selected }}
            >
              <View style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: c.primaryContainer, alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={20} color={c.primary} />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={{ fontSize: 15, fontWeight: '500', color: c.text }} numberOfLines={1}>{item.name}</Text>
                <Text style={{ fontSize: 12, color: c.textSecondary, marginTop: 2 }}>
                  {item.type.toUpperCase()} · {formatSize(item.size)}
                </Text>
              </View>
              <View style={{
                width: 24, height: 24, borderRadius: 12, borderWidth: 2,
                borderColor: selected ? c.primary : c.border,
                backgroundColor: selected ? c.primary : 'transparent',
                alignItems: 'center', justifyContent: 'center',
              }}>
                {selected && <Text style={{ color: '#FFF', fontSize: 14, fontWeight: '700' }}>✓</Text>}
              </View>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <View style={{ padding: 40, alignItems: 'center' }}>
            <Share2 size={48} color={c.textTertiary} />
            <Text style={{ fontSize: 17, fontWeight: '600', color: c.text, marginTop: 16 }}>No Documents</Text>
            <Text style={{ fontSize: 14, color: c.textSecondary, textAlign: 'center', marginTop: 8 }}>
              Import documents to your library to share them.
            </Text>
          </View>
        }
      />
    </View>
  );
}
