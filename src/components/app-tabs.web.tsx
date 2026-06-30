import { View, Text, TouchableOpacity } from 'react-native';
import { router, usePathname } from 'expo-router';
import { Home, Compass } from 'lucide-react-native';

import { useTheme } from '@/hooks/use-theme';

export default function AppTabs() {
  const c = useTheme();
  const pathname = usePathname();

  const tabs = [
    { name: 'index', label: 'Home', icon: Home },
    { name: 'explore', label: 'Library', icon: Compass },
  ];

  return (
    <View style={{ flexDirection: 'row', backgroundColor: c.background, borderTopWidth: 1, borderTopColor: c.border }}>
      {tabs.map((tab) => {
        const active = pathname === `/${tab.name}`;
        const Icon = tab.icon;
        return (
          <TouchableOpacity
            key={tab.name}
            onPress={() => router.push(`/${tab.name}` as any)}
            style={{ flex: 1, alignItems: 'center', paddingVertical: 8, gap: 4 }}
            accessibilityLabel={tab.label}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
          >
            <Icon size={22} color={active ? c.primary : c.textSecondary} />
            <Text style={{ fontSize: 11, color: active ? c.primary : c.textSecondary }}>{tab.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
