import React, { useState } from 'react';
import { StyleSheet, Pressable, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Button, Card, Heading, Input, Row, Screen, Stack, Text } from '@/design-system/primitives';
import { tokens as t } from '@/design-system/tokens';
import { useOnboardingDraft } from '../onboarding-context';
import { OnboardingProgressHeader } from '../components/OnboardingProgressHeader';

const DEFAULT_CAPABILITIES = [
  'React Native',
  'TypeScript',
  'UI/UX Design',
  'Backend Architecture',
  'Product Management',
  'Machine Learning',
  'Content Strategy',
  'Business Development',
  'DevOps & Cloud',
  'Full Stack Engineering',
  'Project Management',
  'Community Management',
];

export function CapabilitiesScreen() {
  const router = useRouter();
  const { draft, updateDraft } = useOnboardingDraft();
  const [selected, setSelected] = useState<string[]>(
    draft.skills.length > 0 ? draft.skills : ['React Native']
  );
  const [customSkill, setCustomSkill] = useState('');
  const [error, setError] = useState<string | null>(null);

  const toggleSkill = (item: string) => {
    setSelected(prev =>
      prev.includes(item) ? prev.filter(s => s !== item) : [...prev, item]
    );
    setError(null);
  };

  const addCustomSkill = (text?: string) => {
    const trimmed = (typeof text === 'string' ? text : customSkill).trim();
    if (trimmed && !selected.includes(trimmed)) {
      setSelected(prev => [...prev, trimmed]);
      setCustomSkill('');
      setError(null);
    }
  };

  const handleContinue = () => {
    if (selected.length === 0) {
      setError('Please select or add at least one capability to continue.');
      return;
    }
    updateDraft({ skills: selected });
    router.push('/(onboarding)/location');
  };

  return (
    <Screen>
      <OnboardingProgressHeader currentStep={4} />

      <Stack style={styles.header}>
        <Heading style={styles.title} serif>What are your key capabilities?</Heading>
        <Text tone="secondary" style={styles.subtitle}>
          Highlight skills so the intent matching engine can find you when members express needs.
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
            {selected.length} {selected.length === 1 ? 'skill' : 'skills'} selected
          </Text>
        </View>

        <View style={styles.chipGrid}>
          {DEFAULT_CAPABILITIES.map(skill => {
            const isSelected = selected.includes(skill);
            return (
              <Pressable
                key={skill}
                accessibilityRole="button"
                accessibilityLabel={skill}
                accessibilityState={{ selected: isSelected }}
                onPress={() => toggleSkill(skill)}
                style={[styles.chip, isSelected ? styles.selectedChip : styles.unselectedChip]}
              >
                <Text style={[styles.chipText, isSelected ? styles.selectedChipText : styles.unselectedChipText]}>
                  {skill}
                </Text>
                {isSelected ? <Text style={styles.checkIcon}> ✓</Text> : null}
              </Pressable>
            );
          })}
        </View>

        <Row style={styles.customRow}>
          <View style={styles.customInputWrapper}>
            <Input
              label="Add custom skill or capability"
              placeholder="e.g. Postgres RLS"
              value={customSkill}
              onChangeText={setCustomSkill}
              onSubmitEditing={e => addCustomSkill(e.nativeEvent.text)}
            />
          </View>
          <Button
            label="Add"
            onPress={() => addCustomSkill()}
            disabled={!customSkill.trim()}
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
