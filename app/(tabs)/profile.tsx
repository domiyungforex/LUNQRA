import { Button, Card, Heading, Screen, Text } from '@/design-system/primitives';
import { useRouter } from 'expo-router';
import { useAuthSession } from '@/features/auth/useAuthSession';

export default function ProfileScreen() {
  const router = useRouter();
  const { profile, signOut } = useAuthSession();

  return (
    <Screen>
      <Heading>Profile</Heading>
      <Card>
        <Text tone="secondary">Display Name: {profile?.display_name || 'Not set'}</Text>
        <Text tone="secondary">Username: @{profile?.username || 'user'}</Text>
        <Text tone="muted">Full profile view and editing coming in Phase 3.</Text>
        <Button
          label="Sign out"
          onPress={async () => {
            await signOut();
            router.replace('/(auth)/welcome');
          }}
        />
      </Card>
    </Screen>
  );
}
