import { Component, type ReactNode } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { AlertTriangle } from 'lucide-react-native';
import { THEME_COLORS } from '@/constants/theme-config';
import type { Theme } from '@/types';
import { appStorage } from '@/storage';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  reset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      const theme = (appStorage.getTheme() as Theme) || 'light';
      const c = THEME_COLORS[theme];
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, backgroundColor: c.background }}>
          <AlertTriangle size={48} color={c.error} />
          <Text style={{ fontSize: 20, fontWeight: '700', color: c.text, marginTop: 16 }}>Something went wrong</Text>
          <Text style={{ fontSize: 14, color: c.textSecondary, marginTop: 8, textAlign: 'center' }}>
            {this.state.error?.message || 'An unexpected error occurred'}
          </Text>
          <TouchableOpacity
            onPress={this.reset}
            style={{ backgroundColor: c.primary, borderRadius: 12, paddingHorizontal: 24, paddingVertical: 12, marginTop: 24 }}
          >
            <Text style={{ color: '#FFF', fontWeight: '600' }}>Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return this.props.children;
  }
}
