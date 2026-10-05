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
  const [resending, setResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

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

  const onResendCode = async () => {
    if (!isLoaded || resending) return;
    setResending(true);
    setServerError(null);
    setResendSuccess(false);
    try {
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      setResendSuccess(true);
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'errors' in err && Array.isArray((err as { errors: unknown[] }).errors)
          ? ((err as { errors: { message?: string }[] }).errors[0]?.message ?? 'Failed to resend code')
          : 'Failed to resend code. Please try again.';
      setServerError(message);
    } finally {
      setResending(false);
    }
  };

  const onVerifySubmit = async (values: VerifyCodeFormValues) => {
    if (!isLoaded || submitting) return;
    setServerError(null);
    setSubmitting(true);

    try {
      const result = await signUp.attemptEmailAddressVerification({
        code: values.code.trim(),
      });

      // Clerk returns 'complete' when the signup is fully done.
      // It may also return 'missing_requirements' if additional steps are pending,
      // but the email is verified — we still activate the session in that case.
      const emailVerified =
        result.status === 'complete' ||
        result.verifications?.emailAddress?.status === 'verified';

      if (result.status === 'complete' && result.createdSessionId) {
        await setActive({ session: result.createdSessionId });
        router.replace('/');
        return;
      }

      if (emailVerified && result.createdSessionId) {
        await setActive({ session: result.createdSessionId });
        router.replace('/');
        return;
      }

      if (emailVerified && !result.createdSessionId) {
        // Session wasn't created yet — redirect to sign-in so the user can log in
        router.replace('/(auth)/sign-in');
        return;
      }

      // Verification was not accepted — show Clerk's own error reason if available
      const verificationError = result.verifications?.emailAddress?.error;
      const errorMessage =
        verificationError?.longMessage ??
        verificationError?.message ??
        'Verification could not be completed. Please check the code and try again.';

      setServerError(errorMessage);
    } catch (err: unknown) {
      const clerkErrors =
        err && typeof err === 'object' && 'errors' in err && Array.isArray((err as { errors: unknown[] }).errors)
          ? (err as { errors: { message?: string; longMessage?: string; code?: string }[] }).errors
          : null;

      const firstError = clerkErrors?.[0] ?? null;
      const code = firstError?.code ?? '';
      const message = firstError?.longMessage ?? firstError?.message ?? 'Failed to verify code. Please try again.';

      // Handle already-verified edge cases
      if (
        code === 'already_verified' ||
        code === 'form_identifier_not_found' ||
        message.toLowerCase().includes('already verified') ||
        signUp.status === 'complete'
      ) {
        if (signUp.createdSessionId) {
          try {
            await setActive({ session: signUp.createdSessionId });
            router.replace('/');
            return;
          } catch {
            // Session activation failed — fall through to sign-in
          }
        }
        router.replace('/(auth)/sign-in');
        return;
      }

      // Expired or invalid code
      if (code === 'verification_expired') {
        setServerError('Verification code has expired. Please request a new one.');
        return;
      }

      if (code === 'form_code_incorrect') {
        setServerError('Incorrect code. Please double-check and try again.');
        return;
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

        {resendSuccess ? (
          <Text style={styles.resendSuccess}>
            ✓ New code sent — check your inbox.
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

            <Button
              label={resending ? 'Sending…' : 'Resend code'}
              variant="ghost"
              onPress={() => { void onResendCode(); }}
              disabled={resending || submitting}
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
  resendSuccess: {
    color: t.color.success,
    fontSize: t.type.caption,
    paddingBottom: t.space.sm,
  },
  footerStack: {
    gap: t.space.sm,
    marginTop: t.space.lg,
  },
});
