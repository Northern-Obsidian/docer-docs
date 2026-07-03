import * as FileSystem from 'expo-file-system';

export interface ArchiveEntry {
  name: string;
  path: string;
  isDirectory: boolean;
  size: number;
}

export async function listArchiveEntries(filePath: string): Promise<ArchiveEntry[]> {
  const base64 = await FileSystem.readAsStringAsync(filePath, { encoding: FileSystem.EncodingType.Base64 });
  const JSZip = (await import('jszip')).default;
  const zip = await JSZip.loadAsync(base64, { base64: true });
  const entries: ArchiveEntry[] = [];
  zip.forEach((relativePath, entry) => {
    entries.push({
      name: relativePath.split('/').pop() || relativePath,
      path: relativePath,
      isDirectory: entry.dir,
      size: entry.dir ? 0 : (entry._data?.uncompressedSize ?? 0),
    });
  });
  entries.sort((a, b) => {
    if (a.isDirectory && !b.isDirectory) return -1;
    if (!a.isDirectory && b.isDirectory) return 1;
    return a.path.localeCompare(b.path);
  });
  return entries;
}

export async function extractEntry(filePath: string, entryPath: string): Promise<string> {
  const base64 = await FileSystem.readAsStringAsync(filePath, { encoding: FileSystem.EncodingType.Base64 });
  const JSZip = (await import('jszip')).default;
  const zip = await JSZip.loadAsync(base64, { base64: true });
  const entry = zip.files[entryPath];
  if (!entry || entry.dir) throw new Error('Not a file');
  const data = await entry.async('base64');
  const ext = entryPath.split('.').pop() || 'bin';
  const tempPath = `${FileSystem.cacheDirectory}archive_${Date.now()}.${ext}`;
  await FileSystem.writeAsStringAsync(tempPath, data, { encoding: FileSystem.EncodingType.Base64 });
  return tempPath;
}
