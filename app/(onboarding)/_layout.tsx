import { Stack } from 'expo-router';
import { tokens } from '@/design-system/tokens';
import { OnboardingProvider } from '@/features/onboarding/onboarding-context';

export default function OnboardingLayout() {
  return (
    <OnboardingProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: tokens.color.background },
        }}
      />
    </OnboardingProvider>
  );
}
