import { create } from 'zustand';
import { appStorage } from '@/storage';

interface SettingsState {
  notificationsEnabled: boolean;
  notificationHour: number;
  notificationMinute: number;
  goalCompletionNotifications: boolean;
  readingGoalEnabled: boolean;
  dailyReadingGoal: number;
  appLockEnabled: boolean;
  appLockType: string;
  loadFromStorage: () => void;
  setNotificationsEnabled: (enabled: boolean) => void;
  setNotificationHour: (hour: number) => void;
  setNotificationMinute: (minute: number) => void;
  setGoalCompletionNotifications: (enabled: boolean) => void;
  setReadingGoalEnabled: (enabled: boolean) => void;
  setDailyReadingGoal: (goal: number) => void;
  setAppLock: (enabled: boolean, type?: string) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  notificationsEnabled: false,
  notificationHour: 20,
  notificationMinute: 0,
  goalCompletionNotifications: true,
  readingGoalEnabled: false,
  dailyReadingGoal: 30,
  appLockEnabled: false,
  appLockType: 'pin',

  loadFromStorage: () => {
    set({
      notificationsEnabled: appStorage.getNotificationsEnabled(),
      notificationHour: appStorage.getNotificationHour(),
      notificationMinute: appStorage.getNotificationMinute(),
      goalCompletionNotifications: appStorage.getGoalCompletionNotifications(),
      readingGoalEnabled: appStorage.getReadingGoalEnabled(),
      dailyReadingGoal: appStorage.getDailyReadingGoal(),
      appLockEnabled: appStorage.getAppLockEnabled(),
      appLockType: appStorage.getAppLockType(),
    });
  },

  setNotificationsEnabled: (notificationsEnabled) => {
    appStorage.setNotificationsEnabled(notificationsEnabled);
    set({ notificationsEnabled });
  },

  setNotificationHour: (notificationHour) => {
    appStorage.setNotificationHour(notificationHour);
    set({ notificationHour });
  },

  setNotificationMinute: (notificationMinute) => {
    appStorage.setNotificationMinute(notificationMinute);
    set({ notificationMinute });
  },

  setGoalCompletionNotifications: (goalCompletionNotifications) => {
    appStorage.setGoalCompletionNotifications(goalCompletionNotifications);
    set({ goalCompletionNotifications });
  },

  setReadingGoalEnabled: (readingGoalEnabled) => {
    appStorage.setReadingGoalEnabled(readingGoalEnabled);
    set({ readingGoalEnabled });
  },

  setDailyReadingGoal: (dailyReadingGoal) => {
    appStorage.setDailyReadingGoal(dailyReadingGoal);
    set({ dailyReadingGoal });
  },

  setAppLock: (appLockEnabled, appLockType) => {
    appStorage.setAppLockEnabled(appLockEnabled);
    if (appLockType) {
      appStorage.setAppLockType(appLockType);
      set({ appLockType });
    }
    set({ appLockEnabled });
  },
}));
