import { File, Directory, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Alert } from 'react-native';
import { getDb } from '@/db/connection';
import { getDocumentById } from '@/db/documents';
import { getDocumentContent } from '@/db/content-index';
import { getAllBookmarksByDocument } from '@/db/bookmarks';
import { getAllNotesByDocument } from '@/db/notes';

export type ExportFormat = 'txt' | 'json' | 'csv';

export async function exportDocument(id: string, format: ExportFormat): Promise<void> {
  try {
    const db = await getDb();
    const doc = await getDocumentById(db, id);
    if (!doc) { Alert.alert('Error', 'Document not found.'); return; }

    let content: string;
    let fileName: string;

    switch (format) {
      case 'txt':
        content = await exportAsTxt(db, id, doc.name);
        fileName = doc.name.replace(/\.[^.]+$/, '') + '.txt';
        break;
      case 'json':
        content = await exportAsJson(db, id, doc.name);
        fileName = doc.name.replace(/\.[^.]+$/, '') + '.json';
        break;
      case 'csv':
        content = await exportAsCsv(db, id);
        fileName = doc.name.replace(/\.[^.]+$/, '') + '.csv';
        break;
    }

    const exportDir = new Directory(Paths.cache, 'exports');
    await exportDir.create({ intermediates: true });
    const file = new File(exportDir, fileName);
    await file.write(content);

    const canShare = await Sharing.isAvailableAsync();
    if (canShare) {
      await Sharing.shareAsync(file.uri, {
        mimeType: format === 'json' ? 'application/json' : format === 'csv' ? 'text/csv' : 'text/plain',
      });
    } else {
      Alert.alert('Exported', `File saved to ${file.uri}`);
    }
  } catch (err: any) {
    Alert.alert('Export Failed', err.message || 'Failed to export document.');
  }
}

async function exportAsTxt(db: any, id: string, docName: string): Promise<string> {
  const content = await getDocumentContent(db, id);
  const bookmarks = await getAllBookmarksByDocument(db, id);
  const notes = await getAllNotesByDocument(db, id);

  let output = `Title: ${docName}\n`;
  output += `Exported: ${new Date().toLocaleString()}\n`;
  output += `${'='.repeat(50)}\n\n`;

  if (content) {
    output += content + '\n\n';
  }

  if (bookmarks.length > 0) {
    output += `${'='.repeat(50)}\nBOOKMARKS\n${'='.repeat(50)}\n`;
    for (const bm of bookmarks) {
      output += `- Page ${bm.page || '?'}: ${bm.label || bm.chapter || '(no label)'}\n`;
    }
    output += '\n';
  }

  if (notes.length > 0) {
    output += `${'='.repeat(50)}\nNOTES\n${'='.repeat(50)}\n`;
    for (const note of notes) {
      output += `- ${note.content}\n`;
    }
  }

  return output;
}

async function exportAsJson(db: any, id: string, docName: string): Promise<string> {
  const content = await getDocumentContent(db, id);
  const bookmarks = await getAllBookmarksByDocument(db, id);
  const notes = await getAllNotesByDocument(db, id);

  const data = {
    documentName: docName,
    exportedAt: new Date().toISOString(),
    content: content || '',
    bookmarks: bookmarks.map((b: any) => ({
      page: b.page,
      chapter: b.chapter,
      label: b.label,
    })),
    notes: notes.map((n: any) => ({
      page: n.page,
      content: n.content,
      createdAt: n.createdAt,
    })),
  };

  return JSON.stringify(data, null, 2);
}

async function exportAsCsv(db: any, id: string): Promise<string> {
  const bookmarks = await getAllBookmarksByDocument(db, id);
  const notes = await getAllNotesByDocument(db, id);

  let csv = '';

  if (bookmarks.length > 0) {
    csv += 'Type,Page,Chapter,Label,Created\n';
    for (const bm of bookmarks) {
      csv += `Bookmark,${bm.page || ''},${bm.chapter || ''},${(bm.label || '').replace(/,/g, ';')},${bm.createdAt || ''}\n`;
    }
  }

  if (notes.length > 0) {
    csv += 'Type,Page,Content,Created\n';
    for (const note of notes) {
      csv += `Note,${note.page || ''},${(note.content || '').replace(/,/g, ';')},${note.createdAt || ''}\n`;
    }
  }

  return csv || 'No data';
}
