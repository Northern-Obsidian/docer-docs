import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Target, Clock } from 'lucide-react-native';
import { useTheme } from '@/hooks/use-theme';
import { useSettingsStore } from '@/stores/settings-store';
import { getDb } from '@/db/connection';
import { insertGoal } from '@/db/goals';

export function GoalsScreen() {
  const c = useTheme();
  const readingGoalEnabled = useSettingsStore((s) => s.readingGoalEnabled);
  const dailyReadingGoal = useSettingsStore((s) => s.dailyReadingGoal);
  const setReadingGoalEnabled = useSettingsStore((s) => s.setReadingGoalEnabled);
  const setDailyReadingGoal = useSettingsStore((s) => s.setDailyReadingGoal);
  const [goalInput, setGoalInput] = useState(String(dailyReadingGoal));

  const handleSave = async () => {
    const value = parseInt(goalInput, 10);
    if (isNaN(value) || value < 1) {
      Alert.alert('Invalid', 'Please enter a valid number of minutes.');
      return;
    }
    setDailyReadingGoal(value);
    const db = await getDb();
    const now = new Date();
    const end = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    await insertGoal(db, {
      id: `goal-${Date.now()}`,
      type: 'daily_time',
      targetValue: value,
      currentValue: 0,
      periodStart: now.toISOString(),
      periodEnd: end.toISOString(),
      createdAt: now.toISOString(),
    });
    Alert.alert('Saved', `Daily reading goal set to ${value} minutes.`);
  };

  return (
    <View style={{ flex: 1, backgroundColor: c.background, padding: 20 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <Target size={24} color={c.primary} />
        <Text style={{ fontSize: 18, fontWeight: '600', color: c.text }}>Reading Goals</Text>
      </View>

      <View style={{ backgroundColor: c.surface, borderRadius: 14, padding: 20, marginBottom: 16 }}>
        <Text style={{ fontSize: 15, fontWeight: '500', color: c.text, marginBottom: 12 }}>Daily Reading Time</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <TextInput
            value={goalInput}
            onChangeText={setGoalInput}
            keyboardType="number-pad"
            style={{ flex: 1, backgroundColor: c.background, borderRadius: 10, padding: 14, fontSize: 16, color: c.text, borderWidth: 1, borderColor: c.border }}
          />
          <Text style={{ color: c.textSecondary, fontSize: 14 }}>minutes</Text>
        </View>
        <TouchableOpacity
          onPress={handleSave}
          style={{ marginTop: 16, backgroundColor: c.primary, borderRadius: 12, paddingVertical: 12, alignItems: 'center' }}
        >
          <Text style={{ color: '#FFF', fontWeight: '600' }}>Set Goal</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={() => setReadingGoalEnabled(!readingGoalEnabled)}
        style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: c.surface, borderRadius: 14, padding: 16 }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <Clock size={22} color={c.primary} />
          <Text style={{ fontSize: 15, color: c.text }}>Daily Reminder</Text>
        </View>
        <View style={{ width: 48, height: 28, borderRadius: 14, padding: 2, backgroundColor: readingGoalEnabled ? c.primary : c.border }}>
          <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: '#FFF', transform: [{ translateX: readingGoalEnabled ? 20 : 0 }] }} />
        </View>
      </TouchableOpacity>
    </View>
  );
}
