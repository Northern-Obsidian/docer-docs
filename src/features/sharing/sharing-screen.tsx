import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { Share2, Wifi } from 'lucide-react-native';
import { useTheme } from '@/hooks/use-theme';
import * as Sharing from 'expo-sharing';

export function SharingScreen() {
  const c = useTheme();

  const handleShare = async () => {
    const available = await Sharing.isAvailableAsync();
    if (available) {
      Alert.alert('Share', 'Select a document to share from your library.');
    } else {
      Alert.alert('Not Available', 'Sharing is not available on this device.');
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: c.background, alignItems: 'center', justifyContent: 'center', padding: 32 }}>
      <Share2 size={48} color={c.textTertiary} />
      <Text style={{ fontSize: 17, fontWeight: '600', color: c.text, marginTop: 16 }}>Share Documents</Text>
      <Text style={{ fontSize: 14, color: c.textSecondary, textAlign: 'center', marginTop: 8, lineHeight: 20 }}>
        Share documents with other apps or nearby devices.
      </Text>
      <TouchableOpacity
        onPress={handleShare}
        style={{ marginTop: 24, backgroundColor: c.primary, borderRadius: 12, paddingHorizontal: 32, paddingVertical: 14 }}
      >
        <Text style={{ color: '#FFF', fontWeight: '600' }}>Share a Document</Text>
      </TouchableOpacity>
    </View>
  );
}
