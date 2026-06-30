import { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Lock, Fingerprint, Shield } from 'lucide-react-native';

import { useTheme } from '@/hooks/use-theme';
import { useSettingsStore } from '@/stores/settings-store';

export function AppLockSetup() {
  const c = useTheme();
  const appLockEnabled = useSettingsStore((s) => s.appLockEnabled);
  const appLockType = useSettingsStore((s) => s.appLockType);
  const setAppLock = useSettingsStore((s) => s.setAppLock);

  const handleToggle = () => {
    if (!appLockEnabled) {
      Alert.alert('Enable App Lock', 'Choose your preferred lock method:', [
        { text: 'PIN', onPress: () => setAppLock(true, 'pin') },
        { text: 'Biometric', onPress: () => { setAppLock(true, 'biometric'); Alert.alert('Enabled', 'App lock enabled with biometrics.'); } },
        { text: 'Cancel', style: 'cancel' },
      ]);
    } else {
      setAppLock(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: c.background }}>
      <View style={{ padding: 20 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <Shield size={24} color={c.primary} />
            <Text style={{ fontSize: 18, fontWeight: '600', color: c.text }}>App Lock</Text>
          </View>
          <TouchableOpacity
            style={{ width: 48, height: 28, borderRadius: 14, padding: 2, backgroundColor: appLockEnabled ? c.primary : c.border }}
            onPress={handleToggle}
          >
            <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: '#FFF', transform: [{ translateX: appLockEnabled ? 20 : 0 }] }} />
          </TouchableOpacity>
        </View>

        {appLockEnabled && (
          <View style={{ backgroundColor: c.surface, borderRadius: 12, padding: 16 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              {appLockType === 'biometric' ? <Fingerprint size={22} color={c.primary} /> : <Lock size={22} color={c.primary} />}
              <View>
                <Text style={{ fontSize: 15, fontWeight: '500', color: c.text }}>
                  {appLockType === 'biometric' ? 'Biometric' : 'PIN'} Lock Active
                </Text>
                <Text style={{ fontSize: 12, color: c.textSecondary, marginTop: 2 }}>
                  {appLockType === 'biometric' ? 'Use Face ID / Fingerprint to unlock' : 'Enter PIN to unlock'}
                </Text>
              </View>
            </View>
          </View>
        )}

        <Text style={{ fontSize: 13, color: c.textTertiary, marginTop: 20, lineHeight: 18 }}>
          When enabled, Docer will require authentication when reopening the app after it has been in the background.
        </Text>
      </View>
    </SafeAreaView>
  );
}
