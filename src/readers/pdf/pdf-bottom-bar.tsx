import { View, Text, TouchableOpacity } from 'react-native';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Layers } from 'lucide-react-native';

import { useTheme } from '@/hooks/use-theme';
import type { ScrollMode } from '@/types';

interface PdfBottomBarProps {
  currentPage: number;
  totalPages: number;
  zoom: number;
  scrollMode: ScrollMode;
  onPrevPage: () => void;
  onNextPage: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onScrollModeChange: (mode: ScrollMode) => void;
}

export function PdfBottomBar({
  currentPage, totalPages, zoom, scrollMode,
  onPrevPage, onNextPage, onZoomIn, onZoomOut, onScrollModeChange,
}: PdfBottomBarProps) {
  const c = useTheme();

  return (
    <View style={{
      flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
      paddingHorizontal: 16, paddingVertical: 10,
      backgroundColor: c.surface, borderTopWidth: 1, borderTopColor: c.border,
    }}>
      {/* Page Navigation */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <TouchableOpacity onPress={onPrevPage} style={{ padding: 4 }}>
          <ChevronLeft size={22} color={currentPage <= 1 ? c.textTertiary : c.text} />
        </TouchableOpacity>
        <Text style={{ color: c.text, fontSize: 14, minWidth: 60, textAlign: 'center' }}>
          {currentPage} / {totalPages || '--'}
        </Text>
        <TouchableOpacity onPress={onNextPage} style={{ padding: 4 }}>
          <ChevronRight size={22} color={c.text} />
        </TouchableOpacity>
      </View>

      {/* Scroll Mode */}
      <TouchableOpacity onPress={() => {
        const modes: ScrollMode[] = ['continuous', 'single', 'double'];
        const idx = modes.indexOf(scrollMode);
        onScrollModeChange(modes[(idx + 1) % modes.length]);
      }} style={{ padding: 4 }}>
        <Layers size={20} color={c.textSecondary} />
      </TouchableOpacity>

      {/* Zoom */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <TouchableOpacity onPress={onZoomOut} style={{ padding: 4 }}>
          <ZoomOut size={22} color={c.text} />
        </TouchableOpacity>
        <Text style={{ color: c.text, fontSize: 13, minWidth: 36, textAlign: 'center' }}>
          {Math.round(zoom * 100)}%
        </Text>
        <TouchableOpacity onPress={onZoomIn} style={{ padding: 4 }}>
          <ZoomIn size={22} color={c.text} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
