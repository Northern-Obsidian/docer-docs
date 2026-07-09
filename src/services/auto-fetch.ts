import { File, Directory, Paths } from 'expo-file-system';
import { importFile, EXTENSION_TYPE_MAP } from '@/services/import-service';
import { storage } from '@/storage';

const SCAN_COMPLETE_KEY = 'auto_scan_complete';
const SUPPORTED_EXTENSIONS = new Set(Object.keys(EXTENSION_TYPE_MAP));

function isSupportedFile(file: File): boolean {
  const ext = file.extension.toLowerCase().replace('.', '');
  return SUPPORTED_EXTENSIONS.has(ext);
}

export async function scanDirectory(directory: Directory): Promise<number> {
  let imported = 0;
  try {
    const entries = directory.list();
    for (const entry of entries) {
      if (entry instanceof File) {
        if (isSupportedFile(entry)) {
          const doc = await importFile(entry.uri, entry.name, null);
          if (doc) imported++;
        }
      } else if (entry instanceof Directory) {
        if (!entry.name.startsWith('.')) {
          imported += await scanDirectory(entry);
        }
      }
    }
  } catch {
    // skip inaccessible directories
  }
  return imported;
}

export async function scanDocumentDirectory(): Promise<number> {
  return scanDirectory(Paths.document);
}

export async function scanWithPicker(): Promise<number> {
  try {
    const directory = await Directory.pickDirectoryAsync();
    if (directory) {
      return scanDirectory(directory);
    }
  } catch {}
  return 0;
}

export async function autoFetchOnLaunch(): Promise<number> {
  const alreadyScanned = storage.getBoolean(SCAN_COMPLETE_KEY) ?? false;
  if (!alreadyScanned) {
    const count = await scanDocumentDirectory();
    storage.set(SCAN_COMPLETE_KEY, true);
    return count;
  }
  return 0;
}

export function hasScannedOnLaunch(): boolean {
  return storage.getBoolean(SCAN_COMPLETE_KEY) ?? false;
}
