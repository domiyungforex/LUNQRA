import React, { useState } from 'react';
import { StyleSheet, Pressable, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Button, Card, Heading, Input, Screen, Stack, Text } from '@/design-system/primitives';
import { tokens as t } from '@/design-system/tokens';
import { useOnboardingDraft } from '../onboarding-context';
import { OnboardingProgressHeader } from '../components/OnboardingProgressHeader';

const REMOTE_OPTIONS: { id: 'remote' | 'hybrid' | 'in_person' | 'any'; label: string; desc: string }[] = [
  { id: 'any', label: 'Open to all', desc: 'Available for both remote and in-person collaborations' },
  { id: 'remote', label: 'Remote only', desc: 'Prefer exclusively digital and distributed engagements' },
  { id: 'hybrid', label: 'Hybrid', desc: 'Flexible between remote work and localized meetups' },
  { id: 'in_person', label: 'In-person only', desc: 'Focus strictly on physical, local opportunities' },
];

export function LocationScreen() {
  const router = useRouter();
  const { draft, updateDraft } = useOnboardingDraft();
  const [location, setLocation] = useState(draft.location || '');
  const [remotePreference, setRemotePreference] = useState(draft.remotePreference || 'any');
  const [error, setError] = useState<string | null>(null);

  const handleContinue = () => {
    if (!location.trim()) {
      setError('Please enter your primary city or region.');
      return;
    }
    updateDraft({
      location: location.trim(),
      remotePreference,
    });
    router.push('/(onboarding)/agent');
  };

  return (
    <Screen>
      <OnboardingProgressHeader currentStep={5} />

      <Stack style={styles.header}>
        <Heading style={styles.title} serif>Location & availability</Heading>
        <Text tone="secondary" style={styles.subtitle}>
          Help the matching engine connect you with opportunities locally or globally.
        </Text>
      </Stack>

      <Card style={styles.cardContainer}>
        <Input
          label="Your primary location *"
          placeholder="e.g. Lagos, Nigeria or London, UK"
          value={location}
          onChangeText={text => {
            setLocation(text);
            setError(null);
          }}
          error={error ?? undefined}
        />

        <Stack style={styles.remoteSection}>
          <Text style={styles.sectionLabel}>Work & Collaboration Style</Text>
          {REMOTE_OPTIONS.map(opt => {
            const isSelected = remotePreference === opt.id;
            return (
              <Pressable
                key={opt.id}
                accessibilityRole="button"
                accessibilityLabel={`${opt.label}: ${opt.desc}`}
                accessibilityState={{ selected: isSelected }}
                onPress={() => setRemotePreference(opt.id)}
              >
                <Card style={[styles.optionCard, isSelected ? styles.selectedCard : styles.unselectedCard]}>
                  <View style={styles.optionHeader}>
                    <Heading style={[styles.optionLabel, isSelected ? styles.selectedOptionLabel : undefined]}>
                      {opt.label}
                    </Heading>
                    {isSelected ? (
                      <View style={styles.selectedBadge}>
                        <Text style={styles.selectedBadgeText}>Selected</Text>
                      </View>
                    ) : (
                      <View style={styles.radioDot} />
                    )}
                  </View>
                  <Text tone="secondary" style={styles.optionDesc}>
                    {opt.desc}
                  </Text>
                </Card>
              </Pressable>
            );
          })}
        </Stack>

        <View style={styles.buttonWrapper}>
          <Button label="Continue" onPress={handleContinue} />
        </View>
      </Card>
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
  cardContainer: {
    marginVertical: t.space.sm,
    backgroundColor: t.color.surface,
    borderColor: t.color.border,
    borderRadius: t.radius.md,
    padding: t.space.md,
  },
  remoteSection: {
    gap: t.space.sm,
    marginVertical: t.space.md,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: t.weight.bold,
    color: t.color.textPrimary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: t.space.xs,
  },
  optionCard: {
    borderWidth: 1.5,
    borderRadius: t.radius.md,
    padding: t.space.md,
  },
  unselectedCard: {
    borderColor: t.color.border,
    backgroundColor: t.color.surfaceElevated,
  },
  selectedCard: {
    borderColor: t.color.brandPrimary,
    backgroundColor: 'rgba(212, 255, 50, 0.06)',
  },
  optionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  optionLabel: {
    fontSize: 15,
    fontWeight: t.weight.bold,
    color: t.color.textPrimary,
  },
  selectedOptionLabel: {
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
  optionDesc: {
    fontSize: 13,
    lineHeight: 18,
  },
  buttonWrapper: {
    marginTop: t.space.sm,
  },
});
