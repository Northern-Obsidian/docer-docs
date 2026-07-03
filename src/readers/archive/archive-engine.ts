import { File, Directory, Paths } from 'expo-file-system';

export interface ArchiveEntry {
  name: string;
  path: string;
  isDirectory: boolean;
  size: number;
}

export type ArchiveFormat = 'zip' | 'rar' | '7z' | 'tar' | 'cbr' | 'cbz' | 'unknown';

export function detectArchiveFormat(filePath: string): ArchiveFormat {
  const ext = filePath.split('.').pop()?.toLowerCase() || '';
  switch (ext) {
    case 'zip': return 'zip';
    case 'cbz': return 'cbz';
    case 'rar': return 'rar';
    case 'cbr': return 'cbr';
    case '7z': return '7z';
    case 'tar': return 'tar';
    default: return 'unknown';
  }
}

function parseTarHeader(view: DataView, offset: number): { name: string; size: number; type: string } | null {
  const decoder = new TextDecoder();
  const name = decoder.decode(new Uint8Array(view.buffer, offset, 100)).replace(/\0/g, '').trim();
  if (!name) return null;
  const sizeStr = decoder.decode(new Uint8Array(view.buffer, offset + 124, 12)).replace(/\0/g, '').trim();
  const size = parseInt(sizeStr, 8);
  if (isNaN(size)) return null;
  const type = String.fromCharCode(view.getUint8(offset + 156));
  return { name, size, type };
}

async function getTempDir(): Promise<Directory> {
  const dir = new Directory(Paths.cache, 'archive-temp');
  await dir.create({ intermediates: true });
  return dir;
}

export async function listArchiveEntries(filePath: string): Promise<ArchiveEntry[]> {
  const format = detectArchiveFormat(filePath);

  if (format === 'zip' || format === 'cbz') {
    return listZipEntries(filePath);
  }

  if (format === 'tar') {
    return listTarEntries(filePath);
  }

  throw new Error(
    `${format.toUpperCase()} archives are not yet supported natively. ` +
    `Please convert to ZIP or CBZ format. Support for ${format.toUpperCase()} will be added in a future update.`
  );
}

async function listZipEntries(filePath: string): Promise<ArchiveEntry[]> {
  const file = new File(filePath);
  const buffer = await file.arrayBuffer();
  const JSZip = (await import('jszip')).default;
  const zip = await JSZip.loadAsync(buffer);
  const entries: ArchiveEntry[] = [];
  zip.forEach((relativePath, entry) => {
    entries.push({
      name: relativePath.split('/').pop() || relativePath,
      path: relativePath,
      isDirectory: entry.dir,
      size: entry.dir ? 0 : ((entry as any).uncompressedSize ?? 0),
    });
  });
  entries.sort((a, b) => {
    if (a.isDirectory && !b.isDirectory) return -1;
    if (!a.isDirectory && b.isDirectory) return 1;
    return a.path.localeCompare(b.path);
  });
  return entries;
}

async function listTarEntries(filePath: string): Promise<ArchiveEntry[]> {
  const file = new File(filePath);
  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const entries: ArchiveEntry[] = [];
  let offset = 0;

  while (offset + 512 <= bytes.length) {
    const header = parseTarHeader(view, offset);
    if (!header) break;

    entries.push({
      name: header.name.split('/').pop() || header.name,
      path: header.name,
      isDirectory: header.type === '5',
      size: header.size,
    });

    const blockSize = Math.ceil(header.size / 512) * 512;
    offset += 512 + blockSize;
    if (offset >= bytes.length) break;
  }

  entries.sort((a, b) => {
    if (a.isDirectory && !b.isDirectory) return -1;
    if (!a.isDirectory && b.isDirectory) return 1;
    return a.path.localeCompare(b.path);
  });
  return entries;
}

export async function extractEntry(filePath: string, entryPath: string): Promise<string> {
  const format = detectArchiveFormat(filePath);

  if (format === 'zip' || format === 'cbz') {
    return extractZipEntry(filePath, entryPath);
  }

  if (format === 'tar') {
    return extractTarEntry(filePath, entryPath);
  }

  throw new Error(`Extraction not supported for ${format} archives`);
}

async function extractZipEntry(filePath: string, entryPath: string): Promise<string> {
  const file = new File(filePath);
  const buffer = await file.arrayBuffer();
  const JSZip = (await import('jszip')).default;
  const zip = await JSZip.loadAsync(buffer);
  const entry = zip.files[entryPath];
  if (!entry || entry.dir) throw new Error('Not a file');
  const data = await entry.async('uint8array');
  const ext = entryPath.split('.').pop() || 'bin';
  const tempDir = await getTempDir();
  const tempFile = new File(tempDir, `archive_${Date.now()}.${ext}`);
  await tempFile.write(data);
  return tempFile.uri;
}

async function extractTarEntry(filePath: string, entryPath: string): Promise<string> {
  const file = new File(filePath);
  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  let offset = 0;

  while (offset + 512 <= bytes.length) {
    const header = parseTarHeader(view, offset);
    if (!header) break;
    if (header.name === entryPath && header.type !== '5') {
      const contentBytes = new Uint8Array(bytes.buffer, offset + 512, header.size);
      const ext = entryPath.split('.').pop() || 'bin';
      const tempDir = await getTempDir();
      const tempFile = new File(tempDir, `archive_${Date.now()}.${ext}`);
      await tempFile.write(contentBytes);
      return tempFile.uri;
    }
    const blockSize = Math.ceil(header.size / 512) * 512;
    offset += 512 + blockSize;
    if (offset >= bytes.length) break;
  }

  throw new Error('File not found in archive');
}
