import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, Bell, BellOff, Clock, Target, ChevronDown } from 'lucide-react-native';

import { useTheme } from '@/hooks/use-theme';
import { useSettingsStore } from '@/stores/settings-store';
import { toggleNotifications, scheduleDailyReminder } from '@/services/notification-service';

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const MINUTES = [0, 15, 30, 45];

function ToggleSwitch({ value, onToggle, primaryColor, borderColor }: { value: boolean; onToggle: () => void; primaryColor: string; borderColor: string }) {
  return (
    <TouchableOpacity
      style={{
        width: 48,
        height: 28,
        borderRadius: 14,
        padding: 2,
        backgroundColor: value ? primaryColor : borderColor,
      }}
      onPress={onToggle}
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
    >
      <View
        style={{
          width: 24,
          height: 24,
          borderRadius: 12,
          backgroundColor: '#FFF',
          transform: [{ translateX: value ? 20 : 0 }],
        }}
      />
    </TouchableOpacity>
  );
}

export default function NotificationsScreen() {
  const c = useTheme();
  const notificationsEnabled = useSettingsStore((s) => s.notificationsEnabled);
  const notificationHour = useSettingsStore((s) => s.notificationHour);
  const notificationMinute = useSettingsStore((s) => s.notificationMinute);
  const goalCompletionNotifications = useSettingsStore((s) => s.goalCompletionNotifications);
  const setNotificationsEnabled = useSettingsStore((s) => s.setNotificationsEnabled);
  const setNotificationHour = useSettingsStore((s) => s.setNotificationHour);
  const setNotificationMinute = useSettingsStore((s) => s.setNotificationMinute);
  const setGoalCompletionNotifications = useSettingsStore((s) => s.setGoalCompletionNotifications);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const formatTime = (hour: number, minute: number) => {
    const h = hour % 12 || 12;
    const ampm = hour < 12 ? 'AM' : 'PM';
    return `${h}:${minute.toString().padStart(2, '0')} ${ampm}`;
  };

  const handleToggleNotifications = async () => {
    const newValue = !notificationsEnabled;
    const ok = await toggleNotifications(newValue);
    if (ok) {
      setNotificationsEnabled(newValue);
    } else {
      Alert.alert(
        'Permission Denied',
        'Allow notifications in your device settings to enable reading reminders.',
      );
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: c.background }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16 }}>
        <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 16 }} accessibilityLabel="Go back" accessibilityRole="button">
          <ArrowLeft size={24} color={c.text} />
        </TouchableOpacity>
        <Text style={{ fontSize: 24, fontWeight: '700', color: c.text }}>Notifications</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}>
        {/* Main Toggle */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: c.surface,
            borderRadius: 16,
            padding: 16,
            marginBottom: 20,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            {notificationsEnabled ? (
              <Bell size={22} color={c.primary} />
            ) : (
              <BellOff size={22} color={c.textTertiary} />
            )}
            <View>
              <Text style={{ fontSize: 16, fontWeight: '600', color: c.text }}>Reading Reminders</Text>
              <Text style={{ fontSize: 13, color: c.textSecondary, marginTop: 2 }}>
                {notificationsEnabled ? 'Daily reminder is on' : 'Get reminded to read daily'}
              </Text>
            </View>
          </View>
          <ToggleSwitch value={notificationsEnabled} onToggle={handleToggleNotifications} primaryColor={c.primary} borderColor={c.border} />
        </View>

        {/* Reminder Time */}
        {notificationsEnabled && (
          <View style={{ marginBottom: 20 }}>
            <Text
              style={{
                fontSize: 13,
                fontWeight: '600',
                color: c.textSecondary,
                textTransform: 'uppercase',
                letterSpacing: 1,
                marginBottom: 8,
              }}
            >
              Reminder Time
            </Text>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: c.surface,
                borderRadius: 16,
                padding: 16,
              }}
              onPress={() => setShowTimePicker(!showTimePicker)}
              accessibilityLabel={`Reminder time: ${formatTime(notificationHour, notificationMinute)}`}
              accessibilityRole="button"
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <Clock size={20} color={c.primary} />
                <Text style={{ fontSize: 16, color: c.text }}>
                  {formatTime(notificationHour, notificationMinute)}
                </Text>
              </View>
              <ChevronDown
                size={18}
                color={c.textSecondary}
                style={{ transform: [{ rotate: showTimePicker ? '180deg' : '0deg' }] }}
              />
            </TouchableOpacity>

            {showTimePicker && (
              <View
                style={{
                  backgroundColor: c.surface,
                  borderRadius: 16,
                  padding: 16,
                  marginTop: 8,
                }}
              >
                <Text style={{ fontSize: 13, color: c.textSecondary, marginBottom: 12 }}>Hour</Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
                  {HOURS.map((h) => (
                    <TouchableOpacity
                      key={h}
                      style={{
                        width: 48,
                        height: 36,
                        borderRadius: 10,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: notificationHour === h ? c.primary : c.background,
                      }}
                      onPress={() => {
                        setNotificationHour(h);
                        if (notificationsEnabled) {
                          scheduleDailyReminder(h, notificationMinute);
                        }
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: notificationHour === h ? '600' : '400',
                          color: notificationHour === h ? '#FFF' : c.text,
                          fontVariant: ['tabular-nums'],
                        }}
                      >
                        {h === 0 ? '12a' : h < 12 ? `${h}a` : h === 12 ? '12p' : `${h - 12}p`}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <Text style={{ fontSize: 13, color: c.textSecondary, marginBottom: 12 }}>Minute</Text>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  {MINUTES.map((m) => (
                    <TouchableOpacity
                      key={m}
                      style={{
                        flex: 1,
                        height: 36,
                        borderRadius: 10,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: notificationMinute === m ? c.primary : c.background,
                      }}
                      onPress={() => {
                        setNotificationMinute(m);
                        if (notificationsEnabled) {
                          scheduleDailyReminder(notificationHour, m);
                        }
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: notificationMinute === m ? '600' : '400',
                          color: notificationMinute === m ? '#FFF' : c.text,
                          fontVariant: ['tabular-nums'],
                        }}
                      >
                        :{m.toString().padStart(2, '0')}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
          </View>
        )}

        {/* Goal Completion Notifications */}
        <View>
          <Text
            style={{
              fontSize: 13,
              fontWeight: '600',
              color: c.textSecondary,
              textTransform: 'uppercase',
              letterSpacing: 1,
              marginBottom: 8,
            }}
          >
            Additional
          </Text>
          <View
            style={{
              backgroundColor: c.surface,
              borderRadius: 16,
              overflow: 'hidden',
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 16,
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <Target size={20} color={c.primary} />
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 16, color: c.text }}>Goal Completed</Text>
                  <Text style={{ fontSize: 13, color: c.textSecondary, marginTop: 2 }}>
                    Celebrate when you hit your daily goal
                  </Text>
                </View>
              </View>
              <ToggleSwitch
                value={goalCompletionNotifications}
                onToggle={() => setGoalCompletionNotifications(!goalCompletionNotifications)}
                primaryColor={c.primary}
                borderColor={c.border}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
