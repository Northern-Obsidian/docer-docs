import { Tabs } from 'expo-router';
import { Home, Compass, Search, Bookmark, Settings } from 'lucide-react-native';

import { useTheme } from '@/hooks/use-theme';

export default function AppTabs() {
  const c = useTheme();
  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarStyle: { backgroundColor: c.background, borderTopColor: c.border },
      tabBarActiveTintColor: c.primary,
      tabBarInactiveTintColor: c.textSecondary,
    }}>
      <Tabs.Screen name="index" options={{ title: 'Home', tabBarIcon: ({ color }) => <Home size={22} color={color} /> }} />
      <Tabs.Screen name="explore" options={{ title: 'Library', tabBarIcon: ({ color }) => <Compass size={22} color={color} /> }} />
    </Tabs>
  );
}
