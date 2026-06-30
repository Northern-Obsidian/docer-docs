import { View, Text, Platform } from 'react-native';

export function WebBadge() {
  if (Platform.OS !== 'web') return null;
  return (
    <View style={{ padding: 8 }}>
      <Text style={{ color: '#666', fontSize: 12, textAlign: 'center' }}>
        web only
      </Text>
    </View>
  );
}
