import { StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Button, Card, Heading, Screen, Stack, Text } from '@/design-system/primitives';
import { tokens as t } from '@/design-system/tokens';
import { useAuthSession } from '@/features/auth/useAuthSession';

export default function HomeScreen() {
  const router = useRouter();
  const { profile, internalUser, signOut } = useAuthSession();

  return (
    <Screen>
      <Text style={styles.brand}>LUNQRA</Text>

      <Stack style={styles.header}>
        <Heading style={styles.prompt}>What do you need?</Heading>
        <Text tone="secondary">
          Find who or what can make it happen.
        </Text>
      </Stack>

      <Card>
        <Heading>Active Intent Network</Heading>
        <Text tone="secondary">
          Connected as {profile?.display_name || profile?.username || 'User'}
        </Text>
        <Text tone="muted">
          Internal ID: {internalUser?.id || 'Pending'}
        </Text>
        <Text tone="muted">
          Home feed, people discovery, and intent publishing will expand in subsequent phases.
        </Text>

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
  prompt: {
    fontSize: t.type.display,
    lineHeight: t.lineHeight.display,
  },
});
