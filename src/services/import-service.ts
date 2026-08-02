import * as DocumentPicker from 'expo-document-picker';
import { File, Paths } from 'expo-file-system';
import { getDb } from '@/db/connection';
import { insertDocument, getDocumentByPath, updateDocument } from '@/db/documents';
import { indexDocumentContent } from '@/db/content-index';
import type { Document, DocumentType } from '@/types';

export const EXTENSION_TYPE_MAP: Record<string, DocumentType> = {
  pdf: 'pdf', epub: 'epub', mobi: 'epub',
  doc: 'doc', docx: 'docx', xls: 'xls', xlsx: 'xlsx',
  ppt: 'ppt', pptx: 'pptx', rtf: 'rtf',
  txt: 'txt', md: 'md', csv: 'csv',
  png: 'image', jpg: 'image', jpeg: 'image', gif: 'image',
  webp: 'image', bmp: 'image', svg: 'image',
  zip: 'archive', rar: 'archive', '7z': 'archive', tar: 'archive',
  cbz: 'archive', cbr: 'archive',
  json: 'code', xml: 'code', html: 'code', css: 'code',
  js: 'code', ts: 'code', jsx: 'code', tsx: 'code',
  java: 'code', c: 'code', cpp: 'code', py: 'code',
  php: 'code', sql: 'code', yaml: 'code', yml: 'code',
};

function getDocumentType(fileName: string): DocumentType {
  const ext = fileName.split('.').pop()?.toLowerCase() || '';
  return EXTENSION_TYPE_MAP[ext] || 'unknown';
}

function isContentUri(uri: string): boolean {
  return uri.startsWith('content://');
}

function getLocalStorageName(uri: string, fileName: string): string {
  const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
  let hash = 0;
  for (let i = 0; i < uri.length; i++) {
    hash = ((hash << 5) - hash) + uri.charCodeAt(i);
    hash = hash & hash;
  }
  return `${Math.abs(hash).toString(36)}_${safeName}`;
}

async function copyContentUriToLocal(uri: string, fileName: string): Promise<string | null> {
  try {
    const source = new File(uri);
    const info = await source.info();
    if (!info.exists) return null;

    const localName = getLocalStorageName(uri, fileName);
    const localFile = new File(Paths.document, localName);
    const buffer = await source.arrayBuffer();
    await localFile.write(new Uint8Array(buffer));
    return localFile.uri;
  } catch {
    return null;
  }
}

export async function pickAndImportDocument(): Promise<Document | null> {
  const result = await DocumentPicker.getDocumentAsync({
    type: '*/*',
    copyToCacheDirectory: true,
  });

  if (result.canceled) return null;

  const asset = result.assets[0];
  return importFile(asset.uri, asset.name || 'untitled', asset.mimeType || null);
}

export async function importFile(uri: string, fileName: string, mimeType: string | null): Promise<Document | null> {
  try {
    const db = await getDb();

    const existing = await getDocumentByPath(db, uri);
    if (existing) {
      if (isContentUri(existing.path)) {
        const localPath = await copyContentUriToLocal(existing.path, existing.name);
        if (localPath) {
          await updateDocument(db, existing.id, { path: localPath });
          existing.path = localPath;
        }
      }
      return existing;
    }

    const file = new File(uri);
    const info = await file.info();
    if (!info.exists) return null;

    const type = getDocumentType(fileName);
    const id = `doc-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const now = new Date().toISOString();

    let localPath = uri;
    if (isContentUri(uri)) {
      const copied = await copyContentUriToLocal(uri, fileName);
      if (copied) {
        const existingLocal = await getDocumentByPath(db, copied);
        if (existingLocal) return existingLocal;
        localPath = copied;
      }
    }

    const doc: Document = {
      id,
      name: fileName,
      path: localPath,
      type,
      mimeType,
      size: info.size || 0,
      pageCount: type === 'pdf' ? 1 : null,
      author: null,
      createdAt: now,
      modifiedAt: now,
      addedAt: now,
      metadata: null,
      thumbnailPath: null,
      isHidden: false,
    };

    await insertDocument(db, doc);

    indexDocumentContent(db, id, localPath, type).catch(() => {});

    return doc;
  } catch {
    return null;
  }
}
