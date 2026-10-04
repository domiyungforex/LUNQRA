import type { PropsWithChildren } from 'react';
import { ClerkProvider, ClerkLoaded } from '@clerk/clerk-expo';
import { tokenCache } from '@/lib/token-cache';
import { readEnvironment } from '@/lib/env';
import { FoundationScreen } from '@/features/foundation/FoundationScreen';

export function AuthProvider({ children }: PropsWithChildren) {
  const env = readEnvironment();

  if (!env.ok) {
    return <FoundationScreen />;
  }

  return (
    <ClerkProvider
      publishableKey={env.value.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY}
      tokenCache={tokenCache}
    >
      <ClerkLoaded>
        {children}
      </ClerkLoaded>
    </ClerkProvider>
  );
}
