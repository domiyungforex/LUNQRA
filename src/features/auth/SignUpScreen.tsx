import { useState } from 'react';
import { StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useSignUp } from '@clerk/clerk-expo';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Card, Heading, Input, Screen, Stack, Text } from '@/design-system/primitives';
import { tokens as t } from '@/design-system/tokens';
import { signUpSchema, verifyCodeSchema, type SignUpFormValues, type VerifyCodeFormValues } from './types';

export function SignUpScreen() {
  const router = useRouter();
  const { signUp, setActive, isLoaded } = useSignUp();
  const [pendingVerification, setPendingVerification] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    control: signUpControl,
    handleSubmit: handleSignUpSubmit,
    formState: { errors: signUpErrors },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { email: '', password: '' },
  });

  const {
    control: verifyControl,
    handleSubmit: handleVerifySubmit,
    formState: { errors: verifyErrors },
  } = useForm<VerifyCodeFormValues>({
    resolver: zodResolver(verifyCodeSchema),
    defaultValues: { code: '' },
  });

  const onSignUpSubmit = async (values: SignUpFormValues) => {
    if (!isLoaded || submitting) return;
    setServerError(null);
    setSubmitting(true);

    try {
      await signUp.create({
        emailAddress: values.email,
        password: values.password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      setPendingVerification(true);
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'errors' in err && Array.isArray((err as { errors: unknown[] }).errors)
          ? ((err as { errors: { message?: string }[] }).errors[0]?.message ?? 'Failed to create account')
          : 'Unable to create account. Please check your information and network connection.';
      setServerError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const onVerifySubmit = async (values: VerifyCodeFormValues) => {
    if (!isLoaded || submitting) return;
    setServerError(null);
    setSubmitting(true);

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code: values.code,
      });

      if (completeSignUp.status === 'complete') {
        await setActive({ session: completeSignUp.createdSessionId });
        router.replace('/');
      } else {
        setServerError('Verification could not be completed. Please try again.');
      }
    } catch (err: unknown) {
      const firstError =
        err && typeof err === 'object' && 'errors' in err && Array.isArray((err as { errors: unknown[] }).errors)
          ? (err as { errors: { message?: string; code?: string }[] }).errors[0]
          : null;
      const message = firstError?.message ?? 'Failed to verify code. Please try again.';

      // If email was already verified, activate session or redirect to sign in immediately
      if (
        firstError?.code === 'already_verified' ||
        message.toLowerCase().includes('already verified') ||
        signUp.status === 'complete'
      ) {
        if (signUp.createdSessionId) {
          await setActive({ session: signUp.createdSessionId });
          router.replace('/');
          return;
        } else {
          router.replace('/(auth)/sign-in');
          return;
        }
      }

      setServerError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Screen>
      <Stack style={styles.header}>
        <Text style={styles.brand}>LUNQRA</Text>
        <Heading style={styles.title}>
          {pendingVerification ? 'Verify your email' : 'Create your account'}
        </Heading>
        <Text tone="secondary">
          {pendingVerification
            ? 'We sent a verification code to your email address.'
            : 'Join the human intent network. State what you need, find who can make it happen.'}
        </Text>
      </Stack>

      <Card>
        {serverError ? (
          <Text accessibilityRole="alert" style={styles.serverError}>
            {serverError}
          </Text>
        ) : null}

        {!pendingVerification ? (
          <>
            <Controller
              control={signUpControl}
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
                  error={signUpErrors.email?.message}
                />
              )}
            />

            <Controller
              control={signUpControl}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Password"
                  placeholder="At least 8 characters"
                  secureTextEntry
                  autoCapitalize="none"
                  autoCorrect={false}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={signUpErrors.password?.message}
                />
              )}
            />

            <Button
              label="Continue"
              onPress={() => {
                void handleSignUpSubmit(onSignUpSubmit)();
              }}
              loading={submitting}
              disabled={!isLoaded || submitting}
            />
          </>
        ) : (
          <>
            <Controller
              control={verifyControl}
              name="code"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Verification code"
                  placeholder="Enter 6-digit code"
                  keyboardType="number-pad"
                  autoCapitalize="none"
                  autoCorrect={false}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={verifyErrors.code?.message}
                />
              )}
            />

            <Button
              label="Verify and complete"
              onPress={() => {
                void handleVerifySubmit(onVerifySubmit)();
              }}
              loading={submitting}
              disabled={!isLoaded || submitting}
            />
          </>
        )}
      </Card>

      <Stack style={styles.footerStack}>
        <Button
          label="Already have an account? Sign in"
          onPress={() => router.push('/(auth)/sign-in')}
        />
        <Button
          label="Back"
          onPress={() => (pendingVerification ? setPendingVerification(false) : router.push('/(auth)/welcome'))}
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
