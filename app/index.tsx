import { Redirect } from 'expo-router';
import { LoadingState, Screen } from '@/design-system/primitives';
import { useAuthSession } from '@/features/auth/useAuthSession';

export default function Index() {
  const { isLoaded, isSignedIn, onboardingCompleted, isLoadingBootstrap } = useAuthSession();

  if (!isLoaded || isLoadingBootstrap) {
    return (
      <Screen>
        <LoadingState label="Connecting to LUNQRA…" />
      </Screen>
    );
  }

  if (!isSignedIn) {
    return <Redirect href="/(auth)/welcome" />;
  }

  if (!onboardingCompleted) {
    return <Redirect href="/(onboarding)" />;
  }

  return <Redirect href="/(tabs)" />;
}
