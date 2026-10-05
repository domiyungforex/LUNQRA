import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { WelcomeScreen } from '@/features/auth/WelcomeScreen';
import { SignInScreen } from '@/features/auth/SignInScreen';
import { SignUpScreen } from '@/features/auth/SignUpScreen';

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

const mockSignInCreate = jest.fn();
const mockSignInSetActive = jest.fn();

jest.mock('@clerk/clerk-expo', () => ({
  useSignIn: () => ({
    signIn: { create: mockSignInCreate },
    setActive: mockSignInSetActive,
    isLoaded: true,
  }),
  useSignUp: () => ({
    signUp: {
      create: jest.fn().mockResolvedValue({}),
      prepareEmailAddressVerification: jest.fn().mockResolvedValue({}),
      attemptEmailAddressVerification: jest.fn().mockResolvedValue({ status: 'complete', createdSessionId: 'sess_123' }),
    },
    setActive: jest.fn().mockResolvedValue({}),
    isLoaded: true,
  }),
}));

describe('Auth Screens', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('WelcomeScreen', () => {
    test('renders brand message and navigates to sign up and sign in', async () => {
      await render(<WelcomeScreen />);
      expect(screen.getByText(/From/)).toBeTruthy();
      expect(screen.getByText(/People\. Ideas\. Opportunities\./)).toBeTruthy();

      await fireEvent.press(screen.getByRole('button', { name: 'Create an account' }));
      expect(mockPush).toHaveBeenCalledWith('/(auth)/sign-up');

      await fireEvent.press(screen.getByRole('button', { name: 'Sign in' }));
      expect(mockPush).toHaveBeenCalledWith('/(auth)/sign-in');
    });
  });

  describe('SignInScreen', () => {
    test('validates required fields and shows error on invalid email', async () => {
      await render(<SignInScreen />);

      await fireEvent.changeText(screen.getByLabelText('Email address'), 'invalid-email');
      await fireEvent.changeText(screen.getByLabelText('Password'), '123');
      await fireEvent.press(screen.getByRole('button', { name: 'Sign in' }));

      await waitFor(() => {
        expect(screen.getByText('Enter a valid email address')).toBeTruthy();
      });
      expect(mockSignInCreate).not.toHaveBeenCalled();
    });

    test('submits valid credentials to Clerk', async () => {
      mockSignInCreate.mockResolvedValueOnce({
        status: 'complete',
        createdSessionId: 'sess_signin_123',
      });

      await render(<SignInScreen />);

      await fireEvent.changeText(screen.getByLabelText('Email address'), 'user@example.com');
      await fireEvent.changeText(screen.getByLabelText('Password'), 'securePassword123');
      await fireEvent.press(screen.getByRole('button', { name: 'Sign in' }));

      await waitFor(() => {
        expect(mockSignInCreate).toHaveBeenCalledWith({
          identifier: 'user@example.com',
          password: 'securePassword123',
        });
        expect(mockSignInSetActive).toHaveBeenCalledWith({ session: 'sess_signin_123' });
        expect(mockReplace).toHaveBeenCalledWith('/(onboarding)/usage');
      });
    });
  });

  describe('SignUpScreen', () => {
    test('renders registration inputs and allows navigation to sign in', async () => {
      await render(<SignUpScreen />);
      expect(screen.getByText('Create your account')).toBeTruthy();

      await fireEvent.press(screen.getByRole('button', { name: 'Already have an account? Sign in' }));
      expect(mockPush).toHaveBeenCalledWith('/(auth)/sign-in');
    });

    test('verifies OTP code and redirects to onboarding', async () => {
      await render(<SignUpScreen />);

      await fireEvent.changeText(screen.getByLabelText('Email address'), 'newuser@example.com');
      await fireEvent.changeText(screen.getByLabelText('Password'), 'securePassword123');
      await fireEvent.press(screen.getByRole('button', { name: 'Continue' }));

      await waitFor(() => {
        expect(screen.getByText('Verify your email')).toBeTruthy();
      });

      await fireEvent.changeText(screen.getByLabelText('Verification code'), '123456');
      await fireEvent.press(screen.getByRole('button', { name: 'Verify and complete' }));

      await waitFor(() => {
        expect(mockReplace).toHaveBeenCalledWith('/(onboarding)/usage');
      });
    });
  });
});
