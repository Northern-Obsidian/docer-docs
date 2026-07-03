import { TouchableOpacity, Text } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { X } from 'lucide-react-native';

interface ChipProps {
  label: string;
  onRemove?: () => void;
  selected?: boolean;
  color?: string;
}

export function Chip({ label, onRemove, selected, color }: ChipProps) {
  const c = useTheme();
  const bg = selected ? (color || c.primary) : c.surface;
  const txt = selected ? '#FFF' : c.text;

  return (
    <TouchableOpacity
      onPress={onRemove}
      style={{
        flexDirection: 'row', alignItems: 'center', gap: 4,
        backgroundColor: bg, borderRadius: 16, paddingHorizontal: 12, paddingVertical: 6,
        borderWidth: selected ? 0 : 1, borderColor: c.border,
      }}
    >
      <Text style={{ fontSize: 13, color: txt }}>{label}</Text>
      {onRemove && <X size={14} color={txt} />}
    </TouchableOpacity>
  );
}
