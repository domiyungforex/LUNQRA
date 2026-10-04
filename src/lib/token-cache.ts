import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const memoryFallback = new Map<string, string>();

export const tokenCache = {
  async getToken(key: string): Promise<string | null> {
    if (Platform.OS === 'web') {
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          return window.localStorage.getItem(key);
        }
      } catch {
        // Fall back to in-memory cache
      }
      return memoryFallback.get(key) ?? null;
    }
    try {
      return await SecureStore.getItemAsync(key);
    } catch {
      return null;
    }
  },

  async saveToken(key: string, value: string): Promise<void> {
    if (Platform.OS === 'web') {
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          window.localStorage.setItem(key, value);
          return;
        }
      } catch {
        // Fall back to in-memory cache
      }
      memoryFallback.set(key, value);
      return;
    }
    try {
      await SecureStore.setItemAsync(key, value);
    } catch {
      // Ignored: cannot persist securely in current environment
    }
  },

  async clearToken(key: string): Promise<void> {
    if (Platform.OS === 'web') {
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          window.localStorage.removeItem(key);
          return;
        }
      } catch {
        // Fall back to in-memory cache
      }
      memoryFallback.delete(key);
      return;
    }
    try {
      await SecureStore.deleteItemAsync(key);
    } catch {
      // Ignored
    }
  },
};
