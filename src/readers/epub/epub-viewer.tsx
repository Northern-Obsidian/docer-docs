import { View, ActivityIndicator, Text } from 'react-native';
import { WebView, type WebViewMessageEvent } from 'react-native-webview';
import { useTheme } from '@/hooks/use-theme';
import { useCallback, useRef, useEffect } from 'react';

interface EpubViewerProps {
  html: string;
  onLoad?: () => void;
  onTextSelection?: (text: string) => void;
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

export function EpubViewer({ html, onLoad, onTextSelection }: EpubViewerProps) {
  const c = useTheme();
  const ref = useRef<WebView>(null);

  const handleMessage = useCallback((event: WebViewMessageEvent) => {
    try {
      const msg = JSON.parse(event.nativeEvent.data);
      if (msg.type === 'selection') onTextSelection?.(msg.text);
    } catch {}
  }, [onTextSelection]);

  useEffect(() => {
    if (ref.current) {
      ref.current.injectJavaScript(TEXT_SELECTION_JS);
    }
  }, [html]);

  return (
    <View style={{ flex: 1 }}>
      <WebView
        ref={ref}
        source={{ html }}
        style={{ flex: 1, backgroundColor: 'transparent' }}
        onLoad={onLoad}
        onMessage={handleMessage}
        startInLoadingState
        renderLoading={() => (
          <View style={{ position: 'absolute', inset: 0, alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator size="large" color={c.primary} />
          </View>
        )}
        javaScriptEnabled
        domStorageEnabled
      />
    </View>
  );
}
