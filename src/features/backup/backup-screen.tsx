import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, Download, Upload, Database, HardDrive, Clock, Trash2 } from 'lucide-react-native';

import { useTheme } from '@/hooks/use-theme';
import { createBackup, shareBackup, getBackupList } from '@/services/backup-service';

export function BackupScreen() {
  const c = useTheme();
  const [backups, setBackups] = useState<{ name: string; size: number; date: string }[]>([]);
  const [creating, setCreating] = useState(false);

  const load = async () => setBackups(await getBackupList());
  useEffect(() => { load(); }, []);

  const handleBackup = async () => {
    setCreating(true);
    const path = await createBackup();
    if (path) {
      Alert.alert('Backup Created', `Database backup saved successfully.`);
      load();
    } else {
      Alert.alert('Error', 'Failed to create backup.');
    }
    setCreating(false);
  };

  const handleShare = async (name: string) => {
    const backupDir = `${require('expo-file-system').documentDirectory}backups/`;
    await shareBackup(backupDir + name);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: c.background }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16 }}>
        <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 16 }}><ArrowLeft size={24} color={c.text} /></TouchableOpacity>
        <Text style={{ fontSize: 24, fontWeight: '700', color: c.text }}>Backup & Restore</Text>
      </View>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}>
        <TouchableOpacity
          onPress={handleBackup}
          disabled={creating}
          style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: c.surface, borderRadius: 12, padding: 16, marginBottom: 12, gap: 14 }}
        >
          <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: c.primaryContainer, alignItems: 'center', justifyContent: 'center' }}>
            {creating ? <ActivityIndicator size="small" color={c.primary} /> : <Upload size={22} color={c.primary} />}
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 16, fontWeight: '500', color: c.text }}>{creating ? 'Creating...' : 'Create Backup'}</Text>
            <Text style={{ fontSize: 12, color: c.textSecondary, marginTop: 2 }}>Backup your database and settings</Text>
          </View>
        </TouchableOpacity>

        {backups.length > 0 && (
          <>
            <Text style={{ fontSize: 14, fontWeight: '600', color: c.textSecondary, marginBottom: 8, marginTop: 8 }}>Previous Backups</Text>
            {backups.map((b) => (
              <View key={b.name} style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: c.surface, borderRadius: 12, padding: 14, marginBottom: 6 }}>
                <Database size={20} color={c.primary} />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={{ fontSize: 13, color: c.text }} numberOfLines={1}>{b.name}</Text>
                  <Text style={{ fontSize: 11, color: c.textSecondary }}>{formatSize(b.size)}</Text>
                </View>
                <TouchableOpacity onPress={() => handleShare(b.name)} style={{ padding: 8 }}>
                  <Upload size={18} color={c.textSecondary} />
                </TouchableOpacity>
              </View>
            ))}
          </>
        )}

        {backups.length === 0 && (
          <View style={{ padding: 40, alignItems: 'center' }}>
            <HardDrive size={48} color={c.textTertiary} />
            <Text style={{ color: c.textSecondary, marginTop: 12 }}>No backups yet</Text>
            <Text style={{ color: c.textTertiary, marginTop: 4, fontSize: 13 }}>Create your first backup to protect your data</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
