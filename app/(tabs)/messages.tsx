import { Card, Heading, Screen, Text } from '@/design-system/primitives';

export default function MessagesScreen() {
  return (
    <Screen>
      <Heading>Messages</Heading>
      <Card>
        <Text tone="secondary">
          Realtime authorized messaging and conversation history. Coming in Phase 7.
        </Text>
      </Card>
    </Screen>
  );
}
