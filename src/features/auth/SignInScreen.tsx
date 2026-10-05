import { useState } from 'react';
import { StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useSignIn } from '@clerk/clerk-expo';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Card, Heading, Input, Screen, Stack, Text } from '@/design-system/primitives';
import { tokens as t } from '@/design-system/tokens';
import { signInSchema, type SignInFormValues } from './types';

export function SignInScreen() {
  const router = useRouter();
  const { signIn, setActive, isLoaded } = useSignIn();
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: SignInFormValues) => {
    if (!isLoaded || submitting) return;
    setServerError(null);
    setSubmitting(true);

    try {
      const result = await signIn.create({
        identifier: values.email,
        password: values.password,
      });

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        router.replace('/(onboarding)');
      } else {
        setServerError('Additional authentication steps are required. Please check your email.');
      }
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'errors' in err && Array.isArray((err as { errors: unknown[] }).errors)
          ? ((err as { errors: { message?: string }[] }).errors[0]?.message ?? 'Failed to sign in')
          : 'Unable to sign in. Please verify your credentials and network connection.';
      setServerError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Screen>
      <Stack style={styles.header}>
        <Text style={styles.brand}>LUNQRA</Text>
        <Heading style={styles.title}>Welcome back</Heading>
        <Text tone="secondary">Sign in to continue to your intent network.</Text>
      </Stack>

      <Card>
        {serverError ? (
          <Text accessibilityRole="alert" style={styles.serverError}>
            {serverError}
          </Text>
        ) : null}

        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Email address"
              placeholder="you@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="email"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.email?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Password"
              placeholder="••••••••"
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.password?.message}
            />
          )}
        />

        <Button
          label="Sign in"
          onPress={() => {
            void handleSubmit(onSubmit)();
          }}
          loading={submitting}
          disabled={!isLoaded || submitting}
        />
      </Card>

      <Stack style={styles.footerStack}>
        <Button
          label="Don't have an account? Sign up"
          onPress={() => router.push('/(auth)/sign-up')}
        />
        <Button
          label="Back"
          onPress={() => router.push('/(auth)/welcome')}
        />
      </Stack>
    </Screen>
  );
}

const styles = StyleSheet.create({
  brand: {
    fontSize: t.type.caption,
    fontWeight: t.weight.bold,
    color: t.color.brandPrimary,
    letterSpacing: 1.5,
  },
  header: {
    paddingVertical: t.space.lg,
    gap: t.space.xs,
  },
  title: {
    fontSize: t.type.title,
    lineHeight: t.lineHeight.title,
  },
  serverError: {
    color: t.color.danger,
    fontSize: t.type.body,
    paddingBottom: t.space.sm,
  },
  footerStack: {
    gap: t.space.sm,
    marginTop: t.space.lg,
  },
});
