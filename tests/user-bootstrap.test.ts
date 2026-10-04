import { bootstrapInternalUser } from '@/features/auth/user-bootstrap';
import type { SupabaseClient } from '@supabase/supabase-js';

function createMockSupabase(overrides?: {
  existingUser?: unknown;
  insertedUser?: unknown;
  existingProfile?: unknown;
  insertedProfile?: unknown;
  userError?: Error;
  profileError?: Error;
}) {
  const from = jest.fn((table: string) => {
    if (table === 'users') {
      return {
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            maybeSingle: jest.fn().mockResolvedValue({
              data: overrides?.existingUser ?? null,
              error: overrides?.userError ? { message: overrides.userError.message } : null,
            }),
          })),
        })),
        insert: jest.fn(() => ({
          select: jest.fn(() => ({
            single: jest.fn().mockResolvedValue({
              data: overrides?.insertedUser ?? {
                id: 'new-user-id',
                clerk_id: 'clerk_123',
                email: 'test@example.com',
                phone: null,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              },
              error: overrides?.userError ? { message: overrides.userError.message } : null,
            }),
          })),
        })),
      };
    }

    if (table === 'profiles') {
      return {
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            maybeSingle: jest.fn().mockResolvedValue({
              data: overrides?.existingProfile ?? null,
              error: overrides?.profileError ? { message: overrides.profileError.message } : null,
            }),
          })),
        })),
        insert: jest.fn(() => ({
          select: jest.fn(() => ({
            single: jest.fn().mockResolvedValue({
              data: overrides?.insertedProfile ?? {
                id: 'new-user-id',
                display_name: 'Test User',
                username: 'test_1234',
                avatar_url: null,
                bio: null,
                location: null,
                onboarding_completed: false,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              },
              error: overrides?.profileError ? { message: overrides.profileError.message } : null,
            }),
          })),
        })),
      };
    }

    throw new Error(`Unexpected table: ${table}`);
  });

  return { from } as unknown as SupabaseClient;
}

describe('bootstrapInternalUser', () => {
  test('creates new user and profile if no existing records exist', async () => {
    const supabase = createMockSupabase();
    const result = await bootstrapInternalUser(supabase, {
      clerkId: 'user_clerk_new',
      email: 'alex@example.com',
      displayName: 'Alex Doe',
    });

    expect(result.user).toBeDefined();
    expect(result.profile).toBeDefined();
    expect(result.profile.onboarding_completed).toBe(false);
  });

  test('returns existing user and profile without duplicate insertions', async () => {
    const existingUser = {
      id: 'existing-id',
      clerk_id: 'user_clerk_exist',
      email: 'existing@example.com',
      phone: '+1234567890',
      created_at: '2026-01-01T00:00:00Z',
      updated_at: '2026-01-01T00:00:00Z',
    };
    const existingProfile = {
      id: 'existing-id',
      display_name: 'Existing Member',
      username: 'member1',
      avatar_url: 'https://example.com/avatar.png',
      bio: 'LUNQRA early adopter',
      location: 'Lagos',
      onboarding_completed: true,
      created_at: '2026-01-01T00:00:00Z',
      updated_at: '2026-01-01T00:00:00Z',
    };

    const supabase = createMockSupabase({ existingUser, existingProfile });
    const result = await bootstrapInternalUser(supabase, {
      clerkId: 'user_clerk_exist',
    });

    expect(result.user.id).toBe('existing-id');
    expect(result.profile.onboarding_completed).toBe(true);
    expect(result.profile.username).toBe('member1');
  });

  test('throws descriptive error when query fails', async () => {
    const supabase = createMockSupabase({ userError: new Error('Database connection lost') });
    await expect(
      bootstrapInternalUser(supabase, { clerkId: 'user_clerk_fail' }),
    ).rejects.toThrow('Database connection lost');
  });
});
