import { useEffect, useState, type PropsWithChildren } from 'react';
import { AppState, Platform } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { QueryClientProvider, focusManager, onlineManager } from '@tanstack/react-query';
import { createQueryClient } from '@/lib/query-client';

export function QueryProvider({ children }: PropsWithChildren) {
  const [client] = useState(createQueryClient);
  useEffect(() => {
    onlineManager.setEventListener(setOnline => NetInfo.addEventListener(state => {
      setOnline(state.isConnected !== false && state.isInternetReachable !== false);
    }));
    if (Platform.OS === 'web') return;
    focusManager.setFocused(AppState.currentState === 'active');
    const subscription = AppState.addEventListener('change', state => focusManager.setFocused(state === 'active'));
    return () => subscription.remove();
  }, []);
  useEffect(() => () => client.clear(), [client]);
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
