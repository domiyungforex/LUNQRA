import { Redirect } from 'expo-router';
import { LoadingState, Screen } from '@/design-system/primitives';
import { useAuthSession } from '@/features/auth/useAuthSession';

export default function Index() {
  const { isLoaded, isSignedIn, onboardingCompleted, isLoadingBootstrap } = useAuthSession();

  // Wait for both Clerk auth and Supabase bootstrap to finish
  // This prevents a brief flash back to sign-in right after OTP verification
  if (!isLoaded) {
    return (
      <Screen>
        <LoadingState label="Loading…" />
      </Screen>
    );
  }

  if (!isSignedIn) {
    return <Redirect href="/(auth)/welcome" />;
  }

  // isSignedIn=true but bootstrap still running — show loading, do not redirect yet
  if (isLoadingBootstrap) {
    return (
      <Screen>
        <LoadingState label="Connecting to LUNQRA…" />
      </Screen>
    );
  }

  if (!onboardingCompleted) {
    return <Redirect href="/(onboarding)/usage" />;
  }

  return <Redirect href="/(tabs)" />;
}
