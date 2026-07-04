import { useState, useCallback, useEffect, startTransition } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Lock, Fingerprint, Shield } from 'lucide-react-native';
import * as LocalAuthentication from 'expo-local-authentication';

import { useTheme } from '@/hooks/use-theme';
import { useSettingsStore } from '@/stores/settings-store';
import { storage } from '@/storage';

const PIN_KEY = 'app_lock_pin_hash';

function hashPin(pin: string): string {
  let hash = 0;
  for (let i = 0; i < pin.length; i++) {
    hash = ((hash << 5) - hash) + pin.charCodeAt(i);
    hash |= 0;
  }
  return hash.toString(36);
}

function getStoredPinHash(): string | null {
  return storage.getString(PIN_KEY) ?? null;
}

function setStoredPinHash(pin: string) {
  storage.set(PIN_KEY, hashPin(pin));
}

function clearStoredPinHash() {
  storage.remove(PIN_KEY);
}

export function AppLockSetup() {
  const c = useTheme();
  const appLockEnabled = useSettingsStore((s) => s.appLockEnabled);
  const appLockType = useSettingsStore((s) => s.appLockType);
  const setAppLock = useSettingsStore((s) => s.setAppLock);
  const [showPinSetup, setShowPinSetup] = useState(false);
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [step, setStep] = useState<'enter' | 'confirm'>('enter');

  const handleToggle = () => {
    if (!appLockEnabled) {
      Alert.alert('Enable App Lock', 'Choose your preferred lock method:', [
        { text: 'PIN', onPress: () => { setShowPinSetup(true); setPin(''); setConfirmPin(''); setStep('enter'); } },
        { text: 'Biometric', onPress: async () => {
          const compatible = await LocalAuthentication.hasHardwareAsync();
          const enrolled = await LocalAuthentication.isEnrolledAsync();
          if (!compatible || !enrolled) {
            Alert.alert('Not Available', 'Biometric authentication is not available on this device.');
            return;
          }
          setAppLock(true, 'biometric');
          Alert.alert('Enabled', 'App lock enabled with biometrics.');
        }},
        { text: 'Cancel', style: 'cancel' },
      ]);
    } else {
      clearStoredPinHash();
      setAppLock(false);
    }
  };

  const handlePinSubmit = useCallback(() => {
    if (step === 'enter') {
      if (pin.length < 4) {
        Alert.alert('Too Short', 'PIN must be at least 4 digits.');
        return;
      }
      setStep('confirm');
      setConfirmPin('');
    } else {
      if (pin !== confirmPin) {
        Alert.alert('Mismatch', 'PINs do not match. Try again.');
        setStep('enter');
        setPin('');
        return;
      }
      setStoredPinHash(pin);
      setAppLock(true, 'pin');
      setShowPinSetup(false);
      setPin('');
      setConfirmPin('');
      Alert.alert('Enabled', 'App lock enabled with PIN.');
    }
  }, [pin, confirmPin, step, setAppLock]);

  const renderPinSetup = () => (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 16, fontWeight: '600', color: c.text, marginBottom: 12 }}>
        {step === 'enter' ? 'Set a PIN code' : 'Confirm your PIN'}
      </Text>
      <TextInput
        value={step === 'confirm' ? confirmPin : pin}
        onChangeText={step === 'confirm' ? setConfirmPin : setPin}
        keyboardType="number-pad"
        secureTextEntry
        maxLength={8}
        placeholder="Enter PIN"
        placeholderTextColor={c.textTertiary}
        style={{
          backgroundColor: c.surface, borderRadius: 12, padding: 16, fontSize: 18,
          color: c.text, textAlign: 'center', letterSpacing: 8, marginBottom: 16,
          borderWidth: 1, borderColor: c.border,
        }}
      />
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <TouchableOpacity
          onPress={() => { setShowPinSetup(false); setPin(''); setConfirmPin(''); setStep('enter'); }}
          style={{ flex: 1, padding: 14, borderRadius: 12, borderWidth: 1, borderColor: c.border, alignItems: 'center' }}
        >
          <Text style={{ color: c.text, fontWeight: '600' }}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handlePinSubmit}
          style={{
            flex: 1, padding: 14, borderRadius: 12, backgroundColor: c.primary, alignItems: 'center',
            opacity: (step === 'confirm' ? confirmPin : pin).length < 4 ? 0.5 : 1,
          }}
          disabled={(step === 'confirm' ? confirmPin : pin).length < 4}
        >
          <Text style={{ color: '#FFF', fontWeight: '600' }}>{step === 'enter' ? 'Next' : 'Confirm'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

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

        {showPinSetup && renderPinSetup()}

        {appLockEnabled && !showPinSetup && (
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

export function AppLockGate({ children }: { children: React.ReactNode }) {
  const c = useTheme();
  const appLockEnabled = useSettingsStore((s) => s.appLockEnabled);
  const appLockType = useSettingsStore((s) => s.appLockType);
  const [locked, setLocked] = useState(appLockEnabled);
  const [pinInput, setPinInput] = useState('');
  const [error, setError] = useState('');

  const handleBiometric = useCallback(async () => {
    if (appLockType !== 'biometric') return;
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Unlock Docer',
      fallbackLabel: 'Use PIN',
    });
    if (result.success) {
      startTransition(() => setLocked(false));
    } else if (result.error === 'user_fallback') {
      // fall through to PIN
    }
  }, [appLockType]);

  useEffect(() => {
    if (locked && appLockEnabled && appLockType === 'biometric') {
      handleBiometric();
    }
  }, [locked, appLockEnabled, appLockType, handleBiometric]);

  const handlePinUnlock = useCallback(() => {
    const stored = getStoredPinHash();
    if (stored && hashPin(pinInput) === stored) {
      setLocked(false);
      setPinInput('');
      setError('');
    } else {
      setError('Incorrect PIN');
      setPinInput('');
    }
  }, [pinInput]);

  if (!appLockEnabled || !locked) return <>{children}</>;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: c.background }}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 }}>
        <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: c.primaryContainer, alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
          <Lock size={36} color={c.primary} />
        </View>
        <Text style={{ fontSize: 22, fontWeight: '700', color: c.text, marginBottom: 8 }}>Docer Locked</Text>
        <Text style={{ fontSize: 14, color: c.textSecondary, textAlign: 'center', marginBottom: 32 }}>
          {appLockType === 'biometric' ? 'Authenticate to continue' : 'Enter your PIN to unlock'}
        </Text>

        {appLockType === 'pin' ? (
          <>
            <TextInput
              value={pinInput}
              onChangeText={setPinInput}
              keyboardType="number-pad"
              secureTextEntry
              maxLength={8}
              placeholder="Enter PIN"
              placeholderTextColor={c.textTertiary}
              autoFocus
              style={{
                backgroundColor: c.surface, borderRadius: 12, padding: 16, fontSize: 20,
                color: c.text, textAlign: 'center', letterSpacing: 10, marginBottom: 16,
                borderWidth: 1, borderColor: error ? c.error : c.border, width: '100%',
              }}
            />
            {error ? <Text style={{ color: c.error, fontSize: 13, marginBottom: 12 }}>{error}</Text> : null}
            <TouchableOpacity
              onPress={handlePinUnlock}
              style={{
                backgroundColor: c.primary, borderRadius: 12, paddingVertical: 14, paddingHorizontal: 48,
                opacity: pinInput.length < 4 ? 0.5 : 1, width: '100%', alignItems: 'center',
              }}
              disabled={pinInput.length < 4}
            >
              <Text style={{ color: '#FFF', fontWeight: '600', fontSize: 16 }}>Unlock</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity
            onPress={handleBiometric}
            style={{
              backgroundColor: c.primary, borderRadius: 12, paddingVertical: 14, paddingHorizontal: 48, alignItems: 'center',
            }}
          >
            <Fingerprint size={24} color="#FFF" />
            <Text style={{ color: '#FFF', fontWeight: '600', fontSize: 16, marginTop: 8 }}>Authenticate</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}
