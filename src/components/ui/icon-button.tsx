import { TouchableOpacity } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';
import { useTheme } from '@/hooks/use-theme';

interface IconButtonProps {
  icon: LucideIcon;
  size?: number;
  color?: string;
  onPress: () => void;
  disabled?: boolean;
}

export function IconButton({ icon: Icon, size = 22, color, onPress, disabled }: IconButtonProps) {
  const c = useTheme();
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={{
        width: 40, height: 40, borderRadius: 20,
        alignItems: 'center', justifyContent: 'center',
        opacity: disabled ? 0.4 : 1,
      }}
    >
      <Icon size={size} color={color || c.text} />
    </TouchableOpacity>
  );
}
