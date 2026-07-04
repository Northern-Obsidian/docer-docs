import { View, Text, Animated } from 'react-native';
import { useEffect, useState } from 'react';
import { WifiOff } from 'lucide-react-native';
import { useNetInfo } from '@/hooks/use-net-info';
import { useTheme } from '@/hooks/use-theme';

export function OfflineBanner() {
  const c = useTheme();
  const { isOffline } = useNetInfo();
  const [opacity] = useState(() => new Animated.Value(0));

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: isOffline ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isOffline]);

  if (!isOffline) return null;

  return (
    <Animated.View
      style={{
        opacity,
        backgroundColor: '#FF6B6B',
        paddingHorizontal: 16,
        paddingVertical: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
      }}
      accessible
      accessibilityRole="alert"
      accessibilityLabel="You are offline"
    >
      <WifiOff size={16} color="#FFF" />
      <Text style={{ color: '#FFF', fontSize: 13, fontWeight: '600' }}>{'You\'re offline'}</Text>
    </Animated.View>
  );
}
