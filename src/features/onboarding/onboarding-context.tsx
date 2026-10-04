import React, { createContext, useContext, useState, type PropsWithChildren } from 'react';
import { defaultOnboardingDraft, type OnboardingDraft } from './types';

interface OnboardingContextValue {
  draft: OnboardingDraft;
  updateDraft: (updates: Partial<OnboardingDraft>) => void;
  resetDraft: () => void;
}

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

export function OnboardingProvider({ children }: PropsWithChildren) {
  const [draft, setDraft] = useState<OnboardingDraft>(defaultOnboardingDraft);

  const updateDraft = (updates: Partial<OnboardingDraft>) => {
    setDraft(prev => ({ ...prev, ...updates }));
  };

  const resetDraft = () => {
    setDraft(defaultOnboardingDraft);
  };

  return (
    <OnboardingContext.Provider value={{ draft, updateDraft, resetDraft }}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboardingDraft(): OnboardingContextValue {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboardingDraft must be used within an OnboardingProvider');
  }
  return context;
}
