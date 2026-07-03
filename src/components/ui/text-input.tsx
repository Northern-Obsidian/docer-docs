import { TextInput as RNTextInput, Text, View } from 'react-native';
import { useTheme } from '@/hooks/use-theme';

interface TextInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  secureTextEntry?: boolean;
  multiline?: boolean;
  keyboardType?: 'default' | 'number-pad' | 'email-address' | 'url';
  autoFocus?: boolean;
  maxLength?: number;
}

export function TextInput({ value, onChangeText, placeholder, label, error, secureTextEntry, multiline, keyboardType, autoFocus, maxLength }: TextInputProps) {
  const c = useTheme();

  return (
    <View style={{ marginBottom: 16 }}>
      {label && <Text style={{ fontSize: 14, fontWeight: '500', color: c.text, marginBottom: 6 }}>{label}</Text>}
      <RNTextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={c.textTertiary}
        secureTextEntry={secureTextEntry}
        multiline={multiline}
        keyboardType={keyboardType}
        autoFocus={autoFocus}
        maxLength={maxLength}
        style={{
          backgroundColor: c.surface,
          borderRadius: 12,
          padding: 14,
          fontSize: 16,
          color: c.text,
          borderWidth: 1,
          borderColor: error ? c.error : c.border,
          minHeight: multiline ? 100 : undefined,
          textAlignVertical: multiline ? 'top' : 'center',
        }}
      />
      {error && <Text style={{ color: c.error, fontSize: 12, marginTop: 4 }}>{error}</Text>}
    </View>
  );
}
