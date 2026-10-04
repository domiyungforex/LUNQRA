import { Stack, type ErrorBoundaryProps } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useEffect } from 'react';
import { ErrorState, Screen } from '@/design-system/primitives';
import { tokens } from '@/design-system/tokens';
import { AppErrorBoundary } from '@/providers/AppErrorBoundary';
import { AuthProvider } from '@/providers/AuthProvider';
import { QueryProvider } from '@/providers/QueryProvider';
import { readEnvironment } from '@/lib/env';
import { initializeTelemetry, reportError } from '@/services/telemetry';

const environment = readEnvironment();
if (environment.ok) initializeTelemetry(environment.value);

export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  useEffect(() => {
    reportError(error);
  }, [error]);
  return (
    <SafeAreaProvider>
      <Screen>
        <ErrorState
          description="This screen couldn’t load. Please try again."
          onRetry={() => {
            void retry();
          }}
        />
      </Screen>
    </SafeAreaProvider>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AppErrorBoundary>
        <AuthProvider>
          <QueryProvider>
            <StatusBar style="dark" />
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: tokens.color.background },
              }}
            />
          </QueryProvider>
        </AuthProvider>
      </AppErrorBoundary>
    </SafeAreaProvider>
  );
}
