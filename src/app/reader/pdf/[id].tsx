import { useEffect, useRef, useCallback, useState } from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';

import { PdfToolbar } from '@/readers/pdf/pdf-toolbar';
import { PdfBottomBar } from '@/readers/pdf/pdf-bottom-bar';
import { PdfViewer, type PdfViewerActions } from '@/readers/pdf/pdf-viewer';
import { HighlightToolbar } from '@/readers/shared/highlight-toolbar';
import { AddBookmarkModal } from '@/features/annotations/add-bookmark-modal';
import { AddNoteModal } from '@/features/annotations/add-note-modal';
import { useTheme } from '@/hooks/use-theme';
import { useReaderStore } from '@/stores/reader-store';
import { useDocumentStore } from '@/stores/document-store';
import { getDb } from '@/db/connection';
import { getDocumentById } from '@/db/documents';
import { upsertHistory } from '@/db/history';
import { getBookmarkByPage, deleteBookmarkByPage } from '@/db/bookmarks';
import { insertHighlight } from '@/db/highlights';

export default function PDFReaderScreen() {
  const c = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [docPath, setDocPath] = useState<string | null>(null);
  const [docName, setDocName] = useState('Document');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showBookmarkModal, setShowBookmarkModal] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const [showHighlightToolbar, setShowHighlightToolbar] = useState(false);

  const currentPage = useReaderStore((s) => s.currentPage);
  const zoom = useReaderStore((s) => s.zoom);
  const setTotalPages = useReaderStore((s) => s.setTotalPages);
  const setZoom = useReaderStore((s) => s.setZoom);
  const showThumbnails = useReaderStore((s) => s.showThumbnails);
  const resetReader = useReaderStore((s) => s.reset);
  const openDocument = useDocumentStore((s) => s.openDocument);
  const currentDocument = useDocumentStore((s) => s.currentDocument);

  const actionsRef = useRef<PdfViewerActions | null>(null);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      await openDocument(id);
      const db = await getDb();
      const doc = await getDocumentById(db, id);
      if (doc) {
        setDocPath(doc.path);
        setDocName(doc.name);
        if (doc.pageCount) setTotalPages(doc.pageCount);
        setLoading(false);
      } else {
        setError('Document not found');
        setLoading(false);
      }
    };
    load();
    return () => resetReader();
  }, [id, openDocument, resetReader, setTotalPages]);

  useEffect(() => {
    if (!id) return;
    (async () => {
      const db = await getDb();
      const bm = await getBookmarkByPage(db, id, currentPage);
      setIsBookmarked(!!bm);
    })();
  }, [id, currentPage]);

  const recordProgress = useCallback(async () => {
    if (!id || !currentDocument) return;
    const db = await getDb();
    await upsertHistory(db, {
      id: `hist-${id}`,
      documentId: id,
      lastPage: currentPage,
      lastPosition: null,
      progress: currentDocument.pageCount ? currentPage / currentDocument.pageCount : 0,
      startedAt: new Date().toISOString(),
      lastReadAt: new Date().toISOString(),
      readCount: 1,
      totalReadingTime: 0,
    });
  }, [id, currentDocument, currentPage]);

  const handleLoad = useCallback((totalPages: number) => {
    setTotalPages(totalPages);
    recordProgress();
  }, [setTotalPages, recordProgress]);

  const handleToggleBookmark = useCallback(async () => {
    if (!id) return;
    const db = await getDb();
    if (isBookmarked) {
      await deleteBookmarkByPage(db, id, currentPage);
      setIsBookmarked(false);
    } else {
      setShowBookmarkModal(true);
    }
  }, [id, isBookmarked, currentPage]);

  const handleTextSelection = useCallback((text: string) => {
    if (text.trim().length > 0) {
      setSelectedText(text.trim());
      setShowHighlightToolbar(true);
    }
  }, []);

  const handleHighlight = useCallback(async (color: string) => {
    if (!id || !selectedText) return;
    const db = await getDb();
    await insertHighlight(db, {
      id: `hl-${Date.now()}`,
      documentId: id,
      page: currentPage,
      color: color as any,
      text: selectedText,
      position: '',
      createdAt: new Date().toISOString(),
    });
    setSelectedText('');
    setShowHighlightToolbar(false);
  }, [id, selectedText, currentPage]);

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: c.background, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: c.textSecondary }}>Loading document...</Text>
      </SafeAreaView>
    );
  }

  if (error || !docPath) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: c.background }}>
        <PdfToolbar title="Error" />
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 }}>
          <Text style={{ color: c.error, fontSize: 16, fontWeight: '600' }}>Error loading document</Text>
          <Text style={{ color: c.textSecondary, marginTop: 8, textAlign: 'center' }}>{error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: c.background }} edges={['top']}>
      <PdfToolbar
        title={docName}
        isBookmarked={isBookmarked}
        onToggleThumbnails={() => actionsRef.current?.toggleThumbnails()}
        onToggleBookmark={handleToggleBookmark}
        onToggleSearch={() => actionsRef.current?.toggleSearch()}
        onHighlight={() => setShowHighlightToolbar(true)}
        onNote={() => setShowNoteModal(true)}
        onShare={() => {}}
      />

      <View style={{ flex: 1, flexDirection: 'row' }}>
        {showThumbnails && (
          <PdfThumbnailSidebar
            pageCount={currentDocument?.pageCount ?? 0}
            currentPage={currentPage}
            onPageSelect={(page) => actionsRef.current?.goToPage(page)}
          />
        )}
        <PdfViewer
          path={docPath}
          actionRef={actionsRef}
          onLoad={handleLoad}
          onError={(e) => setError(e)}
          onTextSelection={handleTextSelection}
          showThumbnails={showThumbnails}
        />
      </View>

      <PdfBottomBar
        currentPage={currentPage}
        totalPages={currentDocument?.pageCount ?? 0}
        zoom={zoom}
        scrollMode={'continuous'}
        onPrevPage={() => actionsRef.current?.goToPage(Math.max(1, currentPage - 1))}
        onNextPage={() => actionsRef.current?.goToPage(currentPage + 1)}
        onZoomIn={() => { actionsRef.current?.zoomIn(); setZoom(Math.min(5, zoom + 0.25)); }}
        onZoomOut={() => { actionsRef.current?.zoomOut(); setZoom(Math.max(0.5, zoom - 0.25)); }}
        onScrollModeChange={() => {}}
      />

      <HighlightToolbar
        visible={showHighlightToolbar}
        selectedText={selectedText}
        onHighlight={handleHighlight}
        onDismiss={() => { setShowHighlightToolbar(false); setSelectedText(''); }}
      />

      {id && (
        <>
          <AddBookmarkModal
            visible={showBookmarkModal}
            documentId={id}
            page={currentPage}
            onClose={() => setShowBookmarkModal(false)}
            onSaved={() => setIsBookmarked(true)}
          />
          <AddNoteModal
            visible={showNoteModal}
            documentId={id}
            page={currentPage}
            onClose={() => setShowNoteModal(false)}
            onSaved={() => {}}
          />
        </>
      )}
    </SafeAreaView>
  );
}

function PdfThumbnailSidebar({ pageCount, currentPage, onPageSelect }: { pageCount: number; currentPage: number; onPageSelect: (page: number) => void }) {
  const c = useTheme();
  return (
    <View style={{ width: 80, backgroundColor: c.surface, borderRightWidth: 1, borderRightColor: c.border }}>
      <Text style={{ color: c.textSecondary, fontSize: 11, textAlign: 'center', padding: 8 }}>Pages</Text>
      <View style={{ padding: 4 }}>
        {Array.from({ length: Math.min(pageCount, 100) }, (_, i) => i + 1).map((page) => (
          <View
            key={page}
            onTouchEnd={() => onPageSelect(page)}
            style={{
              height: 60, marginBottom: 6, borderRadius: 4,
              backgroundColor: page === currentPage ? c.primaryContainer : c.surfaceVariant,
              borderWidth: page === currentPage ? 2 : 1,
              borderColor: page === currentPage ? c.primary : c.border,
              alignItems: 'center', justifyContent: 'center',
            }}
          >
            <Text style={{ fontSize: 10, color: page === currentPage ? c.primary : c.textSecondary }}>{page}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
