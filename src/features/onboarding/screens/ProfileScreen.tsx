import { StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Card, Heading, Input, Screen, Stack, Text, TextArea } from '@/design-system/primitives';
import { tokens as t } from '@/design-system/tokens';
import { useOnboardingDraft } from '../onboarding-context';
import { profileInfoSchema, type ProfileInfoFormValues } from '../types';

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
      <Text style={styles.stepIndicator}>Step 2 of 6</Text>

      <Stack style={styles.header}>
        <Heading style={styles.title}>Create your public profile</Heading>
        <Text tone="secondary">
          This represents your presence across the intent network.
        </Text>
      </Stack>

      <Card>
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

        <Button
          label="Continue"
          onPress={() => {
            void handleSubmit(onSubmit)();
          }}
        />
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
});
