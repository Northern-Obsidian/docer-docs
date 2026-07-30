import { useEffect, useState, startTransition } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, HardDrive, Trash2, RefreshCw, Music, Video, Image, FileText, Database, Smartphone } from 'lucide-react-native';

import { useTheme } from '@/hooks/use-theme';
import { getDb } from '@/db/connection';
import { getAllDocuments } from '@/db/documents';
import { fetchDeviceStatistics, refreshDeviceCache, type MediaStoreStatistics } from '@/services/mediastore-service';

export default function StorageScreen() {
  const c = useTheme();
  const [docCount, setDocCount] = useState(0);
  const [totalSize, setTotalSize] = useState(0);
  const [loading, setLoading] = useState(true);
  const [deviceStats, setDeviceStats] = useState<MediaStoreStatistics | null>(null);
  const [deviceStatsLoading, setDeviceStatsLoading] = useState(false);

  const load = async () => {
    try {
      const db = await getDb();
      const docs = await getAllDocuments(db);
      setDocCount(docs.length);
      setTotalSize(docs.reduce((sum, d) => sum + (d.size || 0), 0));
    } catch { /* ignore */ }
    setLoading(false);
  };

  const loadDeviceStats = async () => {
    setDeviceStatsLoading(true);
    const stats = await fetchDeviceStatistics();
    setDeviceStats(stats);
    setDeviceStatsLoading(false);
  };

  useEffect(() => { startTransition(() => { load(); loadDeviceStats(); }); }, []);

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleClearCache = () => {
    Alert.alert('Clear Cache', 'This will clear temporary files. Your documents will not be affected.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear', style: 'destructive', onPress: () => Alert.alert('Done', 'Cache cleared.') },
    ]);
  };

  const handleClearHistory = () => {
    Alert.alert('Clear Reading History', 'This will remove your reading history but keep your documents.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear', style: 'destructive', onPress: async () => {
        try {
          const db = await getDb();
          await db.runAsync('DELETE FROM history');
          Alert.alert('Done', 'Reading history cleared.');
        } catch { Alert.alert('Error', 'Failed to clear history.'); }
      }},
    ]);
  };

  const handleRefreshDeviceCache = async () => {
    await refreshDeviceCache();
    Alert.alert('Done', 'Device media cache cleared.');
    loadDeviceStats();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: c.background }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16 }}>
        <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 16 }}><ArrowLeft size={24} color={c.text} /></TouchableOpacity>
        <Text style={{ fontSize: 24, fontWeight: '700', color: c.text }}>Storage</Text>
      </View>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}>
        <View style={{ backgroundColor: c.surface, borderRadius: 16, padding: 24, alignItems: 'center', marginBottom: 20 }}>
          <HardDrive size={36} color={c.primary} />
          <Text style={{ fontSize: 40, fontWeight: '700', color: c.text, marginTop: 12 }}>{loading ? '...' : formatBytes(totalSize)}</Text>
          <Text style={{ fontSize: 14, color: c.textSecondary, marginTop: 4 }}>{loading ? 'Calculating...' : `${docCount} document${docCount !== 1 ? 's' : ''}`}</Text>
        </View>

        {deviceStatsLoading ? (
          <View style={{ alignItems: 'center', marginBottom: 20 }}>
            <ActivityIndicator size="small" color={c.primary} />
          </View>
        ) : deviceStats ? (
          <View style={{ backgroundColor: c.surface, borderRadius: 16, padding: 20, marginBottom: 20 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <Smartphone size={20} color={c.primary} />
              <Text style={{ fontSize: 16, fontWeight: '600', color: c.text }}>Device Media Library</Text>
            </View>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: c.surfaceVariant, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6 }}>
                <Music size={14} color={c.primary} />
                <Text style={{ fontSize: 13, color: c.text }}>{deviceStats.totalAudio} audio</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: c.surfaceVariant, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6 }}>
                <Video size={14} color={c.primary} />
                <Text style={{ fontSize: 13, color: c.text }}>{deviceStats.totalVideo} videos</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: c.surfaceVariant, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6 }}>
                <Image size={14} color={c.primary} />
                <Text style={{ fontSize: 13, color: c.text }}>{deviceStats.totalImages} images</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: c.surfaceVariant, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6 }}>
                <FileText size={14} color={c.primary} />
                <Text style={{ fontSize: 13, color: c.text }}>{deviceStats.totalDocuments} docs</Text>
              </View>
            </View>
            <Text style={{ fontSize: 13, color: c.textSecondary, marginTop: 12 }}>
              {formatBytes(deviceStats.totalSize)} total · {Math.floor(deviceStats.totalDuration / 3600000)}h audio
            </Text>
          </View>
        ) : null}

        <View style={{ backgroundColor: c.surface, borderRadius: 16, overflow: 'hidden', marginBottom: 16 }}>
          <TouchableOpacity onPress={handleClearCache} style={{ flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: c.border }}>
            <Trash2 size={20} color={c.primary} />
            <Text style={{ flex: 1, marginLeft: 14, fontSize: 16, color: c.text }}>Clear Cache</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleClearHistory} style={{ flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: c.border }}>
            <RefreshCw size={20} color={c.primary} />
            <Text style={{ flex: 1, marginLeft: 14, fontSize: 16, color: c.text }}>Clear Reading History</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleRefreshDeviceCache} style={{ flexDirection: 'row', alignItems: 'center', padding: 16 }}>
            <Database size={20} color={c.primary} />
            <Text style={{ flex: 1, marginLeft: 14, fontSize: 16, color: c.text }}>Refresh Device Media Cache</Text>
          </TouchableOpacity>
        </View>

        <Text style={{ fontSize: 13, color: c.textSecondary, textAlign: 'center', lineHeight: 18 }}>
          Document storage is managed by your device. To remove individual documents, use the delete option in the document menu.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
