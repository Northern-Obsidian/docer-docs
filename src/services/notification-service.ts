import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

const CHANNEL_ID = 'reading-reminder';
const NOTIFICATION_ID = 'daily-reading-reminder';

export async function setupNotifications() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
      name: 'Reading Reminders',
      importance: Notifications.AndroidImportance.DEFAULT,
      vibrationPattern: [0, 100, 200, 100],
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
  await cancelAllReminders();

  await Notifications.scheduleNotificationAsync({
    identifier: NOTIFICATION_ID,
    content: {
      title: 'Time to read!',
      body: 'You have a reading goal for today. Open a document and start reading.',
      sound: true,
      priority: Notifications.AndroidNotificationPriority.DEFAULT,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
    },
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
