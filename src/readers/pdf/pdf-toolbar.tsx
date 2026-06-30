import { View, Text, TouchableOpacity } from 'react-native';
import { ArrowLeft, Bookmark, Search, PanelRightClose, Share2, Highlighter, StickyNote } from 'lucide-react-native';
import { router } from 'expo-router';

import { useTheme } from '@/hooks/use-theme';

interface PdfToolbarProps {
  title: string;
  isBookmarked?: boolean;
  onToggleThumbnails?: () => void;
  onToggleBookmark?: () => void;
  onToggleSearch?: () => void;
  onHighlight?: () => void;
  onNote?: () => void;
  onShare?: () => void;
}

export function PdfToolbar({ title, isBookmarked, onToggleThumbnails, onToggleBookmark, onToggleSearch, onHighlight, onNote, onShare }: PdfToolbarProps) {
  const c = useTheme();

  return (
    <View style={{
      flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
      paddingHorizontal: 12, paddingVertical: 10,
      backgroundColor: c.surface, borderBottomWidth: 1, borderBottomColor: c.border,
    }}>
      <TouchableOpacity onPress={() => router.back()} style={{ padding: 4 }}>
        <ArrowLeft size={24} color={c.text} />
      </TouchableOpacity>

      <Text style={{ flex: 1, fontSize: 15, fontWeight: '600', color: c.text, textAlign: 'center', marginHorizontal: 8 }} numberOfLines={1}>
        {title}
      </Text>

      <View style={{ flexDirection: 'row', gap: 4 }}>
        {onToggleSearch && (
          <TouchableOpacity onPress={onToggleSearch} style={{ padding: 6 }}>
            <Search size={20} color={c.textSecondary} />
          </TouchableOpacity>
        )}
        {onHighlight && (
          <TouchableOpacity onPress={onHighlight} style={{ padding: 6 }}>
            <Highlighter size={20} color={c.textSecondary} />
          </TouchableOpacity>
        )}
        {onNote && (
          <TouchableOpacity onPress={onNote} style={{ padding: 6 }}>
            <StickyNote size={20} color={c.textSecondary} />
          </TouchableOpacity>
        )}
        {onToggleBookmark && (
          <TouchableOpacity onPress={onToggleBookmark} style={{ padding: 6 }}>
            <Bookmark size={20} color={isBookmarked ? c.primary : c.textSecondary} fill={isBookmarked ? c.primary : 'transparent'} />
          </TouchableOpacity>
        )}
        {onToggleThumbnails && (
          <TouchableOpacity onPress={onToggleThumbnails} style={{ padding: 6 }}>
            <PanelRightClose size={20} color={c.textSecondary} />
          </TouchableOpacity>
        )}
        {onShare && (
          <TouchableOpacity onPress={onShare} style={{ padding: 6 }}>
            <Share2 size={20} color={c.textSecondary} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
