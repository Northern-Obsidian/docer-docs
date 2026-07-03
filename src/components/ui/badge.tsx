import { View, Text } from 'react-native';
import { useTheme } from '@/hooks/use-theme';

interface BadgeProps {
  label: string;
  color?: string;
  size?: 'sm' | 'md';
}

export function Badge({ label, color, size = 'sm' }: BadgeProps) {
  const c = useTheme();
  const bg = color || c.primary;
  return (
    <View style={{
      backgroundColor: bg + '20',
      borderRadius: 8,
      paddingHorizontal: size === 'sm' ? 8 : 12,
      paddingVertical: size === 'sm' ? 3 : 6,
      alignSelf: 'flex-start',
    }}>
      <Text style={{ fontSize: size === 'sm' ? 11 : 13, fontWeight: '600', color: bg }}>{label}</Text>
    </View>
  );
}
