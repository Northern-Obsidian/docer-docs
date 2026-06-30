import { Stack } from 'expo-router';

export default function ReaderLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'slide_from_bottom' }}>
      <Stack.Screen name="pdf/[id]" />
      <Stack.Screen name="epub/[id]" />
      <Stack.Screen name="text/[id]" />
      <Stack.Screen name="image/[id]" />
      <Stack.Screen name="office/[id]" />
      <Stack.Screen name="archive/[id]" />
    </Stack>
  );
}
