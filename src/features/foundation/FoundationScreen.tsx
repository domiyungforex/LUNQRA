import { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Button, Card, Heading, Screen, Stack, Text } from '@/design-system/primitives';
import { tokens as t } from '@/design-system/tokens';
import { readEnvironment } from '@/lib/env';

export function FoundationScreen() {
  const [environment, setEnvironment] = useState(readEnvironment);
  return <Screen>
    <Text style={styles.brand}>LUNQRA</Text>
    <Stack style={styles.intro}>
      <Heading style={styles.promise}>Say what you need.</Heading>
      <Text tone="secondary">Find who or what can make it happen.</Text>
    </Stack>
    <Card>
      <Heading>{environment.ok ? 'Your network starts here' : 'Setup is not complete'}</Heading>
      <Text tone="secondary">{environment.ok
        ? 'The application foundation is ready. Account creation is the next release milestone.'
        : 'LUNQRA is not ready to connect yet. If you are setting up the app, complete the project configuration and restart it.'}</Text>
      {!environment.ok && __DEV__ ? <Stack>
        <Text tone="muted">Configuration needed:</Text>
        {environment.fields.map(field => <Text key={field} style={styles.config}>{field}</Text>)}
      </Stack> : null}
      {!environment.ok ? <Button label="Check again" onPress={() => setEnvironment(readEnvironment())} /> : null}
    </Card>
    <Text tone="muted" style={styles.footer}>A human intent network by ATEM</Text>
  </Screen>;
}
const styles = StyleSheet.create({
  brand: { fontSize: t.type.title, fontWeight: t.weight.bold, color: t.color.brandPrimary },
  intro: { paddingVertical: t.space.xxl },
  promise: { fontSize: t.type.display, lineHeight: t.lineHeight.display },
  config: { fontSize: t.type.caption, lineHeight: t.lineHeight.caption },
  footer: { marginTop: 'auto', paddingTop: t.space.xl, fontSize: t.type.caption },
});
