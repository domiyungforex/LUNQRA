import { useState } from 'react';
import { StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Button, Card, Heading, Screen, Stack, Text } from '@/design-system/primitives';
import { tokens as t } from '@/design-system/tokens';
import { useSupabase } from '@/lib/useSupabase';
import { useAuthSession } from '@/features/auth/useAuthSession';
import { useOnboardingDraft } from '../onboarding-context';
import { completeOnboarding } from '../onboarding-service';

export function AgentIntroScreen() {
  const router = useRouter();
  const supabase = useSupabase();
  const { internalUser, profile, userId, refetchSession } = useAuthSession();
  const { draft } = useOnboardingDraft();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFinish = async () => {
    const profileId = profile?.id ?? internalUser?.id ?? userId;
    if (!profileId) {
      setError('Profile information is missing. Please restart onboarding.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      if (supabase) {
        await completeOnboarding(supabase, profileId, draft);
      }
      refetchSession();
      router.replace('/(tabs)');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to complete profile setup.';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Screen>
      <Text style={styles.stepIndicator}>Step 6 of 6</Text>

      <Stack style={styles.header}>
        <Heading style={styles.title}>Meet your LUNQRA Agent</Heading>
        <Text tone="secondary">
          Your personal assistant across ATEM’s Human Intent Network.
        </Text>
      </Stack>

      <Card style={styles.agentCard}>
        <Heading style={styles.agentHeading}>How your agent works for you</Heading>
        <Stack style={styles.featureList}>
          <Stack style={styles.featureItem}>
            <Heading style={styles.itemTitle}>Intent Parsing</Heading>
            <Text tone="secondary">
              Express your needs naturally: &ldquo;I need a React Native dev in Lagos.&rdquo; Your agent extracts structured criteria automatically.
            </Text>
          </Stack>

          <Stack style={styles.featureItem}>
            <Heading style={styles.itemTitle}>Autonomous Discovery</Heading>
            <Text tone="secondary">
              Finds relevant people, services, communities, and opportunities without endless manual searching.
            </Text>
          </Stack>

          <Stack style={styles.featureItem}>
            <Heading style={styles.itemTitle}>Strict Safety & Privacy</Heading>
            <Text tone="secondary">
              Sensitive actions (sending messages, payments) require your explicit approval. Every action is recorded and fully auditable.
            </Text>
          </Stack>
        </Stack>
      </Card>

      {error ? (
        <Card style={styles.errorCard}>
          <Text accessibilityRole="alert" style={styles.errorText}>
            {error}
          </Text>
        </Card>
      ) : null}

      <Button
        label="Complete setup & enter LUNQRA"
        onPress={() => {
          void handleFinish();
        }}
        loading={submitting}
        disabled={submitting}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  stepIndicator: {
    fontSize: t.type.caption,
    fontWeight: t.weight.medium,
    color: t.color.brandPrimary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  header: {
    paddingVertical: t.space.md,
    gap: t.space.xs,
  },
  title: {
    fontSize: t.type.title,
    lineHeight: t.lineHeight.title,
  },
  agentCard: {
    backgroundColor: t.color.surface,
    borderColor: t.color.brandPrimary,
    borderWidth: 1.5,
    marginBottom: t.space.md,
  },
  agentHeading: {
    fontSize: t.type.body,
    fontWeight: t.weight.bold,
    color: t.color.brandPrimary,
  },
  featureList: {
    gap: t.space.md,
    marginTop: t.space.sm,
  },
  featureItem: {
    gap: t.space.xs,
  },
  itemTitle: {
    fontSize: t.type.body,
    fontWeight: t.weight.bold,
  },
  errorCard: {
    borderColor: t.color.danger,
    marginBottom: t.space.md,
  },
  errorText: {
    color: t.color.danger,
    fontSize: t.type.caption,
  },
});
