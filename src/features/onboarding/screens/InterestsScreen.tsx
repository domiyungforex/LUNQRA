import React, { useState } from 'react';
import { StyleSheet, Pressable, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Button, Card, Heading, Input, Row, Screen, Stack, Text } from '@/design-system/primitives';
import { tokens as t } from '@/design-system/tokens';
import { useOnboardingDraft } from '../onboarding-context';
import { OnboardingProgressHeader } from '../components/OnboardingProgressHeader';

const DEFAULT_INTERESTS = [
  'Tech Startups',
  'Artificial Intelligence',
  'Creative Design',
  'Mobile Innovation',
  'Community Building',
  'Mentorship',
  'Freelance Projects',
  'Entrepreneurship',
  'Product Design',
  'Fintech',
  'Open Source',
  'Decentralized Systems',
];

export function InterestsScreen() {
  const router = useRouter();
  const { draft, updateDraft } = useOnboardingDraft();
  const [selected, setSelected] = useState<string[]>(
    draft.interests.length > 0 ? draft.interests : ['Tech Startups']
  );
  const [customInterest, setCustomInterest] = useState('');
  const [error, setError] = useState<string | null>(null);

  const toggleInterest = (item: string) => {
    setSelected(prev =>
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
    setError(null);
  };

  const addCustomInterest = (text?: string) => {
    const trimmed = (typeof text === 'string' ? text : customInterest).trim();
    if (trimmed && !selected.includes(trimmed)) {
      setSelected(prev => [...prev, trimmed]);
      setCustomInterest('');
      setError(null);
    }
  };

  const handleContinue = () => {
    if (selected.length === 0) {
      setError('Please select at least one interest to continue.');
      return;
    }
    updateDraft({ interests: selected });
    router.push('/(onboarding)/capabilities');
  };

  return (
    <Screen>
      <OnboardingProgressHeader currentStep={3} />

      <Stack style={styles.header}>
        <Heading style={styles.title} serif>What are your primary interests?</Heading>
        <Text tone="secondary" style={styles.subtitle}>
          Choose topics you care about to discover relevant intents and conversations.
        </Text>
      </Stack>

      <Card style={styles.cardContainer}>
        {error ? (
          <Text accessibilityRole="alert" style={styles.error}>
            {error}
          </Text>
        ) : null}

        <View style={styles.metaRow}>
          <Text style={styles.selectionCount}>
            {selected.length} {selected.length === 1 ? 'topic' : 'topics'} selected
          </Text>
        </View>

        <View style={styles.chipGrid}>
          {DEFAULT_INTERESTS.map(interest => {
            const isSelected = selected.includes(interest);
            return (
              <Pressable
                key={interest}
                accessibilityRole="button"
                accessibilityLabel={interest}
                accessibilityState={{ selected: isSelected }}
                onPress={() => toggleInterest(interest)}
                style={[styles.chip, isSelected ? styles.selectedChip : styles.unselectedChip]}
              >
                <Text style={[styles.chipText, isSelected ? styles.selectedChipText : styles.unselectedChipText]}>
                  {interest}
                </Text>
                {isSelected ? <Text style={styles.checkIcon}> ✓</Text> : null}
              </Pressable>
            );
          })}
        </View>

        <Row style={styles.customRow}>
          <View style={styles.customInputWrapper}>
            <Input
              label="Add custom interest"
              placeholder="e.g. Clean Energy"
              value={customInterest}
              onChangeText={setCustomInterest}
              onSubmitEditing={e => addCustomInterest(e.nativeEvent.text)}
            />
          </View>
          <Button
            label="Add"
            onPress={() => addCustomInterest()}
            disabled={!customInterest.trim()}
          />
        </Row>

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
  metaRow: {
    marginBottom: t.space.sm,
  },
  selectionCount: {
    fontSize: 12,
    fontWeight: t.weight.medium,
    color: t.color.brandPrimary,
  },
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: t.space.md,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: t.radius.pill,
    borderWidth: 1.5,
  },
  unselectedChip: {
    backgroundColor: t.color.surfaceMuted,
    borderColor: t.color.border,
  },
  selectedChip: {
    backgroundColor: 'rgba(212, 255, 50, 0.12)',
    borderColor: t.color.brandPrimary,
  },
  chipText: {
    fontSize: 13,
    fontWeight: t.weight.medium,
  },
  unselectedChipText: {
    color: t.color.textPrimary,
  },
  selectedChipText: {
    color: t.color.brandPrimary,
  },
  checkIcon: {
    color: t.color.brandPrimary,
    fontSize: 12,
    fontWeight: t.weight.bold,
  },
  customRow: {
    gap: t.space.sm,
    alignItems: 'flex-end',
    marginBottom: t.space.sm,
  },
  customInputWrapper: {
    flex: 1,
  },
  error: {
    color: t.color.danger,
    fontSize: 13,
    marginBottom: t.space.sm,
  },
  buttonWrapper: {
    marginTop: t.space.md,
  },
});
