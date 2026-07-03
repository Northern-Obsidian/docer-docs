import { File, Directory, Paths } from 'expo-file-system';
import { getDb } from '@/db/connection';
import { getDocumentById, updateDocument } from '@/db/documents';
import type { DocumentType } from '@/types';

let thumbnailDir: Directory | null = null;

async function getThumbnailDir(): Promise<Directory> {
  if (!thumbnailDir) {
    thumbnailDir = new Directory(Paths.cache, 'thumbnails');
    await thumbnailDir.create({ intermediates: true });
  }
  return thumbnailDir;
}

export async function generateThumbnail(documentId: string): Promise<string | null> {
  try {
    const db = await getDb();
    const doc = await getDocumentById(db, documentId);
    if (!doc) return null;

    const dir = await getThumbnailDir();
    const thumbFile = new File(dir, `${documentId}.jpg`);

    // For images, copy as thumbnail
    if (doc.type === 'image') {
      const src = new File(doc.path);
      await src.copy(thumbFile);
      await updateDocument(db, documentId, { thumbnailPath: thumbFile.uri });
      return thumbFile.uri;
    }

    // For other types, generate a placeholder
    const placeholderPath = await generatePlaceholderThumbnail(doc.name, doc.type, thumbFile);
    if (placeholderPath) {
      await updateDocument(db, documentId, { thumbnailPath: placeholderPath });
    }
    return placeholderPath;
  } catch {
    return null;
  }
}

async function generatePlaceholderThumbnail(name: string, type: DocumentType, outputFile: File): Promise<string | null> {
  const ext = name.split('.').pop()?.toLowerCase() || '';

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="280" viewBox="0 0 200 280">
    <rect width="200" height="280" rx="8" fill="#f0f0f0" stroke="#ddd" stroke-width="1"/>
    <text x="100" y="140" text-anchor="middle" font-family="sans-serif" font-size="48" fill="#ccc">${ext}</text>
  </svg>`;

  await outputFile.write(svg);
  return outputFile.uri;
}

export async function getThumbnailPath(documentId: string): Promise<string | null> {
  const db = await getDb();
  const doc = await getDocumentById(db, documentId);
  if (doc?.thumbnailPath) {
    const f = new File(doc.thumbnailPath);
    if (await f.exists) return doc.thumbnailPath;
  }
  return null;
}

export async function generateAllThumbnails(): Promise<void> {
  const db = await getDb();
  const docs = await db.getAllAsync<{ id: string }>(
    'SELECT id FROM documents WHERE thumbnail_path IS NULL'
  );
  for (const doc of docs) {
    await generateThumbnail(doc.id);
  }
}

export async function deleteThumbnail(documentId: string): Promise<void> {
  const db = await getDb();
  const doc = await getDocumentById(db, documentId);
  if (doc?.thumbnailPath) {
    const f = new File(doc.thumbnailPath);
    if (await f.exists) await f.delete();
    await updateDocument(db, documentId, { thumbnailPath: null });
  }
}
