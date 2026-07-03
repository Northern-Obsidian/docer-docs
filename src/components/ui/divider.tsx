import { View } from 'react-native';
import { useTheme } from '@/hooks/use-theme';

interface DividerProps {
  spacing?: number;
}

export function Divider({ spacing = 16 }: DividerProps) {
  const c = useTheme();
  return (
    <View style={{ paddingVertical: spacing }}>
      <View style={{ height: 1, backgroundColor: c.border }} />
    </View>
  );
}
