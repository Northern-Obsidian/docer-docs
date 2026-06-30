import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, TrendingUp, Clock, BookOpen, Flame } from 'lucide-react-native';

import { useTheme } from '@/hooks/use-theme';
import { useStatsStore } from '@/stores/stats-store';

export default function StatsScreen() {
  const c = useTheme();
  const todayStats = useStatsStore((s) => s.todayStats);
  const readingStreak = useStatsStore((s) => s.readingStreak);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: c.background }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16 }}>
        <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 16 }}>
          <ArrowLeft size={24} color={c.text} />
        </TouchableOpacity>
        <Text style={{ fontSize: 24, fontWeight: '700', color: c.text }}>Statistics</Text>
      </View>
      <View style={{ paddingHorizontal: 20 }}>
        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 12 }}>
          <View style={{ flex: 1, backgroundColor: c.surface, borderRadius: 16, padding: 20, alignItems: 'center' }}>
            <Clock size={24} color={c.primary} />
            <Text style={{ fontSize: 32, fontWeight: '700', color: c.text, marginTop: 8 }}>
              {Math.floor(todayStats.readingTime / 60)}
            </Text>
            <Text style={{ fontSize: 13, color: c.textSecondary }}>Minutes Today</Text>
          </View>
          <View style={{ flex: 1, backgroundColor: c.surface, borderRadius: 16, padding: 20, alignItems: 'center' }}>
            <Flame size={24} color={c.primary} />
            <Text style={{ fontSize: 32, fontWeight: '700', color: c.text, marginTop: 8 }}>
              {readingStreak}
            </Text>
            <Text style={{ fontSize: 13, color: c.textSecondary }}>Day Streak</Text>
          </View>
        </View>
        <View style={{ backgroundColor: c.surface, borderRadius: 16, padding: 20, alignItems: 'center' }}>
          <BookOpen size={24} color={c.primary} />
          <Text style={{ fontSize: 32, fontWeight: '700', color: c.text, marginTop: 8 }}>
            {todayStats.pagesRead}
          </Text>
          <Text style={{ fontSize: 13, color: c.textSecondary }}>Pages Read Today</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
