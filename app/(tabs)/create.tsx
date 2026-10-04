import { Card, Heading, Screen, Text } from '@/design-system/primitives';

export default function CreateScreen() {
  return (
    <Screen>
      <Heading>Create</Heading>
      <Card>
        <Text tone="secondary">
          Intent composer sheet (Create Intent, Post, Opportunity, Listing, Event, Community). Coming in Phase 5.
        </Text>
      </Card>
    </Screen>
  );
}
