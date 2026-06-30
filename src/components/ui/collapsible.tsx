import { View, Text, TouchableOpacity } from 'react-native';
import type { ReactNode } from 'react';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { useTheme } from '@/hooks/use-theme';

export function Collapsible({ title, children }: { title: string; children: ReactNode }) {
  const c = useTheme();
  const open = useSharedValue(false);
  const animatedStyle = useAnimatedStyle(() => ({
    height: withTiming(open.value ? 400 : 0),
    opacity: withTiming(open.value ? 1 : 0),
    overflow: 'hidden',
  }));

  return (
    <View>
      <TouchableOpacity
        onPress={() => { open.value = !open.value; }}
        style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}
      >
        <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: c.surface, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: c.text }}>{open.value ? '-' : '+'}</Text>
        </View>
        <Text style={{ color: c.text, fontSize: 16, fontWeight: '600' }}>{title}</Text>
      </TouchableOpacity>
      <Animated.View style={[{ marginTop: 16, borderRadius: 16, marginLeft: 24, padding: 24, backgroundColor: c.surface }, animatedStyle]}>
        {children}
      </Animated.View>
    </View>
  );
}
