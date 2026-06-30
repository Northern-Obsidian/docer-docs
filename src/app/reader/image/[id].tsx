import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { router } from 'expo-router';
import { ArrowLeft, ZoomIn, ZoomOut, RotateCw, Share2 } from 'lucide-react-native';
import { Image } from 'expo-image';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

import { useTheme } from '@/hooks/use-theme';
import { loadDocumentUri } from '@/services/reader-loader';
import { shareDocument } from '@/services/file-operations';

export default function ImageViewerScreen() {
  const c = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const [uri, setUri] = useState<string | null>(null);
  const [fileName, setFileName] = useState('Image');
  const [loading, setLoading] = useState(true);
  const [rotation, setRotation] = useState(0);
  const scale = useSharedValue(1);
  const [zoom, setZoom] = useState(1);

  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }, { rotate: `${rotation}deg` }] }));

  useEffect(() => {
    if (!id) return;
    (async () => {
      const { doc, uri: fileUri } = await loadDocumentUri(id);
      if (doc) { setFileName(doc.name); setUri(fileUri); }
      setLoading(false);
    })();
  }, [id]);

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#000', alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="#FFF" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }} edges={['top']}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, paddingVertical: 10 }}>
        <TouchableOpacity onPress={() => router.back()}><ArrowLeft size={24} color="#FFF" /></TouchableOpacity>
        <Text style={{ flex: 1, fontSize: 15, fontWeight: '600', color: '#FFF', textAlign: 'center' }} numberOfLines={1}>{fileName}</Text>
        <TouchableOpacity onPress={() => id && shareDocument(id)}><Share2 size={20} color="#FFF" /></TouchableOpacity>
      </View>

      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        {uri ? (
          <Animated.View style={animatedStyle}>
            <Image source={{ uri }} style={{ width: screenWidth - 32, height: screenHeight * 0.6 }} contentFit="contain" />
          </Animated.View>
        ) : (
          <Text style={{ color: '#888' }}>Could not load image</Text>
        )}
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 32, paddingVertical: 20 }}>
        <TouchableOpacity onPress={() => { scale.value = withTiming(Math.max(0.25, scale.value - 0.25)); setZoom(Math.max(0.25, zoom - 0.25)); }}>
          <ZoomOut size={28} color="#FFF" />
        </TouchableOpacity>
        <Text style={{ color: '#FFF', fontSize: 14 }}>{Math.round(zoom * 100)}%</Text>
        <TouchableOpacity onPress={() => { scale.value = withTiming(Math.min(10, scale.value + 0.25)); setZoom(Math.min(10, zoom + 0.25)); }}>
          <ZoomIn size={28} color="#FFF" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setRotation((r) => (r + 90) % 360)}>
          <RotateCw size={24} color="#FFF" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
