import { StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Button, Card, Heading, Screen, Stack, Text } from '@/design-system/primitives';
import { tokens as t } from '@/design-system/tokens';
import { useAuthSession } from '@/features/auth/useAuthSession';

export default function OnboardingIndex() {
  const router = useRouter();
  const { internalUser, profile, signOut } = useAuthSession();

  return (
    <Screen>
      <Text style={styles.brand}>LUNQRA</Text>

      <Stack style={styles.header}>
        <Heading style={styles.title}>Welcome to LUNQRA</Heading>
        <Text tone="secondary">
          Your account is authenticated and your internal profile is initialized.
        </Text>
      </Stack>

      <Card>
        <Heading>Profile Setup</Heading>
        <Text tone="secondary">
          Display name: {profile?.display_name || 'Not set'}
        </Text>
        <Text tone="secondary">
          Username: {profile?.username || 'Not set'}
        </Text>
        <Text tone="muted">
          Internal ID: {internalUser?.id || 'Pending bootstrap'}
        </Text>
        <Text tone="muted">
          Comprehensive onboarding (usage mode, skills, interests, location) will be completed in Phase 2.
        </Text>

        <Button
          label="Proceed to Home"
          onPress={() => router.replace('/(tabs)')}
        />
        <Button
          label="Sign out"
          onPress={async () => {
            await signOut();
            router.replace('/(auth)/welcome');
          }}
        />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  brand: {
    fontSize: t.type.caption,
    fontWeight: t.weight.bold,
    color: t.color.brandPrimary,
    letterSpacing: 1.5,
  },
  header: {
    paddingVertical: t.space.lg,
    gap: t.space.xs,
  },
  title: {
    fontSize: t.type.title,
    lineHeight: t.lineHeight.title,
  },
});
