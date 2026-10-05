import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Button, Card, Heading, Screen, Stack, Text } from '@/design-system/primitives';
import { tokens as t } from '@/design-system/tokens';
import { useSupabase } from '@/lib/useSupabase';
import { useAuthSession } from '@/features/auth/useAuthSession';
import { useOnboardingDraft } from '../onboarding-context';
import { completeOnboarding } from '../onboarding-service';
import { OnboardingProgressHeader } from '../components/OnboardingProgressHeader';
import { SparklesIcon } from '@/design-system/icons';

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
      <OnboardingProgressHeader currentStep={6} />

      <Stack style={styles.header}>
        <Heading style={styles.title} serif>Meet your LUNQRA Agent</Heading>
        <Text tone="secondary" style={styles.subtitle}>
          Your personal AI orchestrator across ATEM’s Human Intent Network.
        </Text>
      </Stack>

      {/* Futuristic Agent Showcase Card */}
      <Card style={styles.agentCard}>
        <View style={styles.agentBadgeRow}>
          <View style={styles.agentIconCircle}>
            <SparklesIcon size={24} color={t.color.brandPrimary} />
          </View>
          <View style={styles.agentBadgeMeta}>
            <Text style={styles.agentStatusText}>● ACTIVE & READY</Text>
            <Heading style={styles.agentHeading}>LUNQRA Autonomous Node</Heading>
          </View>
        </View>

        <Stack style={styles.featureList}>
          <View style={styles.featureItem}>
            <View style={styles.bulletDot} />
            <View style={styles.featureContent}>
              <Heading style={styles.itemTitle}>Intent Parsing</Heading>
              <Text tone="secondary" style={styles.itemDesc}>
                Express your needs naturally: &ldquo;I need a React Native dev in Lagos.&rdquo; Your agent extracts structured criteria automatically.
              </Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <View style={styles.bulletDot} />
            <View style={styles.featureContent}>
              <Heading style={styles.itemTitle}>Autonomous Discovery</Heading>
              <Text tone="secondary" style={styles.itemDesc}>
                Finds relevant people, services, communities, and opportunities without endless manual searching.
              </Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <View style={styles.bulletDot} />
            <View style={styles.featureContent}>
              <Heading style={styles.itemTitle}>Strict Safety & Privacy</Heading>
              <Text tone="secondary" style={styles.itemDesc}>
                Sensitive actions (sending messages, payments) require your explicit approval. Every action is recorded and fully auditable.
              </Text>
            </View>
          </View>
        </Stack>
      </Card>

      {/* Summary Tag */}
      <View style={styles.summaryBox}>
        <Text style={styles.summaryLabel}>SETUP READY FOR</Text>
        <Text style={styles.summaryValue}>
          {draft.displayName || 'Alex'} • {draft.usageMode.toUpperCase()}
        </Text>
      </View>

      {error ? (
        <Card style={styles.errorCard}>
          <Text accessibilityRole="alert" style={styles.errorText}>
            {error}
          </Text>
        </Card>
      ) : null}

      <View style={styles.buttonWrapper}>
        <Button
          label="Complete setup & enter LUNQRA"
          onPress={() => {
            void handleFinish();
          }}
          loading={submitting}
          disabled={submitting}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingVertical: t.space.sm,
    gap: t.space.xs,
  },
  title: {
    fontSize: 28,
    lineHeight: 34,
    color: t.color.textPrimary,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: t.color.textSecondary,
  },
  agentCard: {
    backgroundColor: t.color.surface,
    borderColor: t.color.brandPrimary,
    borderWidth: 1.5,
    borderRadius: t.radius.md,
    padding: t.space.md,
    marginVertical: t.space.sm,
  },
  agentBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: t.space.md,
    paddingBottom: t.space.md,
    borderBottomWidth: 1,
    borderBottomColor: t.color.border,
  },
  agentIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(212, 255, 50, 0.12)',
    borderWidth: 1,
    borderColor: t.color.brandPrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  agentBadgeMeta: {
    flex: 1,
  },
  agentStatusText: {
    fontSize: 10,
    fontWeight: t.weight.bold,
    color: t.color.brandPrimary,
    letterSpacing: 1.5,
  },
  agentHeading: {
    fontSize: 16,
    fontWeight: t.weight.bold,
    color: t.color.textPrimary,
    marginTop: 2,
  },
  featureList: {
    gap: t.space.md,
    marginTop: t.space.md,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: t.space.sm,
  },
  bulletDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: t.color.brandPrimary,
    marginTop: 7,
  },
  featureContent: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: t.weight.bold,
    color: t.color.textPrimary,
    marginBottom: 2,
  },
  itemDesc: {
    fontSize: 13,
    lineHeight: 18,
  },
  summaryBox: {
    padding: t.space.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: t.radius.sm,
    borderWidth: 1,
    borderColor: t.color.border,
    alignItems: 'center',
    marginVertical: t.space.xs,
  },
  summaryLabel: {
    fontSize: 10,
    fontWeight: t.weight.bold,
    letterSpacing: 1,
    color: t.color.textMuted,
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: t.weight.medium,
    color: t.color.textSecondary,
    marginTop: 2,
  },
  errorCard: {
    borderColor: t.color.danger,
    marginVertical: t.space.sm,
    padding: t.space.sm,
  },
  errorText: {
    color: t.color.danger,
    fontSize: 13,
  },
  buttonWrapper: {
    marginTop: t.space.md,
    marginBottom: t.space.xl,
  },
});
