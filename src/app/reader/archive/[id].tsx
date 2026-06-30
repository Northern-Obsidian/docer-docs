import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { router } from 'expo-router';
import { ArrowLeft, File, Folder, FileArchive, Search, Download } from 'lucide-react-native';

import { useTheme } from '@/hooks/use-theme';
import { useDocumentStore } from '@/stores/document-store';
import { getDb } from '@/db/connection';
import { getDocumentById } from '@/db/documents';

interface ArchiveEntry {
  name: string;
  path: string;
  isDirectory: boolean;
  size: number;
}

const MOCK_ENTRIES: ArchiveEntry[] = [
  { name: 'documents/', path: '/documents/', isDirectory: true, size: 0 },
  { name: 'images/', path: '/images/', isDirectory: true, size: 0 },
  { name: 'report.pdf', path: '/report.pdf', isDirectory: false, size: 2450000 },
  { name: 'notes.txt', path: '/notes.txt', isDirectory: false, size: 12500 },
  { name: 'photo.jpg', path: '/photo.jpg', isDirectory: false, size: 3800000 },
  { name: 'data.json', path: '/data.json', isDirectory: false, size: 56000 },
  { name: 'script.js', path: '/script.js', isDirectory: false, size: 8200 },
  { name: 'README.md', path: '/README.md', isDirectory: false, size: 3400 },
];

export default function ArchiveExplorerScreen() {
  const c = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [docName, setDocName] = useState('Archive');

  useEffect(() => {
    if (id) {
      getDb().then(async (db) => {
        const doc = await getDocumentById(db, id);
        if (doc) setDocName(doc.name);
      });
    }
  }, [id]);

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: c.background }} edges={['top']}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, paddingVertical: 10, backgroundColor: c.surface, borderBottomWidth: 1, borderBottomColor: c.border }}>
        <TouchableOpacity onPress={() => router.back()} accessibilityLabel="Go back" accessibilityRole="button"><ArrowLeft size={24} color={c.text} /></TouchableOpacity>
        <Text style={{ flex: 1, fontSize: 15, fontWeight: '600', color: c.text, textAlign: 'center' }} numberOfLines={1}>{docName}</Text>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <TouchableOpacity style={{ padding: 6 }} accessibilityLabel="Search archive" accessibilityRole="button"><Search size={20} color={c.textSecondary} /></TouchableOpacity>
          <TouchableOpacity style={{ padding: 6 }} accessibilityLabel="Download archive" accessibilityRole="button"><Download size={20} color={c.textSecondary} /></TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={MOCK_ENTRIES}
        keyExtractor={(item) => item.path}
        contentContainerStyle={{ padding: 12 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{ flexDirection: 'row', alignItems: 'center', padding: 14, backgroundColor: c.surface, borderRadius: 10, marginBottom: 6 }}
            onPress={() => {}}
            accessibilityLabel={`${item.name}${item.isDirectory ? ' folder' : `, ${formatSize(item.size)}`}`}
            accessibilityRole="button"
          >
            {item.isDirectory ? (
              <Folder size={22} color={c.primary} />
            ) : (
              <FileArchive size={22} color={c.textSecondary} />
            )}
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={{ fontSize: 15, fontWeight: '500', color: c.text }}>{item.name}</Text>
              {!item.isDirectory && (
                <Text style={{ fontSize: 12, color: c.textSecondary, marginTop: 2 }}>{formatSize(item.size)}</Text>
              )}
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={{ padding: 40, alignItems: 'center' }}>
            <FileArchive size={48} color={c.textTertiary} />
            <Text style={{ color: c.textSecondary, marginTop: 12, fontSize: 16 }}>Archive is empty</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}
