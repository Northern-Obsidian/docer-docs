import { getDocuments, requestPermissions, checkPermissions, SortField, SortOrder, type DocumentItem, type SortOptions } from '@obsidian_north/react-native-mediastore';
import { importFile } from '@/services/import-service';
import { getDb } from '@/db/connection';
import { getDocumentByPath } from '@/db/documents';
import type { Document } from '@/types';

export interface MediaStoreDocument extends DocumentItem {
  imported: boolean;
}

async function ensurePermissions(): Promise<boolean> {
  const status = await checkPermissions();
  if (status.granted) return true;
  const result = await requestPermissions();
  return result.granted;
}

export async function fetchDeviceDocuments(
  sort: SortOptions = { field: SortField.DateAdded, order: SortOrder.Descending },
  pagination?: { limit?: number; offset?: number }
): Promise<MediaStoreDocument[]> {
  const granted = await ensurePermissions();
  if (!granted) return [];

  const items = await getDocuments(sort, undefined, pagination);
  const db = await getDb();

  return Promise.all(
    items.map(async (item) => {
      const existing = await getDocumentByPath(db, item.uri);
      return { ...item, imported: !!existing };
    })
  );
}

export async function importDeviceDocument(item: DocumentItem): Promise<Document | null> {
  const db = await getDb();
  const existing = await getDocumentByPath(db, item.uri);
  if (existing) return existing;

  return importFile(item.uri, item.name, item.mimeType || null);
}

export async function importMultipleDeviceDocuments(items: DocumentItem[]): Promise<number> {
  let imported = 0;
  for (const item of items) {
    const doc = await importDeviceDocument(item);
    if (doc) imported++;
  }
  return imported;
}

export async function scanDeviceDocuments(): Promise<number> {
  const granted = await ensurePermissions();
  if (!granted) return 0;

  const items = await getDocuments({ field: SortField.DateAdded, order: SortOrder.Descending });
  const db = await getDb();

  let imported = 0;
  for (const item of items) {
    const existing = await getDocumentByPath(db, item.uri);
    if (!existing) {
      const doc = await importFile(item.uri, item.name, item.mimeType || null);
      if (doc) imported++;
    }
  }
  return imported;
}

export async function hasMediaStorePermissions(): Promise<boolean> {
  const status = await checkPermissions();
  return status.granted;
}
