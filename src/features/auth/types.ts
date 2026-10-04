import { z } from 'zod';

export interface InternalUser {
  id: string;
  clerk_id: string;
  email: string | null;
  phone: string | null;
  created_at: string;
  updated_at: string;
}

export interface InternalProfile {
  id: string;
  display_name: string | null;
  username: string | null;
  avatar_url: string | null;
  bio: string | null;
  location: string | null;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface AuthSessionState {
  isLoaded: boolean;
  isSignedIn: boolean;
  userId: string | null;
  internalUser: InternalUser | null;
  profile: InternalProfile | null;
  onboardingCompleted: boolean;
}

export const signInSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export type SignInFormValues = z.infer<typeof signInSchema>;

export const signUpSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export type SignUpFormValues = z.infer<typeof signUpSchema>;

export const verifyCodeSchema = z.object({
  code: z.string().min(6, 'Verification code must be at least 6 characters'),
});

export type VerifyCodeFormValues = z.infer<typeof verifyCodeSchema>;
