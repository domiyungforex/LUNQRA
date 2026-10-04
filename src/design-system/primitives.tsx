import type { PropsWithChildren } from 'react';
import {
  ActivityIndicator, Pressable, ScrollView, StyleSheet,
  Text as NativeText, TextInput, View,
  type TextProps, type TextInputProps, type ViewProps,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { tokens as t } from './tokens';

export function Text({ style, tone = 'primary', ...props }: TextProps & {
  tone?: 'primary' | 'secondary' | 'muted';
}) {
  const colors = { primary: t.color.textPrimary, secondary: t.color.textSecondary, muted: t.color.textMuted };
  return <NativeText {...props} style={[styles.text, { color: colors[tone] }, style]} />;
}
export function Heading({ style, ...props }: TextProps) {
  return <Text accessibilityRole="header" {...props} style={[styles.heading, style]} />;
}
export function Stack({ style, ...props }: ViewProps) {
  return <View {...props} style={[styles.stack, style]} />;
}
export function Row({ style, ...props }: ViewProps) {
  return <View {...props} style={[styles.row, style]} />;
}
export function Card({ style, ...props }: ViewProps) {
  return <View {...props} style={[styles.card, style]} />;
}
export function Screen({ children }: PropsWithChildren) {
  return <SafeAreaView style={styles.screen}>
    <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      {children}
    </ScrollView>
  </SafeAreaView>;
}
export function Button({ label, onPress, disabled = false, loading = false }: {
  label: string; onPress: () => void; disabled?: boolean; loading?: boolean;
}) {
  return <Pressable accessibilityRole="button" accessibilityLabel={label}
    accessibilityState={{ disabled: disabled || loading, busy: loading }}
    disabled={disabled || loading} onPress={onPress}
    style={({ pressed }) => [styles.button, (disabled || loading || pressed) && styles.dimmed]}>
    {loading ? <ActivityIndicator color={t.color.textInverse} /> :
      <Text style={styles.buttonText}>{label}</Text>}
  </Pressable>;
}
export function Input({ label, error, style, ...props }: TextInputProps & { label: string; error?: string }) {
  return <Stack style={styles.inputGroup}>
    <Text>{label}</Text>
    <TextInput accessibilityLabel={label} {...props}
      placeholderTextColor={t.color.textMuted}
      style={[styles.input, error ? styles.invalid : undefined, style]} />
    {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
  </Stack>;
}
export function TextArea(props: Parameters<typeof Input>[0]) {
  return <Input {...props} multiline textAlignVertical="top" style={[styles.textArea, props.style]} />;
}
export function Divider() { return <View style={styles.divider} />; }
export function LoadingState({ label = 'Loading…' }: { label?: string }) {
  return <Row accessibilityLiveRegion="polite"><ActivityIndicator color={t.color.brandPrimary} /><Text>{label}</Text></Row>;
}
export function EmptyState({ title, description }: { title: string; description: string }) {
  return <Card><Heading>{title}</Heading><Text tone="secondary">{description}</Text></Card>;
}
export function ErrorState({ title = 'Something went wrong', description, onRetry }: {
  title?: string; description: string; onRetry?: () => void;
}) {
  return <Card><Heading accessibilityRole="alert">{title}</Heading>
    <Text tone="secondary">{description}</Text>
    {onRetry ? <Button label="Try again" onPress={onRetry} /> : null}
  </Card>;
}
const styles = StyleSheet.create({
  text: { fontSize: t.type.body, lineHeight: t.lineHeight.body },
  heading: { fontSize: t.type.title, lineHeight: t.lineHeight.title, fontWeight: t.weight.bold },
  stack: { gap: t.space.md }, row: { flexDirection: 'row', alignItems: 'center', gap: t.space.sm, flexWrap: 'wrap' },
  card: { padding: t.space.lg, backgroundColor: t.color.surface, borderRadius: t.radius.md, gap: t.space.md, borderWidth: 1, borderColor: t.color.border },
  screen: { flex: 1, backgroundColor: t.color.background },
  content: { flexGrow: 1, padding: t.space.lg, gap: t.space.lg, width: '100%', maxWidth: t.contentWidth, alignSelf: 'center' },
  button: { minHeight: t.touchTarget, padding: t.space.md, borderRadius: t.radius.sm, backgroundColor: t.color.brandPrimary, alignItems: 'center', justifyContent: 'center' },
  buttonText: { color: t.color.textInverse, fontWeight: t.weight.medium }, dimmed: { opacity: 0.6 },
  inputGroup: { gap: t.space.sm },
  input: { minHeight: t.touchTarget, padding: t.space.md, borderWidth: 1, borderColor: t.color.borderStrong, borderRadius: t.radius.sm, color: t.color.textPrimary, backgroundColor: t.color.surface, fontSize: t.type.body },
  textArea: { minHeight: t.touchTarget * 3 }, invalid: { borderColor: t.color.danger }, error: { color: t.color.danger },
  divider: { height: 1, backgroundColor: t.color.border },
});
