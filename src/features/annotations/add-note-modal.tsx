import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal } from 'react-native';
import { X, StickyNote } from 'lucide-react-native';
import { useTheme } from '@/hooks/use-theme';
import { getDb } from '@/db/connection';
import { insertNote } from '@/db/notes';

interface AddNoteModalProps {
  visible: boolean;
  documentId: string;
  page: number;
  onClose: () => void;
  onSaved: () => void;
}

export function AddNoteModal({ visible, documentId, page, onClose, onSaved }: AddNoteModalProps) {
  const c = useTheme();
  const [content, setContent] = useState('');

  const handleSave = async () => {
    if (!content.trim()) return;
    const db = await getDb();
    await insertNote(db, {
      id: `note-${Date.now()}`,
      documentId,
      page,
      paragraphIndex: null,
      content: content.trim(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    setContent('');
    onSaved();
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', padding: 32 }}>
        <View style={{ backgroundColor: c.surface, borderRadius: 20, padding: 24 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <StickyNote size={20} color={c.primary} />
              <Text style={{ fontSize: 18, fontWeight: '600', color: c.text }}>Add Note</Text>
            </View>
            <TouchableOpacity onPress={onClose}><X size={22} color={c.text} /></TouchableOpacity>
          </View>
          <Text style={{ color: c.textSecondary, fontSize: 14, marginBottom: 8 }}>Page {page}</Text>
          <TextInput
            style={{ backgroundColor: c.background, borderRadius: 12, padding: 14, fontSize: 16, color: c.text, minHeight: 120, textAlignVertical: 'top' }}
            placeholder="Write your note..."
            placeholderTextColor={c.textTertiary}
            value={content}
            onChangeText={setContent}
            multiline
            autoFocus
          />
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
