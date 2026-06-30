import JSZip from 'jszip';
import { DOMParser } from '@xmldom/xmldom';
import { File } from 'expo-file-system';

export interface EpubChapter {
  index: number;
  title: string;
  content: string;
  href: string;
}

export interface EpubMetadata {
  title: string;
  creator: string | null;
  language: string | null;
}

export interface EpubData {
  metadata: EpubMetadata;
  chapters: EpubChapter[];
  coverPath: string | null;
}

export async function parseEpub(path: string): Promise<EpubData> {
  const file = new File(path);
  const buffer = await file.arrayBuffer();
  const zip = await JSZip.loadAsync(buffer);

  const containerXml = await zip.file('META-INF/container.xml')?.async('string');
  if (!containerXml) throw new Error('Invalid EPUB: missing META-INF/container.xml');

  const container = parseXml(containerXml);
  const rootfile = findChild(container.documentElement, 'rootfile');
  const opfPath = rootfile ? rootfile.getAttribute('full-path') : null;
  if (!opfPath) throw new Error('Invalid EPUB: missing rootfile in container.xml');

  const opfDir = opfPath.includes('/') ? opfPath.split('/').slice(0, -1).join('/') : '';
  const opfContent = await zip.file(opfPath)?.async('string');
  if (!opfContent) throw new Error('Invalid EPUB: missing OPF file');

  const opf = parseXml(opfContent);
  const metadata = findChild(opf.documentElement, 'metadata');
  const title = text(metadata ? findChild(metadata, 'title') : null) || 'Untitled';
  const creator = text(metadata ? findChild(metadata, 'creator') : null) || null;
  const language = text(metadata ? findChild(metadata, 'language') : null) || null;

  const manifestEl = findChild(opf.documentElement, 'manifest');
  const items = manifestEl ? getChildren(manifestEl, 'item') : [];
  const manifest: Record<string, any> = {};
  for (const item of items) {
    manifest[item.getAttribute('id') || ''] = {
      id: item.getAttribute('id') || '',
      href: item.getAttribute('href') || '',
      mediaType: item.getAttribute('media-type') || '',
    };
  }

  let coverPath: string | null = null;
  const metaEls = metadata ? getChildren(metadata, 'meta') : [];
  for (const meta of metaEls) {
    if (meta.getAttribute('name') === 'cover') {
      const coverId = meta.getAttribute('content');
      if (coverId && manifest[coverId]) {
        coverPath = opfDir ? `${opfDir}/${manifest[coverId].href}` : manifest[coverId].href;
      }
    }
  }
  if (!coverPath) {
    const coverItem = Object.values(manifest).find((i: any) =>
      i.href.toLowerCase().includes('cover') && i.mediaType.startsWith('image/')
    );
    if (coverItem) coverPath = opfDir ? `${opfDir}/${coverItem.href}` : coverItem.href;
  }

  const spineEl = findChild(opf.documentElement, 'spine');
  const spineItems = spineEl ? getChildren(spineEl, 'itemref') : [];

  const chapters: EpubChapter[] = [];
  let index = 0;

  for (const ref of spineItems) {
    const idref = ref.getAttribute('idref');
    if (!idref || !manifest[idref]) continue;

    const item = manifest[idref];
    const itemPath = opfDir ? `${opfDir}/${item.href}` : item.href;

    if (!item.mediaType.includes('html') && !item.mediaType.includes('xhtml')) continue;

    const content = await zip.file(itemPath)?.async('string');
    if (!content) continue;

    const contentDoc = parseXml(content);
    const titleEls = contentDoc.getElementsByTagName('title');
    const chapterTitle = titleEls.length > 0 ? text(titleEls[0]) : `Chapter ${index + 1}`;
    const bodies = contentDoc.getElementsByTagName('body');
    const bodyContent = bodies.length > 0 ? serializeBody(bodies[0]) : content;

    chapters.push({ index, title: chapterTitle, content: bodyContent, href: itemPath });
    index++;
  }

  if (chapters.length === 0) {
    throw new Error('No readable content found in EPUB');
  }

  return { metadata: { title, creator, language }, chapters, coverPath };
}

function parseXml(xml: string): any {
  return new DOMParser().parseFromString(xml, 'text/xml');
}

function findChild(parent: any, tag: string): any {
  const kids = parent.getElementsByTagName(tag);
  return kids.length > 0 ? kids[0] : null;
}

function getChildren(parent: any, tag: string): any[] {
  return Array.from(parent.getElementsByTagName(tag));
}

function text(el: any): string {
  return el?.textContent?.trim() ?? '';
}

function serializeBody(body: any): string {
  let html = '';
  const nodes = body.childNodes as any[];
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    if (node.nodeType === 1) {
      html += node.toString();
    } else if (node.nodeType === 3) {
      html += node.textContent ?? '';
    }
  }
  return html;
}

export function getEpubHtml(content: string, theme: { bg: string; text: string }, fontSize: number, lineSpacing: number): string {
  return [
    '<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0">',
    `<style>*{margin:0;padding:0;box-sizing:border-box}`,
    `body{font-family:Georgia,serif;font-size:${fontSize}px;line-height:${lineSpacing};color:${theme.text};background:${theme.bg};padding:24px;max-width:700px;margin:0 auto}`,
    `h1{font-size:${fontSize*1.5}px;margin:24px 0 12px;font-weight:700}`,
    `h2{font-size:${fontSize*1.3}px;margin:20px 0 10px;font-weight:600}`,
    `h3{font-size:${fontSize*1.15}px;margin:16px 0 8px;font-weight:600}`,
    `p{margin:12px 0}img{max-width:100%;height:auto}a{color:${theme.text}}`,
    `</style></head><body>${content}</body></html>`,
  ].join('');
}
