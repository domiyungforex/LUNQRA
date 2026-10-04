import { useRouter } from 'expo-router';
import { Button, EmptyState, Screen } from '@/design-system/primitives';
export default function NotFound() {
  const router = useRouter();
  return <Screen><EmptyState title="Page not found" description="This link may be outdated. Return to LUNQRA to continue." />
    <Button label="Return to LUNQRA" onPress={() => router.replace('/')} /></Screen>;
}
