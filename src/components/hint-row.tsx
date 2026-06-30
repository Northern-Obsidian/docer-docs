import { View, Text } from 'react-native';
import type { ReactNode } from 'react';

import { useTheme } from '@/hooks/use-theme';

export function HintRow({ title, hint }: { title: string; hint: ReactNode }) {
  const c = useTheme();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
      <Text style={{ color: c.text, fontSize: 16 }}>{title}</Text>
      <View style={{ borderRadius: 8, paddingVertical: 2, paddingHorizontal: 8 }}>
        {hint}
      </View>
    </View>
  );
}
