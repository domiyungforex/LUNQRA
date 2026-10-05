import React from 'react';
import { StyleSheet, Pressable, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Button, Card, Heading, Screen, Stack, Text } from '@/design-system/primitives';
import { tokens as t } from '@/design-system/tokens';
import { useOnboardingDraft } from '../onboarding-context';
import { USAGE_MODES, type UsageMode } from '../types';
import { OnboardingProgressHeader } from '../components/OnboardingProgressHeader';

export function UsageScreen() {
  const router = useRouter();
  const { draft, updateDraft } = useOnboardingDraft();

  const handleSelect = (mode: UsageMode) => {
    updateDraft({ usageMode: mode });
  };

  const handleContinue = () => {
    router.push('/(onboarding)/profile');
  };

  return (
    <Screen>
      <OnboardingProgressHeader currentStep={1} canGoBack={false} />

      <Stack style={styles.header}>
        <Heading style={styles.title} serif>How do you plan to use LUNQRA?</Heading>
        <Text tone="secondary" style={styles.subtitle}>
          This personalizes your recommendations. You can participate in all modes anytime.
        </Text>
      </Stack>

      <Stack style={styles.optionsList}>
        {USAGE_MODES.map(mode => {
          const selected = draft.usageMode === mode.id;
          return (
            <Pressable
              key={mode.id}
              accessibilityRole="button"
              accessibilityLabel={`${mode.title}: ${mode.description}`}
              accessibilityState={{ selected }}
              onPress={() => handleSelect(mode.id)}
            >
              <Card style={[styles.card, selected ? styles.selectedCard : styles.unselectedCard]}>
                <View style={styles.cardHeader}>
                  <Heading style={[styles.cardTitle, selected ? styles.selectedCardTitle : undefined]}>
                    {mode.title}
                  </Heading>
                  {selected ? (
                    <View style={styles.selectedBadge}>
                      <Text style={styles.selectedBadgeText}>Selected</Text>
                    </View>
                  ) : (
                    <View style={styles.radioDot} />
                  )}
                </View>
                <Text tone="secondary" style={styles.cardDesc}>
                  {mode.description}
                </Text>
              </Card>
            </Pressable>
          );
        })}
      </Stack>

      <View style={styles.buttonWrapper}>
        <Button label="Continue" onPress={handleContinue} />
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
  optionsList: {
    gap: t.space.sm,
    marginVertical: t.space.md,
  },
  card: {
    padding: t.space.md,
    borderRadius: t.radius.md,
    borderWidth: 1.5,
  },
  unselectedCard: {
    borderColor: t.color.border,
    backgroundColor: t.color.surface,
  },
  selectedCard: {
    borderColor: t.color.brandPrimary,
    backgroundColor: 'rgba(212, 255, 50, 0.06)',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: t.weight.bold,
    color: t.color.textPrimary,
  },
  selectedCardTitle: {
    color: t.color.brandPrimary,
  },
  radioDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: t.color.borderStrong,
  },
  selectedBadge: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: t.radius.pill,
    backgroundColor: 'rgba(212, 255, 50, 0.15)',
    borderWidth: 1,
    borderColor: t.color.brandPrimary,
  },
  selectedBadgeText: {
    fontSize: 11,
    fontWeight: t.weight.bold,
    color: t.color.brandPrimary,
    letterSpacing: 0.5,
  },
  cardDesc: {
    fontSize: 13,
    lineHeight: 18,
  },
  buttonWrapper: {
    marginTop: t.space.md,
    marginBottom: t.space.xl,
  },
});
