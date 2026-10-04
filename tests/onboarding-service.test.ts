import { completeOnboarding } from '@/features/onboarding/onboarding-service';
import type { OnboardingDraft } from '@/features/onboarding/types';
import type { SupabaseClient } from '@supabase/supabase-js';

function createMockSupabase() {
  const profileData = {
    id: 'profile_123',
    display_name: 'Alex Morgan',
    username: 'alexmorgan',
    onboarding_completed: true,
  };

  const from = jest.fn((table: string) => {
    if (table === 'profiles') {
      return {
        update: jest.fn(() => ({
          eq: jest.fn(() => ({
            select: jest.fn(() => ({
              single: jest.fn().mockResolvedValue({
                data: profileData,
                error: null,
              }),
            })),
          })),
        })),
      };
    }

    if (table === 'skills') {
      return {
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            maybeSingle: jest.fn().mockResolvedValue({
              data: { id: 'skill_react_native' },
              error: null,
            }),
          })),
        })),
        insert: jest.fn(() => ({
          select: jest.fn(() => ({
            maybeSingle: jest.fn().mockResolvedValue({
              data: { id: 'new_skill_id' },
              error: null,
            }),
          })),
        })),
      };
    }

    if (table === 'interests') {
      return {
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            maybeSingle: jest.fn().mockResolvedValue({
              data: { id: 'interest_tech' },
              error: null,
            }),
          })),
        })),
        insert: jest.fn(() => ({
          select: jest.fn(() => ({
            maybeSingle: jest.fn().mockResolvedValue({
              data: { id: 'new_interest_id' },
              error: null,
            }),
          })),
        })),
      };
    }

    if (table === 'profile_skills' || table === 'profile_interests') {
      return {
        upsert: jest.fn().mockResolvedValue({ data: null, error: null }),
      };
    }

    throw new Error(`Unexpected table: ${table}`);
  });

  return { from } as unknown as SupabaseClient;
}

describe('completeOnboarding', () => {
  const mockDraft: OnboardingDraft = {
    usageMode: 'professional',
    displayName: 'Alex Morgan',
    username: 'alexmorgan',
    bio: 'Mobile and intent systems engineer',
    occupation: 'Staff Engineer',
    organization: 'ATEM',
    location: 'Lagos, Nigeria',
    website: 'https://alex.dev',
    skills: ['React Native', 'TypeScript'],
    interests: ['Artificial Intelligence', 'Mobile Innovation'],
    remotePreference: 'any',
    agentConsent: true,
  };

  test('updates profile, marks onboarding complete, and saves skills and interests', async () => {
    const supabase = createMockSupabase();
    const result = await completeOnboarding(supabase, 'profile_123', mockDraft);

    expect(result).toBeDefined();
    expect(result.id).toBe('profile_123');
    expect(result.onboarding_completed).toBe(true);
    expect(supabase.from).toHaveBeenCalledWith('profiles');
    expect(supabase.from).toHaveBeenCalledWith('profile_skills');
    expect(supabase.from).toHaveBeenCalledWith('profile_interests');
  });

  test('throws when profile update fails', async () => {
    const errorSupabase = {
      from: jest.fn(() => ({
        update: jest.fn(() => ({
          eq: jest.fn(() => ({
            select: jest.fn(() => ({
              single: jest.fn().mockResolvedValue({
                data: null,
                error: { message: 'Database connection lost' },
              }),
            })),
          })),
        })),
      })),
    } as unknown as SupabaseClient;

    await expect(
      completeOnboarding(errorSupabase, 'profile_123', mockDraft),
    ).rejects.toThrow('Database connection lost');
  });
});
