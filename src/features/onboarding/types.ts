import { z } from 'zod';

export const UsageModeValues = ['individual', 'student', 'creator', 'professional', 'business'] as const;
export type UsageMode = typeof UsageModeValues[number];

export interface UsageModeOption {
  id: UsageMode;
  title: string;
  description: string;
}

export const USAGE_MODES: UsageModeOption[] = [
  {
    id: 'individual',
    title: 'Individual',
    description: 'Looking to discover opportunities, find help, and connect with people.',
  },
  {
    id: 'professional',
    title: 'Professional',
    description: 'Offering skills, services, and looking for career opportunities and collaborations.',
  },
  {
    id: 'creator',
    title: 'Creator',
    description: 'Building projects, audience, creative offerings, and seeking collaborators.',
  },
  {
    id: 'student',
    title: 'Student',
    description: 'Learning, looking for mentorship, campus communities, and internships.',
  },
  {
    id: 'business',
    title: 'Business',
    description: 'Hiring talent, posting business needs, and offering organizational services.',
  },
];

export const usageModeSchema = z.object({
  usageMode: z.enum(UsageModeValues),
});

export const profileInfoSchema = z.object({
  displayName: z.string().min(2, 'Display name must be at least 2 characters').max(60),
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(30)
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  bio: z.string().max(280, 'Bio cannot exceed 280 characters'),
  occupation: z.string().max(80),
  organization: z.string().max(80),
  location: z.string().max(100),
  website: z.string(),
});

export type ProfileInfoFormValues = z.infer<typeof profileInfoSchema>;

export const interestsSchema = z.object({
  interests: z.array(z.string()).min(1, 'Select at least one interest'),
});

export const capabilitiesSchema = z.object({
  skills: z.array(z.string()).min(1, 'Select at least one skill or capability'),
});

export const locationPreferencesSchema = z.object({
  location: z.string().min(2, 'Please enter your general location or city'),
  remotePreference: z.enum(['remote', 'in_person', 'hybrid', 'any']).default('any'),
});

export type LocationPreferencesFormValues = z.infer<typeof locationPreferencesSchema>;

export interface OnboardingDraft {
  usageMode: UsageMode;
  displayName: string;
  username: string;
  bio: string;
  occupation: string;
  organization: string;
  location: string;
  website: string;
  skills: string[];
  interests: string[];
  remotePreference: 'remote' | 'in_person' | 'hybrid' | 'any';
  agentConsent: boolean;
}

export const defaultOnboardingDraft: OnboardingDraft = {
  usageMode: 'individual',
  displayName: '',
  username: '',
  bio: '',
  occupation: '',
  organization: '',
  location: '',
  website: '',
  skills: [],
  interests: [],
  remotePreference: 'any',
  agentConsent: true,
};
