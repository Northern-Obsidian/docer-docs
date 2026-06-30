import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { Pencil, Copy, Move, Trash2, Share2, Info, ExternalLink, FolderOpen, Tag } from 'lucide-react-native';

import { useTheme } from '@/hooks/use-theme';

interface FileActionsProps {
  visible: boolean;
  fileName: string;
  onClose: () => void;
  onRename?: () => void;
  onCopy?: () => void;
  onMove?: () => void;
  onDelete?: () => void;
  onShare?: () => void;
  onInfo?: () => void;
  onOpenWith?: () => void;
  onAddToCollection?: () => void;
  onAddTag?: () => void;
}

export function FileActionsSheet({ visible, fileName, onClose, onRename, onCopy, onMove, onDelete, onShare, onInfo, onOpenWith, onAddToCollection, onAddTag }: FileActionsProps) {
  const c = useTheme();

  const actions = [
    { icon: Pencil, label: 'Rename', action: onRename },
    { icon: Copy, label: 'Duplicate', action: onCopy },
    { icon: Move, label: 'Move', action: onMove },
    { icon: FolderOpen, label: 'Add to Collection', action: onAddToCollection },
    { icon: Tag, label: 'Add Tag', action: onAddTag },
    { icon: Trash2, label: 'Delete', action: onDelete },
    { icon: Share2, label: 'Share', action: onShare },
    { icon: Info, label: 'Properties', action: onInfo },
    { icon: ExternalLink, label: 'Open with...', action: onOpenWith },
  ];

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={onClose}>
        <View style={{ flex: 1, justifyContent: 'flex-end' }}>
          <View style={{ backgroundColor: c.surface, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, paddingBottom: 40 }}>
            <Text style={{ fontSize: 16, fontWeight: '600', color: c.text, marginBottom: 16 }} numberOfLines={1}>{fileName}</Text>
            {actions.map(({ icon: Icon, label, action }) => (
              <TouchableOpacity
                key={label}
                style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 14, gap: 14 }}
                onPress={() => { action?.(); onClose(); }}
                accessibilityLabel={label}
                accessibilityRole="button"
              >
                <Icon size={22} color={c.text} />
                <Text style={{ fontSize: 16, color: c.text }}>{label}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity onPress={onClose} style={{ marginTop: 12, padding: 14, backgroundColor: c.border, borderRadius: 12, alignItems: 'center' }} accessibilityLabel="Cancel" accessibilityRole="button">
              <Text style={{ color: c.text, fontWeight: '600' }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}
