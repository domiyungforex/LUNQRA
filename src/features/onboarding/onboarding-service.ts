import type { SupabaseClient } from '@supabase/supabase-js';
import type { InternalProfile } from '@/features/auth/types';
import type { OnboardingDraft } from './types';

export async function completeOnboarding(
  supabase: SupabaseClient,
  profileId: string,
  draft: OnboardingDraft,
): Promise<InternalProfile> {
  // 1. Update the profile
  const { data: updatedProfile, error: profileError } = await supabase
    .from('profiles')
    .update({
      usage_mode: draft.usageMode,
      display_name: draft.displayName,
      username: draft.username,
      bio: draft.bio || null,
      occupation: draft.occupation || null,
      organization: draft.organization || null,
      location: draft.location || null,
      website: draft.website || null,
      preferences: {
        remotePreference: draft.remotePreference,
        agentConsent: draft.agentConsent,
      },
      onboarding_completed: true,
      updated_at: new Date().toISOString(),
    })
    .eq('id', profileId)
    .select('*')
    .single();

  if (profileError || !updatedProfile) {
    throw new Error(`Failed to update profile: ${profileError?.message ?? 'Unknown error'}`);
  }

  // 2. Associate skills
  if (draft.skills.length > 0) {
    for (const skillName of draft.skills) {
      // Find or insert skill
      let skillId: string | null = null;
      const { data: existingSkill } = await supabase
        .from('skills')
        .select('id')
        .eq('name', skillName)
        .maybeSingle();

      if (existingSkill) {
        skillId = (existingSkill as { id: string }).id;
      } else {
        const { data: newSkill } = await supabase
          .from('skills')
          .insert({ name: skillName })
          .select('id')
          .maybeSingle();
        if (newSkill) {
          skillId = (newSkill as { id: string }).id;
        }
      }

      if (skillId) {
        await supabase
          .from('profile_skills')
          .upsert({
            profile_id: profileId,
            skill_id: skillId,
          });
      }
    }
  }

  // 3. Associate interests
  if (draft.interests.length > 0) {
    for (const interestName of draft.interests) {
      let interestId: string | null = null;
      const { data: existingInterest } = await supabase
        .from('interests')
        .select('id')
        .eq('name', interestName)
        .maybeSingle();

      if (existingInterest) {
        interestId = (existingInterest as { id: string }).id;
      } else {
        const { data: newInterest } = await supabase
          .from('interests')
          .insert({ name: interestName })
          .select('id')
          .maybeSingle();
        if (newInterest) {
          interestId = (newInterest as { id: string }).id;
        }
      }

      if (interestId) {
        await supabase
          .from('profile_interests')
          .upsert({
            profile_id: profileId,
            interest_id: interestId,
          });
      }
    }
  }

  return updatedProfile as InternalProfile;
}
