import { useState } from 'react';
import { StyleSheet, Pressable, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Button, Card, Heading, Input, Row, Screen, Stack, Text } from '@/design-system/primitives';
import { tokens as t } from '@/design-system/tokens';
import { useOnboardingDraft } from '../onboarding-context';

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
  const [selected, setSelected] = useState<string[]>(draft.interests.length > 0 ? draft.interests : ['Tech Startups']);
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
      <Text style={styles.stepIndicator}>Step 3 of 6</Text>

      <Stack style={styles.header}>
        <Heading style={styles.title}>What are your primary interests?</Heading>
        <Text tone="secondary">
          Choose topics you care about to discover relevant intents and conversations.
        </Text>
      </Stack>

      <Card>
        {error ? (
          <Text accessibilityRole="alert" style={styles.error}>
            {error}
          </Text>
        ) : null}

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
                style={[styles.chip, isSelected ? styles.selectedChip : undefined]}
              >
                <Text style={[styles.chipText, isSelected ? styles.selectedChipText : undefined]}>
                  {interest}
                </Text>
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
          <Button label="Add" onPress={() => addCustomInterest()} disabled={!customInterest.trim()} />
        </Row>

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
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: t.space.sm,
    marginVertical: t.space.md,
  },
  chip: {
    paddingVertical: t.space.sm,
    paddingHorizontal: t.space.md,
    borderRadius: t.radius.pill,
    backgroundColor: t.color.surfaceMuted,
    borderWidth: 1,
    borderColor: t.color.border,
  },
  selectedChip: {
    backgroundColor: t.color.brandPrimary,
    borderColor: t.color.brandPrimary,
  },
  chipText: {
    fontSize: t.type.caption,
    color: t.color.textPrimary,
    fontWeight: t.weight.medium,
  },
  selectedChipText: {
    color: t.color.textInverse,
  },
  customRow: {
    gap: t.space.sm,
    alignItems: 'flex-end',
    marginBottom: t.space.md,
  },
  customInputWrapper: {
    flex: 1,
  },
  error: {
    color: t.color.danger,
    fontSize: t.type.caption,
  },
});
