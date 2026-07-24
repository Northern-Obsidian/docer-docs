import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

const REMINDER_CHANNEL = 'reading-reminder';
const GOAL_CHANNEL = 'goal-completion';
const DAILY_REMINDER_ID = 'daily-reading-reminder';

export async function setupNotifications() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(REMINDER_CHANNEL, {
      name: 'Reading Reminders',
      importance: Notifications.AndroidImportance.DEFAULT,
      vibrationPattern: [0, 100, 200, 100],
    });
    await Notifications.setNotificationChannelAsync(GOAL_CHANNEL, {
      name: 'Goal Completions',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 200, 100, 200],
    });
  }
}

export async function requestNotificationPermissions(): Promise<boolean> {
  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === 'granted') return true;

  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export async function scheduleDailyReminder(hour: number = 20, minute: number = 0) {
  await Notifications.cancelScheduledNotificationAsync(DAILY_REMINDER_ID);

  await Notifications.scheduleNotificationAsync({
    identifier: DAILY_REMINDER_ID,
    content: {
      title: 'Time to read!',
      body: 'You have a reading goal for today. Open a document and start reading.',
      sound: true,
      priority: Notifications.AndroidNotificationPriority.DEFAULT,
      ...(Platform.OS === 'android' ? { channelId: REMINDER_CHANNEL } : {}),
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
    },
  });
}

export async function sendGoalCompletionNotification(minutesRead: number) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Goal completed!',
      body: `You've read for ${minutesRead} minutes today. Great work!`,
      sound: true,
      priority: Notifications.AndroidNotificationPriority.HIGH,
      ...(Platform.OS === 'android' ? { channelId: GOAL_CHANNEL } : {}),
    },
    trigger: null,
  });
}

export async function sendStreakNotification(streakDays: number) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: `${streakDays}-day streak!`,
      body: `You've been reading for ${streakDays} days in a row. Keep it up!`,
      sound: true,
      priority: Notifications.AndroidNotificationPriority.HIGH,
      ...(Platform.OS === 'android' ? { channelId: GOAL_CHANNEL } : {}),
    },
    trigger: null,
  });
}

export async function cancelAllReminders() {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  for (const n of scheduled) {
    await Notifications.cancelScheduledNotificationAsync(n.identifier);
  }
}

export async function toggleNotifications(enabled: boolean) {
  if (enabled) {
    const granted = await requestNotificationPermissions();
    if (!granted) return false;
    await scheduleDailyReminder();
    return true;
  }
  await cancelAllReminders();
  return true;
}
