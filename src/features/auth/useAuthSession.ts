import { useAuth, useUser } from '@clerk/clerk-expo';
import { useQuery } from '@tanstack/react-query';
import { useSupabase } from '@/lib/useSupabase';
import { bootstrapInternalUser } from './user-bootstrap';
import type { InternalProfile, InternalUser } from './types';

export interface AuthSession {
  isLoaded: boolean;
  isSignedIn: boolean;
  userId: string | null;
  internalUser: InternalUser | null;
  profile: InternalProfile | null;
  onboardingCompleted: boolean;
  isLoadingBootstrap: boolean;
  signOut: () => Promise<void>;
  refetchSession: () => void;
}

export function useAuthSession(): AuthSession {
  const { isLoaded: isAuthLoaded, isSignedIn, userId, signOut } = useAuth();
  const { isLoaded: isUserLoaded, user } = useUser();
  const supabase = useSupabase();

  const isLoaded = isAuthLoaded && isUserLoaded;

  const {
    data: bootstrapData,
    isLoading: isLoadingBootstrap,
    refetch,
  } = useQuery({
    queryKey: ['auth-session', userId],
    queryFn: async () => {
      if (!supabase || !userId) return null;
      return bootstrapInternalUser(supabase, {
        clerkId: userId,
        email: user?.primaryEmailAddress?.emailAddress ?? null,
        phone: user?.primaryPhoneNumber?.phoneNumber ?? null,
        displayName: user?.fullName ?? user?.firstName ?? null,
      });
    },
    enabled: Boolean(isLoaded && isSignedIn && userId && supabase),
    staleTime: 60_000,
  });

  return {
    isLoaded,
    isSignedIn: Boolean(isSignedIn),
    userId: userId ?? null,
    internalUser: bootstrapData?.user ?? null,
    profile: bootstrapData?.profile ?? null,
    onboardingCompleted: bootstrapData?.profile?.onboarding_completed ?? false,
    isLoadingBootstrap,
    signOut,
    refetchSession: () => {
      void refetch();
    },
  };
}
