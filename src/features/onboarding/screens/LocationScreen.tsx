import { useState } from 'react';
import { StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Button, Card, Heading, Input, Screen, Stack, Text } from '@/design-system/primitives';
import { tokens as t } from '@/design-system/tokens';
import { useOnboardingDraft } from '../onboarding-context';

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
      <Text style={styles.stepIndicator}>Step 5 of 6</Text>

      <Stack style={styles.header}>
        <Heading style={styles.title}>Location & availability</Heading>
        <Text tone="secondary">
          Help the matching engine connect you with opportunities locally or globally.
        </Text>
      </Stack>

      <Card>
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
                <Card style={[styles.optionCard, isSelected ? styles.selectedCard : undefined]}>
                  <Heading style={styles.optionLabel}>{opt.label}</Heading>
                  <Text tone="secondary">{opt.desc}</Text>
                </Card>
              </Pressable>
            );
          })}
        </Stack>

        <Button label="Continue" onPress={handleContinue} />
      </Card>
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
  remoteSection: {
    gap: t.space.sm,
    marginVertical: t.space.md,
  },
  sectionLabel: {
    fontWeight: t.weight.medium,
    color: t.color.textPrimary,
  },
  optionCard: {
    borderWidth: 1.5,
    borderColor: t.color.border,
    padding: t.space.md,
  },
  selectedCard: {
    borderColor: t.color.brandPrimary,
    backgroundColor: '#F0F3FF',
  },
  optionLabel: {
    fontSize: t.type.body,
    fontWeight: t.weight.bold,
  },
});
