import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { tokens as t } from '@/design-system/tokens';
import { Text } from '@/design-system/primitives';

interface OnboardingProgressHeaderProps {
  currentStep: number;
  totalSteps?: number;
  canGoBack?: boolean;
}

export function OnboardingProgressHeader({
  currentStep,
  totalSteps = 6,
  canGoBack = true,
}: OnboardingProgressHeaderProps) {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        {canGoBack && currentStep > 1 ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go back"
            onPress={() => router.back()}
            style={styles.backButton}
            hitSlop={12}
          >
            <Text style={styles.backText}>← Back</Text>
          </Pressable>
        ) : (
          <View style={styles.brandContainer}>
            <Text style={styles.brandTitle}>L U N Q R A</Text>
          </View>
        )}

        <Text style={styles.stepIndicator}>
          Step {currentStep} of {totalSteps}
        </Text>
      </View>

      {/* Segmented Progress Bar */}
      <View style={styles.progressBar}>
        {Array.from({ length: totalSteps }).map((_, index) => {
          const stepNum = index + 1;
          const isCompleted = stepNum < currentStep;
          const isCurrent = stepNum === currentStep;

          return (
            <View
              key={stepNum}
              style={[
                styles.segment,
                isCompleted && styles.segmentCompleted,
                isCurrent && styles.segmentCurrent,
              ]}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: t.space.md,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: t.space.sm,
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandTitle: {
    fontSize: 11,
    letterSpacing: 2,
    fontWeight: t.weight.bold,
    color: t.color.textMuted,
  },
  backButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: t.radius.pill,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  backText: {
    fontSize: 12,
    fontWeight: t.weight.medium,
    color: t.color.textSecondary,
  },
  stepIndicator: {
    fontSize: 11,
    fontWeight: t.weight.bold,
    color: t.color.brandPrimary,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  progressBar: {
    flexDirection: 'row',
    gap: 6,
    height: 4,
    width: '100%',
  },
  segment: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  segmentCompleted: {
    backgroundColor: t.color.brandPrimary,
    opacity: 0.6,
  },
  segmentCurrent: {
    backgroundColor: t.color.brandPrimary,
    shadowColor: t.color.brandPrimary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 3,
  },
});
