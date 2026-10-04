import { z } from 'zod';

const optional = <T extends z.ZodType>(schema: T) => z.preprocess(value => value === '' ? undefined : value, schema.optional());
const httpsUrl = z.string().refine(value => {
  try {
    return new URL(value).protocol === 'https:';
  } catch {
    return false;
  }
}, 'Must use HTTPS');
const schema = z.object({
  EXPO_PUBLIC_APP_ENV: z.enum(['development', 'preview', 'production']).default('development'),
  EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().regex(/^pk_(test|live)_[A-Za-z0-9+/=]+$/),
  EXPO_PUBLIC_SUPABASE_URL: httpsUrl,
  EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().regex(/^sb_publishable_[A-Za-z0-9_-]+$/),
  EXPO_PUBLIC_SENTRY_DSN: optional(httpsUrl),
  EXPO_PUBLIC_POSTHOG_KEY: optional(z.string().startsWith('phc_')),
  EXPO_PUBLIC_POSTHOG_HOST: httpsUrl.default('https://us.i.posthog.com'),
});
export type PublicEnvironment = z.infer<typeof schema>;
export type EnvironmentResult =
  | { ok: true; value: PublicEnvironment }
  | { ok: false; fields: string[] };

export function validateEnvironment(input: Record<string, unknown>): EnvironmentResult {
  const result = schema.safeParse(input);
  if (!result.success) return { ok: false, fields: [...new Set(result.error.issues.map(issue => String(issue.path[0])))] };
  if (result.data.EXPO_PUBLIC_APP_ENV === 'production' && !result.data.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY.startsWith('pk_live_')) {
    return { ok: false, fields: ['EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY'] };
  }
  return { ok: true, value: result.data };
}

// Expo replaces only statically referenced EXPO_PUBLIC_* accesses during bundling.
export function readEnvironment(): EnvironmentResult {
  return validateEnvironment({
    EXPO_PUBLIC_APP_ENV: process.env.EXPO_PUBLIC_APP_ENV,
    EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY,
    EXPO_PUBLIC_SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL,
    EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY: process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    EXPO_PUBLIC_SENTRY_DSN: process.env.EXPO_PUBLIC_SENTRY_DSN,
    EXPO_PUBLIC_POSTHOG_KEY: process.env.EXPO_PUBLIC_POSTHOG_KEY,
    EXPO_PUBLIC_POSTHOG_HOST: process.env.EXPO_PUBLIC_POSTHOG_HOST,
  });
}
