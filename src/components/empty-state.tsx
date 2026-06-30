import { View, Text, TouchableOpacity } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';
import { BookOpen } from 'lucide-react-native';

import { useTheme } from '@/hooks/use-theme';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ icon: Icon = BookOpen, title, subtitle, actionLabel, onAction }: EmptyStateProps) {
  const c = useTheme();
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 48, paddingVertical: 60 }}>
      <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: c.primaryContainer, alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
        <Icon size={28} color={c.primary} />
      </View>
      <Text style={{ fontSize: 17, fontWeight: '600', color: c.text, textAlign: 'center', marginBottom: 4 }}>{title}</Text>
      {subtitle && <Text style={{ fontSize: 14, color: c.textSecondary, textAlign: 'center', lineHeight: 20 }}>{subtitle}</Text>}
      {actionLabel && onAction && (
        <TouchableOpacity
          onPress={onAction}
          style={{ marginTop: 20, backgroundColor: c.primary, borderRadius: 12, paddingHorizontal: 24, paddingVertical: 12 }}
        >
          <Text style={{ color: '#FFF', fontWeight: '600', fontSize: 15 }}>{actionLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

export function LoadingState() {
  const c = useTheme();
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 48 }}>
      <Text style={{ color: c.textSecondary, fontSize: 15 }}>Loading...</Text>
    </View>
  );
}

export function ErrorState({ message, onRetry }: { message?: string; onRetry?: () => void }) {
  const c = useTheme();
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 48, paddingVertical: 60 }}>
      <Text style={{ fontSize: 17, fontWeight: '600', color: c.error, textAlign: 'center', marginBottom: 4 }}>Something went wrong</Text>
      <Text style={{ fontSize: 14, color: c.textSecondary, textAlign: 'center' }}>{message || 'Please try again.'}</Text>
      {onRetry && (
        <TouchableOpacity
          onPress={onRetry}
          style={{ marginTop: 20, backgroundColor: c.primary, borderRadius: 12, paddingHorizontal: 24, paddingVertical: 12 }}
        >
          <Text style={{ color: '#FFF', fontWeight: '600', fontSize: 15 }}>Retry</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
