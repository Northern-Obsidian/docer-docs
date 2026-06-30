import { Stack } from 'expo-router';
import { useTheme } from '@/hooks/use-theme';

export default function LibraryLayout() {
  const c = useTheme();
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: c.background } }}>
      <Stack.Screen name="collections" />
      <Stack.Screen name="tags" />
    </Stack>
  );
}
