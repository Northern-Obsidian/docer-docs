import { View, Text, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { X, FileText, Calendar, Clock, User, HardDrive, BookOpen } from 'lucide-react-native';

import { useTheme } from '@/hooks/use-theme';
import type { Document } from '@/types';

interface PropertiesPanelProps {
  visible: boolean;
  document: Document | null;
  onClose: () => void;
}

export function PropertiesPanel({ visible, document: doc, onClose }: PropertiesPanelProps) {
  const c = useTheme();

  if (!doc) return null;

  const rows = [
    { icon: FileText, label: 'Name', value: doc.name },
    { icon: HardDrive, label: 'Size', value: doc.size ? `${(doc.size / 1024 / 1024).toFixed(2)} MB` : '--' },
    { icon: FileText, label: 'Type', value: doc.type.toUpperCase() },
    { icon: User, label: 'Author', value: doc.author || 'Unknown' },
    { icon: Calendar, label: 'Created', value: doc.createdAt ? new Date(doc.createdAt).toLocaleDateString() : '--' },
    { icon: Clock, label: 'Modified', value: doc.modifiedAt ? new Date(doc.modifiedAt).toLocaleDateString() : '--' },
    { icon: BookOpen, label: 'Pages', value: doc.pageCount?.toString() || '--' },
  ];

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', padding: 32 }}>
        <View style={{ backgroundColor: c.surface, borderRadius: 20, padding: 24, maxHeight: '80%' }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <Text style={{ fontSize: 18, fontWeight: '600', color: c.text }}>Properties</Text>
            <TouchableOpacity onPress={onClose} accessibilityLabel="Close" accessibilityRole="button"><X size={22} color={c.text} /></TouchableOpacity>
          </View>
          <ScrollView>
            {rows.map(({ icon: Icon, label, value }) => (
              <View key={label} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: c.border }}>
                <Icon size={18} color={c.textSecondary} />
                <Text style={{ color: c.textSecondary, fontSize: 14, marginLeft: 12, width: 80 }}>{label}</Text>
                <Text style={{ color: c.text, fontSize: 14, flex: 1, textAlign: 'right' }} numberOfLines={1}>{value}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
