import { Stack } from 'expo-router';
import { tokens } from '@/design-system/tokens';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: tokens.color.background },
      }}
    />
  );
}
