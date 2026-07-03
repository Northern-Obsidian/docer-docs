import { useCallback, useRef, useEffect, useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, FlatList, ActivityIndicator, ScrollView, Image } from 'react-native';
import { WebView, type WebViewMessageEvent } from 'react-native-webview';
import { Search, X, ChevronUp, ChevronDown, PanelRightClose } from 'lucide-react-native';

import { getViewerHtml, getPdfSourceUri } from './pdf-engine';
import { useTheme } from '@/hooks/use-theme';

export interface PdfViewerActions {
  goToPage: (page: number) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  toggleSearch: () => void;
  toggleThumbnails: () => void;
}

interface PdfViewerProps {
  path: string;
  onLoad?: (totalPages: number) => void;
  onError?: (error: string) => void;
  onTextSelection?: (text: string) => void;
  actionRef?: React.MutableRefObject<PdfViewerActions | null>;
  showThumbnails?: boolean;
}

const TEXT_SELECTION_JS = `
  (function() {
    var lastText = '';
    document.addEventListener('selectionchange', function() {
      var sel = window.getSelection();
      if (sel && sel.toString().trim().length > 0) {
        var text = sel.toString().trim();
        if (text !== lastText) {
          lastText = text;
          window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'selection', text: text }));
        }
      }
    });
  })();
`;

export function PdfViewer({ path, onLoad, onError, onTextSelection, actionRef, showThumbnails }: PdfViewerProps) {
  const c = useTheme();
  const ref = useRef<WebView>(null);
  const uri = getPdfSourceUri(path);
  const html = getViewerHtml();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{ page: number; snippet: string }[]>([]);
  const [searchResultCount, setSearchResultCount] = useState(0);
  const [pageCount, setPageCount] = useState(0);

  useEffect(() => {
    if (actionRef) {
      actionRef.current = {
        goToPage: (page: number) => ref.current?.postMessage(JSON.stringify({ type: 'go', page })),
        zoomIn: () => ref.current?.postMessage(JSON.stringify({ type: 'zi' })),
        zoomOut: () => ref.current?.postMessage(JSON.stringify({ type: 'zo' })),
        toggleSearch: () => ref.current?.postMessage(JSON.stringify({ type: 'search' })),
        toggleThumbnails: () => ref.current?.postMessage(JSON.stringify({ type: 'thumbnails' })),
      };
    }
  }, [actionRef]);

  const handleMessage = useCallback((event: WebViewMessageEvent) => {
    try {
      const msg = JSON.parse(event.nativeEvent.data);
      if (msg.type === 'loaded') { onLoad?.(msg.pages); setPageCount(msg.pages); }
      if (msg.type === 'error') onError?.(msg.message);
      if (msg.type === 'selection') onTextSelection?.(msg.text);
      if (msg.type === 'searchToggled') setSearchOpen(msg.open);
    } catch {}
  }, [onLoad, onError, onTextSelection]);

  const handleSearchQuery = useCallback((text: string) => {
    setSearchQuery(text);
    ref.current?.postMessage(JSON.stringify({ type: 'searchQuery', query: text }));
  }, []);

  const goToSearchResult = useCallback((page: number) => {
    ref.current?.postMessage(JSON.stringify({ type: 'go', page }));
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: c.readerBackground }}>
      {searchOpen && (
        <View style={{
          position: 'absolute', top: 0, left: 0, right: 0, zIndex: 100,
          backgroundColor: c.surface, borderBottomWidth: 1, borderBottomColor: c.border,
          paddingHorizontal: 12, paddingVertical: 8,
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Search size={18} color={c.textSecondary} />
            <TextInput
              value={searchQuery}
              onChangeText={handleSearchQuery}
              placeholder="Search in document..."
              placeholderTextColor={c.textTertiary}
              style={{ flex: 1, fontSize: 15, color: c.text, paddingVertical: 6 }}
              autoFocus
            />
            <TouchableOpacity onPress={() => ref.current?.postMessage(JSON.stringify({ type: 'search' }))}>
              <X size={20} color={c.textSecondary} />
            </TouchableOpacity>
          </View>
          {searchResultCount > 0 && (
            <Text style={{ color: c.textSecondary, fontSize: 12, marginTop: 4 }}>
              {searchResultCount} result{searchResultCount !== 1 ? 's' : ''} found
            </Text>
          )}
          {searchResults.length > 0 && (
            <ScrollView style={{ maxHeight: 160 }} showsVerticalScrollIndicator>
              {searchResults.map((r, i) => (
                <TouchableOpacity
                  key={i}
                  onPress={() => goToSearchResult(r.page)}
                  style={{ paddingVertical: 4 }}
                >
                  <Text style={{ fontSize: 12, color: c.primary }}>Page {r.page}</Text>
                  <Text style={{ fontSize: 12, color: c.textSecondary }} numberOfLines={1}>{r.snippet}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>
      )}

      <WebView
        ref={ref}
        source={{ html }}
        style={{ flex: 1, backgroundColor: 'transparent' }}
        onMessage={handleMessage}
        onLoadEnd={() => {
          ref.current?.postMessage(JSON.stringify({ type: 'load', url: uri }));
          ref.current?.injectJavaScript(TEXT_SELECTION_JS);
        }}
        javaScriptEnabled
        domStorageEnabled
        startInLoadingState
        renderLoading={() => (
          <View style={{ position: 'absolute', inset: 0, alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator size="large" color={c.primary} />
            <Text style={{ color: c.textSecondary, marginTop: 12, fontSize: 14 }}>Preparing PDF engine...</Text>
          </View>
        )}
        renderError={(errorName) => (
          <View style={{ position: 'absolute', inset: 0, alignItems: 'center', justifyContent: 'center', padding: 32 }}>
            <Text style={{ color: c.error, fontSize: 16, fontWeight: '600' }}>Failed to load PDF</Text>
            <Text style={{ color: c.textSecondary, marginTop: 8, textAlign: 'center' }}>{errorName}</Text>
          </View>
        )}
      />
    </View>
  );
}
