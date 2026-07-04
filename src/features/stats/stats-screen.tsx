import { View, Text, ScrollView } from 'react-native';
import { BookOpen, Clock, Flame } from 'lucide-react-native';
import { useTheme } from '@/hooks/use-theme';
import { useStatsStore } from '@/stores/stats-store';

export function StatsScreen() {
  const c = useTheme();
  const todayStats = useStatsStore((s) => s.todayStats);
  const readingStreak = useStatsStore((s) => s.readingStreak);
  const statCards = [
    { icon: BookOpen, label: 'Pages Read', value: String(todayStats?.pagesRead ?? 0) },
    { icon: Clock, label: 'Reading Time', value: `${todayStats?.readingTime ?? 0} min` },
    { icon: Flame, label: 'Day Streak', value: `${readingStreak ?? 0} days` },
  ];

  return (
    <ScrollView style={{ flex: 1, backgroundColor: c.background }} contentContainerStyle={{ padding: 20 }}>
      <Text style={{ fontSize: 22, fontWeight: '700', color: c.text, marginBottom: 20 }}>Reading Statistics</Text>
      <View style={{ flexDirection: 'row', gap: 12, marginBottom: 24 }}>
        {statCards.map(({ icon: Icon, label, value }) => (
          <View key={label} style={{ flex: 1, backgroundColor: c.surface, borderRadius: 14, padding: 16, alignItems: 'center' }}>
            <Icon size={22} color={c.primary} />
            <Text style={{ fontSize: 20, fontWeight: '700', color: c.text, marginTop: 8 }}>{value}</Text>
            <Text style={{ fontSize: 12, color: c.textSecondary, marginTop: 2 }}>{label}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
