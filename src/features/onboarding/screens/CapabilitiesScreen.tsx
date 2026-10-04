import { useState } from 'react';
import { StyleSheet, Pressable, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Button, Card, Heading, Input, Row, Screen, Stack, Text } from '@/design-system/primitives';
import { tokens as t } from '@/design-system/tokens';
import { useOnboardingDraft } from '../onboarding-context';

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
  const [selected, setSelected] = useState<string[]>(draft.skills.length > 0 ? draft.skills : ['React Native']);
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
      <Text style={styles.stepIndicator}>Step 4 of 6</Text>

      <Stack style={styles.header}>
        <Heading style={styles.title}>What are your key capabilities?</Heading>
        <Text tone="secondary">
          Highlight skills so the intent matching engine can find you when members express needs.
        </Text>
      </Stack>

      <Card>
        {error ? (
          <Text accessibilityRole="alert" style={styles.error}>
            {error}
          </Text>
        ) : null}

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
                style={[styles.chip, isSelected ? styles.selectedChip : undefined]}
              >
                <Text style={[styles.chipText, isSelected ? styles.selectedChipText : undefined]}>
                  {skill}
                </Text>
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
          <Button label="Add" onPress={() => addCustomSkill()} disabled={!customSkill.trim()} />
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
