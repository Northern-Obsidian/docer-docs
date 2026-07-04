import { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Modal, AppState } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, Clock, Plus, X, Flame, Play, Pause } from 'lucide-react-native';

import { useTheme } from '@/hooks/use-theme';
import { useSettingsStore } from '@/stores/settings-store';
import { useStatsStore } from '@/stores/stats-store';
import { getDb } from '@/db/connection';
import { upsertTodayStats } from '@/db/stats';

const GOAL_PRESETS = [
  { label: '15 min/day', type: 'daily_time', value: 15 },
  { label: '30 min/day', type: 'daily_time', value: 30 },
  { label: '60 min/day', type: 'daily_time', value: 60 },
  { label: '10 pages/day', type: 'daily_pages', value: 10 },
  { label: '30 pages/day', type: 'daily_pages', value: 30 },
  { label: '1 book/month', type: 'monthly', value: 1 },
];

export function GoalsScreen() {
  const c = useTheme();
  const readingGoalEnabled = useSettingsStore((s) => s.readingGoalEnabled);
  const dailyReadingGoal = useSettingsStore((s) => s.dailyReadingGoal);
  const setReadingGoalEnabled = useSettingsStore((s) => s.setReadingGoalEnabled);
  const setDailyReadingGoal = useSettingsStore((s) => s.setDailyReadingGoal);
  const fetchTodayStats = useStatsStore((s) => s.fetchTodayStats);
  const todayStats = useStatsStore((s) => s.todayStats);
  const [showCustom, setShowCustom] = useState(false);
  const [customMinutes, setCustomMinutes] = useState('30');
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    fetchTodayStats();
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') fetchTodayStats();
    });
    return () => sub.remove();
  }, [fetchTodayStats]);

  const startTimer = () => {
    setIsRunning(true);
    intervalRef.current = setInterval(() => {
      setTimerSeconds((prev) => prev + 1);
    }, 1000);
  };

  const stopTimer = async () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsRunning(false);
    if (timerSeconds > 0) {
      const db = await getDb();
      const currentMinutes = Math.floor(timerSeconds / 60);
      await upsertTodayStats(db, {
        pagesRead: todayStats.pagesRead,
        readingTime: todayStats.readingTime + currentMinutes * 60,
        documentsOpened: todayStats.documentsOpened,
      });
      setTimerSeconds(0);
      fetchTodayStats();
    }
  };

  const progress = dailyReadingGoal > 0 ? Math.min(todayStats.readingTime / 60 / dailyReadingGoal, 1) : 0;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: c.background }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16 }}>
        <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 16 }}><ArrowLeft size={24} color={c.text} /></TouchableOpacity>
        <Text style={{ fontSize: 24, fontWeight: '700', color: c.text }}>Reading Goals</Text>
      </View>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}>
        {/* Progress Ring */}
        <View style={{ backgroundColor: c.surface, borderRadius: 16, padding: 24, alignItems: 'center', marginBottom: 20 }}>
          <Flame size={36} color={readingGoalEnabled ? c.primary : c.textTertiary} />
          <Text style={{ fontSize: 40, fontWeight: '700', color: c.text, marginTop: 8 }}>
            {Math.floor(todayStats.readingTime / 60)}
          </Text>
          <Text style={{ fontSize: 14, color: c.textSecondary }}>of {dailyReadingGoal} minutes today</Text>
          <View style={{ width: '100%', height: 6, backgroundColor: c.border, borderRadius: 3, marginTop: 12 }}>
            <View style={{ width: `${progress * 100}%`, height: 6, backgroundColor: progress >= 1 ? c.success : c.primary, borderRadius: 3 }} />
          </View>
          {progress >= 1 && <Text style={{ color: c.success, fontWeight: '600', marginTop: 8 }}>Goal completed! 🎯</Text>}
        </View>

        {/* Reading Timer */}
        <View style={{ backgroundColor: c.surface, borderRadius: 16, padding: 24, alignItems: 'center', marginBottom: 20 }}>
          <Clock size={28} color={c.primary} />
          <Text style={{ fontSize: 48, fontWeight: '300', color: c.text, marginTop: 8, fontVariant: ['tabular-nums'] }}>
            {Math.floor(timerSeconds / 60)}:{(timerSeconds % 60).toString().padStart(2, '0')}
          </Text>
          <Text style={{ fontSize: 13, color: c.textSecondary, marginTop: 4 }}>Reading timer</Text>
          <View style={{ flexDirection: 'row', gap: 16, marginTop: 12 }}>
            {isRunning ? (
              <TouchableOpacity onPress={stopTimer} style={{ flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: c.error, borderRadius: 12, paddingHorizontal: 24, paddingVertical: 12 }}>
                <Pause size={20} color="#FFF" />
                <Text style={{ color: '#FFF', fontWeight: '600' }}>Stop</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={startTimer} style={{ flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: c.primary, borderRadius: 12, paddingHorizontal: 24, paddingVertical: 12 }}>
                <Play size={20} color="#FFF" />
                <Text style={{ color: '#FFF', fontWeight: '600' }}>{timerSeconds > 0 ? 'Resume' : 'Start Reading'}</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Goal Toggle */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <Text style={{ fontSize: 16, fontWeight: '600', color: c.text }}>Enable Daily Goal</Text>
          <TouchableOpacity
            style={{ width: 48, height: 28, borderRadius: 14, padding: 2, backgroundColor: readingGoalEnabled ? c.primary : c.border }}
            onPress={() => setReadingGoalEnabled(!readingGoalEnabled)}
          >
            <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: '#FFF', transform: [{ translateX: readingGoalEnabled ? 20 : 0 }] }} />
          </TouchableOpacity>
        </View>

        {readingGoalEnabled && (
          <>
            <Text style={{ fontSize: 14, color: c.textSecondary, marginBottom: 12 }}>Quick presets</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
              {GOAL_PRESETS.map((preset) => (
                <TouchableOpacity key={preset.label}
                  style={{ paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, backgroundColor: dailyReadingGoal === preset.value ? c.primary : c.surface }}
                  onPress={() => { setDailyReadingGoal(preset.value); setReadingGoalEnabled(true); }}>
                  <Text style={{ color: dailyReadingGoal === preset.value ? '#FFF' : c.text, fontWeight: '500' }}>{preset.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity onPress={() => setShowCustom(true)} style={{ flexDirection: 'row', alignItems: 'center', gap: 8, padding: 14, backgroundColor: c.surface, borderRadius: 12 }}>
              <Plus size={20} color={c.primary} />
              <Text style={{ color: c.primary, fontWeight: '500' }}>Set custom goal</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>

      <Modal visible={showCustom} transparent animationType="fade" onRequestClose={() => setShowCustom(false)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', padding: 32 }}>
          <View style={{ backgroundColor: c.surface, borderRadius: 20, padding: 24 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <Text style={{ fontSize: 18, fontWeight: '600', color: c.text }}>Custom Goal</Text>
              <TouchableOpacity onPress={() => setShowCustom(false)}><X size={22} color={c.text} /></TouchableOpacity>
            </View>
            <Text style={{ color: c.textSecondary, marginBottom: 8 }}>Minutes per day</Text>
            <TextInput style={{ backgroundColor: c.background, borderRadius: 12, padding: 14, fontSize: 16, color: c.text }} value={customMinutes} onChangeText={setCustomMinutes} keyboardType="number-pad" autoFocus />
            <TouchableOpacity onPress={() => { setDailyReadingGoal(Number(customMinutes) || 30); setReadingGoalEnabled(true); setShowCustom(false); }}
              style={{ backgroundColor: c.primary, borderRadius: 12, padding: 14, alignItems: 'center', marginTop: 16 }}>
              <Text style={{ color: '#FFF', fontWeight: '600' }}>Set Goal</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
