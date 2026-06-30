import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { ArrowLeft, Bookmark, Search, Settings, ChevronLeft, ChevronRight, Highlighter, StickyNote } from 'lucide-react-native';
import { router } from 'expo-router';
import { useTheme } from '@/hooks/use-theme';

interface EpubToolbarProps {
  title: string;
  chapterTitle: string;
  currentChapter: number;
  totalChapters: number;
  isBookmarked?: boolean;
  onPrevChapter: () => void;
  onNextChapter: () => void;
  onToggleBookmark: () => void;
  onToggleSearch: () => void;
  onToggleSettings: () => void;
  onHighlight?: () => void;
  onNote?: () => void;
  onChapterSelect: (index: number) => void;
  chapters: string[];
}

export function EpubToolbar({
  title, chapterTitle, currentChapter, totalChapters, isBookmarked,
  onPrevChapter, onNextChapter, onToggleBookmark,
  onToggleSearch, onToggleSettings, onHighlight, onNote, chapters, onChapterSelect,
}: EpubToolbarProps) {
  const c = useTheme();

  return (
    <View style={{ backgroundColor: c.surface, borderBottomWidth: 1, borderBottomColor: c.border }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, paddingVertical: 10 }}>
        <TouchableOpacity onPress={() => router.back()}><ArrowLeft size={24} color={c.text} /></TouchableOpacity>
        <Text style={{ flex: 1, fontSize: 15, fontWeight: '600', color: c.text, textAlign: 'center' }} numberOfLines={1}>{title}</Text>
        <View style={{ flexDirection: 'row', gap: 4 }}>
          <TouchableOpacity onPress={onToggleSearch} style={{ padding: 6 }}><Search size={20} color={c.textSecondary} /></TouchableOpacity>
          {onHighlight && <TouchableOpacity onPress={onHighlight} style={{ padding: 6 }}><Highlighter size={20} color={c.textSecondary} /></TouchableOpacity>}
          {onNote && <TouchableOpacity onPress={onNote} style={{ padding: 6 }}><StickyNote size={20} color={c.textSecondary} /></TouchableOpacity>}
          <TouchableOpacity onPress={onToggleBookmark} style={{ padding: 6 }}>
            <Bookmark size={20} color={isBookmarked ? c.primary : c.textSecondary} fill={isBookmarked ? c.primary : 'transparent'} />
          </TouchableOpacity>
          <TouchableOpacity onPress={onToggleSettings} style={{ padding: 6 }}><Settings size={20} color={c.textSecondary} /></TouchableOpacity>
        </View>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingBottom: 8, gap: 8 }}>
        <TouchableOpacity onPress={onPrevChapter}><ChevronLeft size={20} color={currentChapter <= 0 ? c.textTertiary : c.text} /></TouchableOpacity>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flex: 1 }}>
          {chapters.map((ch, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => onChapterSelect(i)}
              style={{ paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12, backgroundColor: i === currentChapter ? c.primary : 'transparent', marginRight: 6 }}
            >
              <Text style={{ fontSize: 12, color: i === currentChapter ? '#FFF' : c.textSecondary }} numberOfLines={1}>{ch}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <TouchableOpacity onPress={onNextChapter}><ChevronRight size={20} color={currentChapter >= totalChapters - 1 ? c.textTertiary : c.text} /></TouchableOpacity>
      </View>
    </View>
  );
}
