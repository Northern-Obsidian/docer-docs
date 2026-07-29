import {
  getDocuments, requestPermissions, checkPermissions,
  getStatistics, getRecent, getDuplicates, getFolderStatistics,
  getLargestFiles, search, refresh,
  useMediaChangeEvent,
  SortField, SortOrder,
  type DocumentItem, type AudioItem, type VideoItem, type ImageItem,
  type SortOptions, type FilterOptions,
  type PaginationOptions, type MediaStoreStatistics,
  type DuplicateItem, type FolderStatistics,
  type SearchResult, type SearchOptions,
  type MediaChangeEvent, type LibraryResult,
} from '@obsidian_north/react-native-mediastore';
import { importFile } from '@/services/import-service';
import { getDb } from '@/db/connection';
import { getDocumentByPath } from '@/db/documents';
import type { Document } from '@/types';

export { requestPermissions, useMediaChangeEvent, SortField, SortOrder };

export type {
  DocumentItem, AudioItem, VideoItem, ImageItem,
  SortOptions, FilterOptions, PaginationOptions,
  MediaStoreStatistics, DuplicateItem, FolderStatistics,
  SearchResult, SearchOptions, MediaChangeEvent, LibraryResult,
};

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
  pagination?: PaginationOptions
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

export async function fetchDeviceStatistics(): Promise<MediaStoreStatistics | null> {
  const granted = await ensurePermissions();
  if (!granted) return null;
  try {
    return await getStatistics();
  } catch {
    return null;
  }
}

export async function fetchDeviceRecent(
  mediaType?: 'audio' | 'video' | 'image' | 'document',
  limit?: number
): Promise<(AudioItem | VideoItem | ImageItem | DocumentItem)[]> {
  const granted = await ensurePermissions();
  if (!granted) return [];
  try {
    return await getRecent(mediaType, limit);
  } catch {
    return [];
  }
}

export async function fetchDeviceDuplicates(
  mediaType?: 'audio' | 'video' | 'image' | 'document'
): Promise<DuplicateItem[]> {
  const granted = await ensurePermissions();
  if (!granted) return [];
  try {
    return await getDuplicates(mediaType);
  } catch {
    return [];
  }
}

export async function fetchFolderStatistics(folderPath?: string): Promise<FolderStatistics[]> {
  const granted = await ensurePermissions();
  if (!granted) return [];
  try {
    return await getFolderStatistics(folderPath);
  } catch {
    return [];
  }
}

export async function fetchLargestFiles(
  mediaType?: 'audio' | 'video' | 'image' | 'document',
  limit?: number
): Promise<(AudioItem | VideoItem | ImageItem | DocumentItem)[]> {
  const granted = await ensurePermissions();
  if (!granted) return [];
  try {
    return await getLargestFiles(mediaType, limit);
  } catch {
    return [];
  }
}

export async function searchDevice(options: SearchOptions): Promise<SearchResult> {
  const granted = await ensurePermissions();
  if (!granted) {
    return { audio: [], videos: [], images: [], documents: [], totalCount: 0, query: options.query };
  }
  return search(options);
}

export async function refreshDeviceCache(): Promise<void> {
  refresh();
}
