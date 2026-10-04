import { StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Button, Card, Heading, Screen, Stack, Text } from '@/design-system/primitives';
import { tokens as t } from '@/design-system/tokens';

export function WelcomeScreen() {
  const router = useRouter();

  return (
    <Screen>
      <Text style={styles.brand}>LUNQRA</Text>

      <Stack style={styles.hero}>
        <Heading style={styles.promise}>Say what you need.</Heading>
        <Text tone="secondary" style={styles.subhead}>
          Find who or what can make it happen.
        </Text>
      </Stack>

      <Card style={styles.featureCard}>
        <Stack style={styles.featureStack}>
          <Stack style={styles.featureItem}>
            <Heading style={styles.featureTitle}>Human Intent Network</Heading>
            <Text tone="secondary">
              Describe your project, need, or offer naturally. LUNQRA parses and matches you with verified talent and opportunities.
            </Text>
          </Stack>

          <Stack style={styles.featureItem}>
            <Heading style={styles.featureTitle}>Verified Connections</Heading>
            <Text tone="secondary">
              Move seamlessly from intent to realtime conversation, outcome, and reputation.
            </Text>
          </Stack>
        </Stack>
      </Card>

      <Stack style={styles.actions}>
        <Button
          label="Create an account"
          onPress={() => router.push('/(auth)/sign-up')}
        />
        <Button
          label="Sign in"
          onPress={() => router.push('/(auth)/sign-in')}
        />
      </Stack>

      <Text tone="muted" style={styles.footer}>
        A human intent network by ATEM
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  brand: {
    fontSize: t.type.title,
    fontWeight: t.weight.bold,
    color: t.color.brandPrimary,
    letterSpacing: 1.5,
  },
  hero: {
    paddingVertical: t.space.xl,
    gap: t.space.sm,
  },
  promise: {
    fontSize: t.type.display,
    lineHeight: t.lineHeight.display,
  },
  subhead: {
    fontSize: t.type.body,
    lineHeight: t.lineHeight.body,
  },
  featureCard: {
    backgroundColor: t.color.surface,
  },
  featureStack: {
    gap: t.space.lg,
  },
  featureItem: {
    gap: t.space.xs,
  },
  featureTitle: {
    fontSize: t.type.body,
    fontWeight: t.weight.bold,
  },
  actions: {
    gap: t.space.md,
    marginTop: t.space.lg,
  },
  footer: {
    marginTop: 'auto',
    paddingTop: t.space.xl,
    fontSize: t.type.caption,
    textAlign: 'center',
  },
});
