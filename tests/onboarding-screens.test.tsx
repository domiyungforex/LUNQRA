import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { OnboardingProvider } from '@/features/onboarding/onboarding-context';
import { UsageScreen } from '@/features/onboarding/screens/UsageScreen';
import { ProfileScreen } from '@/features/onboarding/screens/ProfileScreen';
import { InterestsScreen } from '@/features/onboarding/screens/InterestsScreen';
import { CapabilitiesScreen } from '@/features/onboarding/screens/CapabilitiesScreen';
import { LocationScreen } from '@/features/onboarding/screens/LocationScreen';
import { AgentIntroScreen } from '@/features/onboarding/screens/AgentIntroScreen';

const mockPush = jest.fn();
const mockReplace = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
  }),
}));

jest.mock('react-native-safe-area-context', () => {
  const { View } = jest.requireActual('react-native');
  return { SafeAreaView: View };
});

const mockCompleteOnboarding = jest.fn().mockResolvedValue({ id: 'p1', onboarding_completed: true });
jest.mock('@/features/onboarding/onboarding-service', () => ({
  completeOnboarding: (...args: unknown[]) => mockCompleteOnboarding(...args),
}));

jest.mock('@/lib/useSupabase', () => ({
  useSupabase: () => ({}),
}));

jest.mock('@/features/auth/useAuthSession', () => ({
  useAuthSession: () => ({
    internalUser: { id: 'usr_123' },
    profile: { id: 'prof_123', display_name: 'Alex' },
    refetchSession: jest.fn(),
  }),
}));

function renderWithOnboarding(ui: React.ReactElement) {
  return render(<OnboardingProvider>{ui}</OnboardingProvider>);
}

describe('Onboarding Screens', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('UsageScreen', () => {
    test('renders usage mode choices and navigates to profile step', async () => {
      await renderWithOnboarding(<UsageScreen />);

      expect(screen.getByText('Individual')).toBeTruthy();
      expect(screen.getByText('Professional')).toBeTruthy();
      expect(screen.getByText('Creator')).toBeTruthy();
      expect(screen.getByText('Student')).toBeTruthy();
      expect(screen.getByText('Business')).toBeTruthy();

      await fireEvent.press(screen.getByRole('button', { name: /Professional/ }));
      await fireEvent.press(screen.getByRole('button', { name: 'Continue' }));

      expect(mockPush).toHaveBeenCalledWith('/(onboarding)/profile');
    });
  });

  describe('ProfileScreen', () => {
    test('validates required fields and navigates with valid input', async () => {
      await renderWithOnboarding(<ProfileScreen />);

      await fireEvent.changeText(screen.getByLabelText('Full name or display name *'), 'Alex Morgan');
      await fireEvent.changeText(screen.getByLabelText('Username *'), 'alexmorgan');
      await fireEvent.changeText(screen.getByLabelText('Headline or title'), 'Senior Software Engineer');
      await fireEvent.changeText(screen.getByLabelText('Short bio'), 'Building with intent.');

      await fireEvent.press(screen.getByRole('button', { name: 'Continue' }));

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/(onboarding)/interests');
      });
    });
  });

  describe('InterestsScreen', () => {
    test('renders interest chips and navigates with valid selection', async () => {
      await renderWithOnboarding(<InterestsScreen />);

      // Default chips are displayed
      expect(screen.getByText('Tech Startups')).toBeTruthy();
      expect(screen.getByText('Artificial Intelligence')).toBeTruthy();

      // Toggle an additional chip
      await fireEvent.press(screen.getByRole('button', { name: 'Artificial Intelligence' }));

      // Continue with at least one selection (Tech Startups is pre-selected)
      await fireEvent.press(screen.getByRole('button', { name: 'Continue' }));
      expect(mockPush).toHaveBeenCalledWith('/(onboarding)/capabilities');
    });
  });

  describe('CapabilitiesScreen', () => {
    test('renders capability chips and navigates with valid selection', async () => {
      await renderWithOnboarding(<CapabilitiesScreen />);

      // Default chips are displayed
      expect(screen.getByText('React Native')).toBeTruthy();
      expect(screen.getByText('TypeScript')).toBeTruthy();

      // Toggle an additional chip
      await fireEvent.press(screen.getByRole('button', { name: 'TypeScript' }));

      // Continue with at least one selection (React Native is pre-selected)
      await fireEvent.press(screen.getByRole('button', { name: 'Continue' }));
      expect(mockPush).toHaveBeenCalledWith('/(onboarding)/location');
    });
  });

  describe('LocationScreen', () => {
    test('validates location entry and allows selection of remote preference', async () => {
      await renderWithOnboarding(<LocationScreen />);

      await fireEvent.changeText(screen.getByLabelText('Your primary location *'), 'Lagos, Nigeria');
      await fireEvent.press(screen.getByRole('button', { name: /Remote only/ }));

      await fireEvent.press(screen.getByRole('button', { name: 'Continue' }));
      expect(mockPush).toHaveBeenCalledWith('/(onboarding)/agent');
    });
  });

  describe('AgentIntroScreen', () => {
    test('completes onboarding and navigates to tabs', async () => {
      await renderWithOnboarding(<AgentIntroScreen />);

      expect(screen.getByText('Meet your LUNQRA Agent')).toBeTruthy();
      expect(screen.getByText('Intent Parsing')).toBeTruthy();

      await fireEvent.press(screen.getByRole('button', { name: 'Complete setup & enter LUNQRA' }));

      await waitFor(() => {
        expect(mockCompleteOnboarding).toHaveBeenCalled();
        expect(mockReplace).toHaveBeenCalledWith('/(tabs)');
      });
    });
  });
});
