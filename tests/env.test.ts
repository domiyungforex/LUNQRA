import { validateEnvironment } from '@/lib/env';
const valid = {
  EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY: 'pk_test_ZXhhbXBsZS5jbGVyay5hY2NvdW50cy5kZXYk',
  EXPO_PUBLIC_SUPABASE_URL: 'https://example.supabase.co',
  EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_example',
};
test('requires public service configuration and never returns secret values in errors', () => {
  const result = validateEnvironment({ EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY: 'sb_secret_do_not_expose' });
  expect(result.ok).toBe(false);
  expect(JSON.stringify(result)).not.toContain('sb_secret_do_not_expose');
});
test('accepts public keys and optional empty telemetry configuration', () => {
  const result = validateEnvironment({ ...valid, EXPO_PUBLIC_SENTRY_DSN: '', EXPO_PUBLIC_POSTHOG_KEY: '' });
  expect(result.ok).toBe(true);
});
test.each(['http://example.supabase.co', 'not-a-url'])('rejects insecure or malformed backend URL %s', url => {
  expect(validateEnvironment({ ...valid, EXPO_PUBLIC_SUPABASE_URL: url }).ok).toBe(false);
});
test('rejects test identity keys in production', () => {
  expect(validateEnvironment({ ...valid, EXPO_PUBLIC_APP_ENV: 'production' }).ok).toBe(false);
});
