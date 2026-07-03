import { View } from 'react-native';
import { useTheme } from '@/hooks/use-theme';

interface ProgressBarProps {
  progress: number;
  height?: number;
  color?: string;
}

export function ProgressBar({ progress, height = 6, color }: ProgressBarProps) {
  const c = useTheme();
  const barColor = color || c.primary;
  return (
    <View style={{ width: '100%', height, backgroundColor: c.border, borderRadius: height / 2, overflow: 'hidden' }}>
      <View style={{ width: `${Math.min(100, Math.max(0, progress * 100))}%`, height, backgroundColor: barColor, borderRadius: height / 2 }} />
    </View>
  );
}
