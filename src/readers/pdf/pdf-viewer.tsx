import { useCallback, useRef, useEffect, useState } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { WebView, type WebViewMessageEvent } from 'react-native-webview';

import { getViewerHtml, getPdfSourceUri } from './pdf-engine';
import { useTheme } from '@/hooks/use-theme';

export interface PdfViewerActions {
  goToPage: (page: number) => void;
  zoomIn: () => void;
  zoomOut: () => void;
}

interface PdfViewerProps {
  path: string;
  onLoad?: (totalPages: number) => void;
  onError?: (error: string) => void;
  onTextSelection?: (text: string) => void;
  actionRef?: React.MutableRefObject<PdfViewerActions | null>;
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

export function PdfViewer({ path, onLoad, onError, onTextSelection, actionRef }: PdfViewerProps) {
  const c = useTheme();
  const ref = useRef<WebView>(null);
  const uri = getPdfSourceUri(path);
  const html = getViewerHtml();

  useEffect(() => {
    if (actionRef) {
      actionRef.current = {
        goToPage: (page: number) => ref.current?.postMessage(JSON.stringify({ type: 'go', page })),
        zoomIn: () => ref.current?.postMessage(JSON.stringify({ type: 'zi' })),
        zoomOut: () => ref.current?.postMessage(JSON.stringify({ type: 'zo' })),
      };
    }
  }, [actionRef]);

  const handleMessage = useCallback((event: WebViewMessageEvent) => {
    try {
      const msg = JSON.parse(event.nativeEvent.data);
      if (msg.type === 'loaded') onLoad?.(msg.pages);
      if (msg.type === 'error') onError?.(msg.message);
      if (msg.type === 'selection') onTextSelection?.(msg.text);
    } catch {}
  }, [onLoad, onError, onTextSelection]);

  return (
    <View style={{ flex: 1, backgroundColor: c.readerBackground }}>
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
