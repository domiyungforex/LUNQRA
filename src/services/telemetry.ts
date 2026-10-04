import * as Sentry from '@sentry/react-native';
import PostHog from 'posthog-react-native';
import type { PublicEnvironment } from '@/lib/env';

export type ProductEvent =
  | 'sign_up_completed' | 'onboarding_completed' | 'intent_started'
  | 'intent_created' | 'intent_published' | 'matches_generated'
  | 'match_opened' | 'conversation_started' | 'message_sent' | 'intent_completed'
  | 'community_joined';
let analytics: PostHog | undefined;
let initialized = false;

export function initializeTelemetry(env: PublicEnvironment) {
  if (initialized) return;
  initialized = true;
  if (env.EXPO_PUBLIC_SENTRY_DSN) Sentry.init({
    dsn: env.EXPO_PUBLIC_SENTRY_DSN,
    environment: env.EXPO_PUBLIC_APP_ENV,
    sendDefaultPii: false,
    enableAutoSessionTracking: false,
    tracesSampleRate: 0,
    beforeSend(event) {
      // Only structural error context is allowed; never send message text or request data.
      return {
        type: event.type, event_id: event.event_id, timestamp: event.timestamp, platform: event.platform,
        level: event.level, release: event.release, environment: event.environment,
        exception: { values: event.exception?.values?.map(value => ({
          type: value.type, value: 'Application error',
          stacktrace: { frames: value.stacktrace?.frames?.map(frame => ({
            filename: frame.filename?.split('?')[0], function: frame.function,
            lineno: frame.lineno, colno: frame.colno, in_app: frame.in_app,
          })) },
        })) },
      };
    },
  });
  if (env.EXPO_PUBLIC_POSTHOG_KEY) analytics = new PostHog(env.EXPO_PUBLIC_POSTHOG_KEY, {
    host: env.EXPO_PUBLIC_POSTHOG_HOST,
    captureAppLifecycleEvents: false,
    enableSessionReplay: false,
    persistence: 'memory',
    disableGeoip: true,
    personProfiles: 'never',
  });
}

// No arbitrary properties: raw intents, messages and profile data cannot be passed here.
export function trackEvent(event: ProductEvent) { analytics?.capture(event); }
export function reportError(error: unknown) {
  Sentry.captureException(error);
  if (__DEV__) console.warn('LUNQRA encountered an application error. Inspect the local debugger.');
}
