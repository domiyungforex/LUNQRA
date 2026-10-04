import { tokenCache } from '@/lib/token-cache';
import * as SecureStore from 'expo-secure-store';

jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

describe('tokenCache', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('reads token from secure store', async () => {
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValueOnce('test_jwt_token');
    const token = await tokenCache.getToken('clerk_session');
    expect(token).toBe('test_jwt_token');
    expect(SecureStore.getItemAsync).toHaveBeenCalledWith('clerk_session');
  });

  test('saves token to secure store', async () => {
    (SecureStore.setItemAsync as jest.Mock).mockResolvedValueOnce(undefined);
    await tokenCache.saveToken('clerk_session', 'new_token');
    expect(SecureStore.setItemAsync).toHaveBeenCalledWith('clerk_session', 'new_token');
  });

  test('clears token from secure store', async () => {
    (SecureStore.deleteItemAsync as jest.Mock).mockResolvedValueOnce(undefined);
    await tokenCache.clearToken('clerk_session');
    expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('clerk_session');
  });

  test('handles secure store read exceptions gracefully', async () => {
    (SecureStore.getItemAsync as jest.Mock).mockRejectedValueOnce(new Error('KeyChain error'));
    const token = await tokenCache.getToken('clerk_session');
    expect(token).toBeNull();
  });
});
