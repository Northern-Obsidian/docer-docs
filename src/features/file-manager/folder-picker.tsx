import { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { ChevronLeft, Folder, ChevronRight } from 'lucide-react-native';
import { Directory, Paths } from 'expo-file-system';

import { useTheme } from '@/hooks/use-theme';

interface FolderPickerProps {
  visible: boolean;
  onSelect: (path: string) => void;
  onCancel: () => void;
}

export function FolderPicker({ visible, onSelect, onCancel }: FolderPickerProps) {
  const c = useTheme();
  const [currentDir, setCurrentDir] = useState<Directory>(Paths.document);

  if (visible && currentDir.uri !== Paths.document.uri) {
    setCurrentDir(Paths.document);
  }

  const { entries, error } = useMemo(() => {
    if (!visible) return { entries: [] as Directory[], error: '' };
    try {
      const items = currentDir.list().filter((item): item is Directory => item instanceof Directory);
      return { entries: items.sort((a, b) => a.name.localeCompare(b.name)), error: '' };
    } catch {
      return { entries: [] as Directory[], error: 'Cannot read this directory' };
    }
  }, [currentDir, visible]);

  const handleNavigate = (dir: Directory) => {
    setCurrentDir(dir);
  };

  const handleGoBack = () => {
    const parent = currentDir.parentDirectory;
    if (parent) setCurrentDir(parent);
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onCancel}>
      <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={onCancel}>
        <View style={{ flex: 1, justifyContent: 'flex-end' }}>
          <View style={{ backgroundColor: c.surface, borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '70%' }}>
            <View style={{ padding: 20, paddingBottom: 8 }}>
              <Text style={{ fontSize: 16, fontWeight: '600', color: c.text, marginBottom: 4 }}>
                Select Destination
              </Text>
              <Text style={{ fontSize: 12, color: c.textTertiary }} numberOfLines={1}>
                {currentDir.uri.replace('file://', '')}
              </Text>
            </View>

            <ScrollView style={{ maxHeight: 360, paddingHorizontal: 16 }}>
              {error ? (
                <Text style={{ color: c.error, fontSize: 13, paddingVertical: 12 }}>{error}</Text>
              ) : entries.length === 0 ? (
                <Text style={{ color: c.textTertiary, fontSize: 13, paddingVertical: 12 }}>No subfolders</Text>
              ) : (
                entries.map((dir) => (
                  <TouchableOpacity
                    key={dir.uri}
                    onPress={() => handleNavigate(dir)}
                    style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 12, gap: 12 }}
                  >
                    <Folder size={20} color={c.primary} />
                    <Text style={{ flex: 1, fontSize: 15, color: c.text }} numberOfLines={1}>{dir.name}</Text>
                    <ChevronRight size={18} color={c.textTertiary} />
                  </TouchableOpacity>
                ))
              )}
            </ScrollView>

            <View style={{ flexDirection: 'row', gap: 12, padding: 16, paddingTop: 12 }}>
              <TouchableOpacity
                onPress={handleGoBack}
                style={{ width: 44, height: 44, borderRadius: 12, borderWidth: 1, borderColor: c.border, alignItems: 'center', justifyContent: 'center' }}
                disabled={currentDir.uri === Paths.document.uri}
              >
                <ChevronLeft size={20} color={currentDir.uri === Paths.document.uri ? c.textTertiary : c.text} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => onSelect(currentDir.uri.replace('file://', ''))}
                style={{ flex: 1, height: 44, borderRadius: 12, backgroundColor: c.primary, alignItems: 'center', justifyContent: 'center' }}
              >
                <Text style={{ color: '#FFF', fontWeight: '600', fontSize: 15 }}>Select Here</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={onCancel}
                style={{ width: 44, height: 44, borderRadius: 12, borderWidth: 1, borderColor: c.border, alignItems: 'center', justifyContent: 'center' }}
              >
                <Text style={{ color: c.text, fontWeight: '600', fontSize: 14 }}>X</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}
