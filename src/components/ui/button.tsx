import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { useTheme } from '@/hooks/use-theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
}

export function Button({ title, onPress, variant = 'primary', size = 'md', disabled, loading, fullWidth }: ButtonProps) {
  const c = useTheme();

  const bgColors: Record<string, string> = {
    primary: c.primary,
    secondary: c.surface,
    ghost: 'transparent',
    danger: c.error,
  };

  const textColors: Record<string, string> = {
    primary: '#FFF',
    secondary: c.text,
    ghost: c.primary,
    danger: '#FFF',
  };

  const paddings: Record<string, { px: number; py: number }> = {
    sm: { px: 16, py: 8 },
    md: { px: 24, py: 12 },
    lg: { px: 32, py: 14 },
  };

  const { px, py } = paddings[size];

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={{
        backgroundColor: disabled ? c.textTertiary : bgColors[variant],
        borderRadius: 12,
        paddingHorizontal: px,
        paddingVertical: py,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 8,
        opacity: disabled ? 0.5 : 1,
        ...(fullWidth ? { width: '100%' } : {}),
      }}
    >
      {loading && <ActivityIndicator size="small" color={textColors[variant]} />}
      <Text style={{ color: disabled ? '#FFF' : textColors[variant], fontWeight: '600', fontSize: size === 'sm' ? 13 : 15 }}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}
