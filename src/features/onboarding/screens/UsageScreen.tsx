import { StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Button, Card, Heading, Screen, Stack, Text } from '@/design-system/primitives';
import { tokens as t } from '@/design-system/tokens';
import { useOnboardingDraft } from '../onboarding-context';
import { USAGE_MODES, type UsageMode } from '../types';

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
      <Text style={styles.stepIndicator}>Step 1 of 6</Text>

      <Stack style={styles.header}>
        <Heading style={styles.title}>How do you plan to use LUNQRA?</Heading>
        <Text tone="secondary">
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
              <Card style={[styles.card, selected ? styles.selectedCard : undefined]}>
                <Stack style={styles.cardHeader}>
                  <Heading style={styles.cardTitle}>{mode.title}</Heading>
                  {selected ? <Text style={styles.selectedBadge}>Selected</Text> : null}
                </Stack>
                <Text tone="secondary">{mode.description}</Text>
              </Card>
            </Pressable>
          );
        })}
      </Stack>

      <Button label="Continue" onPress={handleContinue} />
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
  optionsList: {
    gap: t.space.md,
    marginVertical: t.space.md,
  },
  card: {
    borderWidth: 1.5,
    borderColor: t.color.border,
  },
  selectedCard: {
    borderColor: t.color.brandPrimary,
    backgroundColor: '#F0F3FF',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: t.type.body,
    fontWeight: t.weight.bold,
  },
  selectedBadge: {
    fontSize: t.type.caption,
    fontWeight: t.weight.bold,
    color: t.color.brandPrimary,
  },
});
