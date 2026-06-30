import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import {
  Palette, Bell, Target, Shield, Database,
  BookMarked, Info, ChevronRight, Sun, Moon
} from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';

import { useTheme } from '@/hooks/use-theme';
import { useThemeStore } from '@/stores/theme-store';
import { useSettingsStore } from '@/stores/settings-store';
import { THEMES } from '@/constants/theme-config';
import { toggleNotifications } from '@/services/notification-service';

interface SettingsItem {
  icon: LucideIcon;
  label: string;
  onPress: () => void;
  right?: string;
}

interface SettingsToggleItem {
  icon: LucideIcon;
  label: string;
  onPress: () => void;
  isToggle: true;
  value: boolean;
  onToggle: () => void;
}

type SettingsSectionItem = SettingsItem | SettingsToggleItem;

interface SettingsSection {
  title: string;
  items: SettingsSectionItem[];
}

export default function SettingsScreen() {
  const c = useTheme();
  const theme = useThemeStore((s) => s.theme);
  const setTheme = useThemeStore((s) => s.setTheme);
  const notificationsEnabled = useSettingsStore((s) => s.notificationsEnabled);
  const setNotificationsEnabled = useSettingsStore((s) => s.setNotificationsEnabled);
  const readingGoalEnabled = useSettingsStore((s) => s.readingGoalEnabled);
  const appLockEnabled = useSettingsStore((s) => s.appLockEnabled);

  const sections: SettingsSection[] = [
    {
      title: 'Reading',
      items: [
        { icon: Target, label: 'Reading Goals', onPress: () => router.push('/settings/goals' as any), right: readingGoalEnabled ? 'On' : 'Off' },
        { icon: Bell, label: 'Notifications', onPress: () => {}, isToggle: true, value: notificationsEnabled, onToggle: async () => { const ok = await toggleNotifications(!notificationsEnabled); if (ok) setNotificationsEnabled(!notificationsEnabled); else Alert.alert('Permission Denied', 'Allow notifications in system settings to enable reading reminders.'); } },
      ],
    },
    {
      title: 'Appearance',
      items: [
        { icon: Palette, label: 'Appearance', onPress: () => router.push('/settings/appearance' as any) },
      ],
    },
    {
      title: 'Data',
      items: [
        { icon: Database, label: 'Backup & Restore', onPress: () => router.push('/settings/backup' as any) },
        { icon: BookMarked, label: 'Storage', onPress: () => router.push('/settings/storage' as any) },
      ],
    },
    {
      title: 'Security',
      items: [
        { icon: Shield, label: 'App Lock', onPress: () => router.push('/settings/security' as any), right: appLockEnabled ? 'On' : 'Off' },
      ],
    },
    {
      title: 'About',
      items: [
        { icon: Info, label: 'About', onPress: () => router.push('/settings/about' as any), right: '1.0.0' },
      ],
    },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: c.background }}>
      <View style={{ paddingHorizontal: 20, paddingVertical: 16 }}>
        <Text style={{ fontSize: 28, fontWeight: '700', color: c.text }}>Settings</Text>
      </View>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Theme Quick Picker */}
        <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            {theme === 'dark' || theme === 'amoled' || theme === 'midnight' || theme === 'forest' || theme === 'ocean' ? (
              <Moon size={18} color={c.primary} />
            ) : (
              <Sun size={18} color={c.primary} />
            )}
            <Text style={{ fontSize: 13, fontWeight: '600', color: c.textSecondary, textTransform: 'uppercase', letterSpacing: 1 }}>Theme</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
            {THEMES.map((t) => (
              <TouchableOpacity
                key={t.key}
                style={{ paddingHorizontal: 18, paddingVertical: 10, borderRadius: 20, backgroundColor: theme === t.key ? c.primary : c.surface }}
                onPress={() => setTheme(t.key)}
                accessibilityLabel={`${t.label} theme`}
                accessibilityRole="button"
                accessibilityState={{ selected: theme === t.key }}
              >
                <Text style={{ color: theme === t.key ? '#FFF' : c.text, fontWeight: '500', fontSize: 14 }}>{t.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Settings Sections */}
        {sections.map((section) => (
          <View key={section.title} style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 13, fontWeight: '600', color: c.textSecondary, textTransform: 'uppercase', letterSpacing: 1, paddingHorizontal: 20, marginBottom: 8 }}>
              {section.title}
            </Text>
            <View style={{ marginHorizontal: 20, backgroundColor: c.surface, borderRadius: 14, overflow: 'hidden' }}>
              {section.items.map((item, idx) => (
                <TouchableOpacity
                  key={item.label}
                  style={{
                    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14,
                    borderBottomWidth: idx < section.items.length - 1 ? 1 : 0, borderBottomColor: c.border,
                  }}
                  onPress={item.onPress}
                  accessibilityLabel={item.label}
                  accessibilityRole="button"
                >
                  <item.icon size={20} color={c.primary} />
                  <Text style={{ flex: 1, marginLeft: 14, fontSize: 16, color: c.text }}>{item.label}</Text>
                  {'isToggle' in item && item.isToggle ? (
                    <TouchableOpacity
                      style={{ width: 44, height: 26, borderRadius: 13, padding: 2, backgroundColor: item.value ? c.primary : c.border }}
                      onPress={item.onToggle}
                      accessibilityLabel={`${item.label}: ${item.value ? 'on' : 'off'}`}
                      accessibilityRole="switch"
                      accessibilityState={{ checked: item.value }}
                    >
                      <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: '#FFF', transform: [{ translateX: item.value ? 18 : 0 }] }} />
                    </TouchableOpacity>
                  ) : (
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      {'right' in item && item.right && <Text style={{ fontSize: 14, color: c.textSecondary }}>{item.right}</Text>}
                      <ChevronRight size={16} color={c.textTertiary} />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
