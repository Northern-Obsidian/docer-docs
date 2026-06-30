import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { router } from 'expo-router';
import { ArrowLeft, Search, ZoomIn, ZoomOut, FileSpreadsheet, FileText, Presentation } from 'lucide-react-native';
import { WebView } from 'react-native-webview';

import { useTheme } from '@/hooks/use-theme';
import { useDocumentStore } from '@/stores/document-store';
import { getDb } from '@/db/connection';
import { getDocumentById } from '@/db/documents';

const OFFICE_CONTENT = {
  word: '<html><body style="font-family:Georgia,serif;padding:24px;max-width:700px;margin:0 auto"><h1>Document Title</h1><p>This is a Word document rendered in Docer. It supports <b>bold</b>, <i>italic</i>, and various formatting.</p><h2>Section 1</h2><p>Content with proper styling preserved.</p><table border="1" style="border-collapse:collapse;width:100%"><tr><th>Name</th><th>Value</th></tr><tr><td>Item A</td><td>100</td></tr><tr><td>Item B</td><td>200</td></tr></table></body></html>',
  excel: '<html><body style="font-family:monospace;padding:16px"><table border="1" style="border-collapse:collapse;width:100%"><tr style="background:#f0f0f0"><th>A</th><th>B</th><th>C</th></tr><tr><td>1</td><td>Product</td><td>Price</td></tr><tr><td>2</td><td>Widget</td><td>$19.99</td></tr><tr><td>3</td><td>Gadget</td><td>$29.99</td></tr><tr><td>4</td><td>Doohickey</td><td>$14.99</td></tr></table></body></html>',
  ppt: '<html><body style="font-family:sans-serif;padding:24px;background:#f8f8f8"><div style="background:white;border-radius:12px;padding:32px;box-shadow:0 2px 8px rgba(0,0,0,0.1);min-height:400px;display:flex;flex-direction:column;justify-content:center;align-items:center"><h1 style="font-size:36px;margin-bottom:16px">Slide Title</h1><p style="font-size:20px;color:#666">Slide content goes here</p><p style="font-size:14px;color:#999;margin-top:32px">Slide 1 of 5</p></div></body></html>',
};

export default function OfficeReaderScreen() {
  const c = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [docName, setDocName] = useState('Office Document');
  const [officeType, setOfficeType] = useState<'word' | 'excel' | 'ppt'>('word');
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    if (id) {
      getDb().then(async (db) => {
        const doc = await getDocumentById(db, id);
        if (doc) {
          setDocName(doc.name);
          const ext = doc.name.split('.').pop()?.toLowerCase() || '';
          if (['xls', 'xlsx', 'csv'].includes(ext)) setOfficeType('excel');
          else if (['ppt', 'pptx'].includes(ext)) setOfficeType('ppt');
          else setOfficeType('word');
        }
      });
    }
  }, [id]);

  const Icon = officeType === 'word' ? FileText : officeType === 'excel' ? FileSpreadsheet : Presentation;

  const html = OFFICE_CONTENT[officeType];
  const styledHtml = html.replace('<body', `<body style="transform:scale(${zoom});transform-origin:top left"`);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: c.background }} edges={['top']}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, paddingVertical: 10, backgroundColor: c.surface, borderBottomWidth: 1, borderBottomColor: c.border }}>
        <TouchableOpacity onPress={() => router.back()}><ArrowLeft size={24} color={c.text} /></TouchableOpacity>
        <Text style={{ flex: 1, fontSize: 15, fontWeight: '600', color: c.text, textAlign: 'center' }} numberOfLines={1}>{docName}</Text>
        <View style={{ flexDirection: 'row', gap: 4 }}>
          <TouchableOpacity style={{ padding: 6 }}><Search size={20} color={c.textSecondary} /></TouchableOpacity>
        </View>
      </View>

      <WebView
        source={{ html: styledHtml }}
        style={{ flex: 1, backgroundColor: 'transparent' }}
        javaScriptEnabled={false}
        startInLoadingState
      />

      <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 24, paddingVertical: 12, backgroundColor: c.surface, borderTopWidth: 1, borderTopColor: c.border }}>
        <Icon size={22} color={c.primary} />
        <TouchableOpacity onPress={() => setZoom(Math.max(0.5, zoom - 0.25))}><ZoomOut size={22} color={c.text} /></TouchableOpacity>
        <Text style={{ color: c.text, fontSize: 14 }}>{Math.round(zoom * 100)}%</Text>
        <TouchableOpacity onPress={() => setZoom(Math.min(3, zoom + 0.25))}><ZoomIn size={22} color={c.text} /></TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
