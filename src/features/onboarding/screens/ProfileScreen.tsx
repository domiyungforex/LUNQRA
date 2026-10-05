import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Card, Heading, Input, Screen, Stack, Text, TextArea } from '@/design-system/primitives';
import { tokens as t } from '@/design-system/tokens';
import { useOnboardingDraft } from '../onboarding-context';
import { profileInfoSchema, type ProfileInfoFormValues } from '../types';
import { OnboardingProgressHeader } from '../components/OnboardingProgressHeader';

export function ProfileScreen() {
  const router = useRouter();
  const { draft, updateDraft } = useOnboardingDraft();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileInfoFormValues>({
    resolver: zodResolver(profileInfoSchema),
    defaultValues: {
      displayName: draft.displayName,
      username: draft.username,
      bio: draft.bio,
      occupation: draft.occupation,
      organization: draft.organization,
      location: draft.location,
      website: draft.website,
    },
  });

  const onSubmit = (values: ProfileInfoFormValues) => {
    updateDraft({
      displayName: values.displayName,
      username: values.username,
      bio: values.bio,
      occupation: values.occupation,
      organization: values.organization,
      location: values.location,
      website: values.website,
    });
    router.push('/(onboarding)/interests');
  };

  return (
    <Screen>
      <OnboardingProgressHeader currentStep={2} />

      <Stack style={styles.header}>
        <Heading style={styles.title} serif>Create your public profile</Heading>
        <Text tone="secondary" style={styles.subtitle}>
          This represents your presence across the intent network.
        </Text>
      </Stack>

      {/* Avatar preview icon */}
      <View style={styles.avatarRow}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarInitials}>
            {(draft.displayName || 'Alex').slice(0, 2).toUpperCase()}
          </Text>
        </View>
        <View style={styles.avatarMeta}>
          <Text style={styles.avatarTitle}>Network Identity</Text>
          <Text tone="secondary" style={styles.avatarHint}>
            Your persona is visible to matching peers.
          </Text>
        </View>
      </View>

      <Card style={styles.formCard}>
        <Controller
          control={control}
          name="displayName"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Full name or display name *"
              placeholder="e.g. Alex Morgan"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.displayName?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="username"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Username *"
              placeholder="alexmorgan"
              autoCapitalize="none"
              autoCorrect={false}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.username?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="occupation"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Headline or title"
              placeholder="e.g. Senior Mobile Engineer"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.occupation?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="organization"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Organization or affiliation"
              placeholder="e.g. ATEM Labs"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.organization?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="bio"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextArea
              label="Short bio"
              placeholder="Tell the network about what you do, build, or seek."
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.bio?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="website"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Portfolio or website"
              placeholder="https://example.com"
              autoCapitalize="none"
              keyboardType="url"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.website?.message}
            />
          )}
        />

        <View style={styles.buttonWrapper}>
          <Button
            label="Continue"
            onPress={() => {
              void handleSubmit(onSubmit)();
            }}
          />
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
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: t.space.md,
    marginVertical: t.space.sm,
    padding: t.space.md,
    backgroundColor: t.color.surface,
    borderRadius: t.radius.md,
    borderWidth: 1,
    borderColor: t.color.border,
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(212, 255, 50, 0.15)',
    borderWidth: 1.5,
    borderColor: t.color.brandPrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: {
    fontSize: 18,
    fontWeight: t.weight.bold,
    color: t.color.brandPrimary,
  },
  avatarMeta: {
    flex: 1,
  },
  avatarTitle: {
    fontSize: 14,
    fontWeight: t.weight.bold,
    color: t.color.textPrimary,
  },
  avatarHint: {
    fontSize: 12,
    marginTop: 2,
  },
  formCard: {
    marginVertical: t.space.sm,
    backgroundColor: t.color.surface,
    borderColor: t.color.border,
    borderRadius: t.radius.md,
    padding: t.space.md,
  },
  buttonWrapper: {
    marginTop: t.space.md,
  },
});
