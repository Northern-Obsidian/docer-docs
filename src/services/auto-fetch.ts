import { File, Directory, Paths } from 'expo-file-system';
import { Platform } from 'react-native';
import { importFile, EXTENSION_TYPE_MAP } from '@/services/import-service';
import { scanDeviceDocuments } from '@/services/mediastore-service';

const SUPPORTED_EXTENSIONS = new Set(
  Object.entries(EXTENSION_TYPE_MAP)
    .filter(([, type]) => type !== 'image')
    .map(([ext]) => ext)
);

function isSupportedFile(file: File): boolean {
  const ext = file.extension.toLowerCase().replace('.', '');
  return SUPPORTED_EXTENSIONS.has(ext);
}

async function scanDirectory(directory: Directory): Promise<number> {
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

function getRootDirectory(): Directory {
  if (Platform.OS === 'android') {
    try {
      return new Directory('file:///storage/emulated/0/');
    } catch {
      return Paths.document;
    }
  }
  return Paths.document;
}

async function scanRootDirectory(): Promise<number> {
  return scanDirectory(getRootDirectory());
}

export async function autoFetchOnLaunch(): Promise<number> {
  const mediaStoreCount = await scanDeviceDocuments();
  const rootCount = await scanRootDirectory();
  return mediaStoreCount + rootCount;
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
