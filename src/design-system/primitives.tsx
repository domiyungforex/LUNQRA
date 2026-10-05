import type { PropsWithChildren, ReactNode } from 'react';
import {
  ActivityIndicator, Pressable, ScrollView, StyleSheet,
  Text as NativeText, TextInput, View, Image,
  type TextProps, type TextInputProps, type ViewProps, type StyleProp, type ViewStyle, type TextStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { tokens as t } from './tokens';

export function Text({ style, tone = 'primary', ...props }: TextProps & {
  tone?: 'primary' | 'secondary' | 'muted' | 'brand' | 'coral';
}) {
  const colors = {
    primary: t.color.textPrimary,
    secondary: t.color.textSecondary,
    muted: t.color.textMuted,
    brand: t.color.brandPrimary,
    coral: t.color.accentCoral,
  };
  return <NativeText {...props} style={[styles.text, { color: colors[tone] }, style]} />;
}

export function Heading({ style, serif = true, ...props }: TextProps & { serif?: boolean }) {
  return (
    <NativeText
      accessibilityRole="header"
      {...props}
      style={[
        styles.heading,
        serif ? { fontFamily: t.font.serif, fontWeight: '400' } : undefined,
        style,
      ]}
    />
  );
}

export function Stack({ style, ...props }: ViewProps) {
  return <View {...props} style={[styles.stack, style]} />;
}

export function Row({ style, ...props }: ViewProps) {
  return <View {...props} style={[styles.row, style]} />;
}

export function Card({ style, elevated = false, ...props }: ViewProps & { elevated?: boolean }) {
  return (
    <View
      {...props}
      style={[
        styles.card,
        elevated ? styles.cardElevated : undefined,
        style,
      ]}
    />
  );
}

export function Screen({
  children,
  scrollable = true,
  style,
  contentStyle,
}: PropsWithChildren<{
  scrollable?: boolean;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
}>) {
  if (!scrollable) {
    return (
      <SafeAreaView style={[styles.screen, style]} edges={['top', 'left', 'right']}>
        <View style={[styles.content, contentStyle]}>{children}</View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.screen, style]} edges={['top', 'left', 'right']}>
      <ScrollView
        contentContainerStyle={[styles.content, contentStyle]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

export interface ButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'pill' | 'outline' | 'ghost' | 'coral';
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export function Button({
  label,
  onPress,
  disabled = false,
  loading = false,
  variant = 'primary',
  icon,
  iconPosition = 'right',
  style,
  textStyle,
}: ButtonProps) {
  const isPill = variant === 'pill' || variant === 'primary' || variant === 'coral';
  const isOutline = variant === 'outline';
  const isCoral = variant === 'coral';
  const isSecondary = variant === 'secondary';
  const isGhost = variant === 'ghost';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: disabled || loading, busy: loading }}
      disabled={disabled || loading}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        isPill && styles.buttonPill,
        isOutline && styles.buttonOutline,
        isSecondary && styles.buttonSecondary,
        isCoral && styles.buttonCoral,
        isGhost && styles.buttonGhost,
        (disabled || loading) && styles.dimmed,
        pressed && styles.pressed,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? t.color.textInverse : t.color.brandPrimary} />
      ) : (
        <Row style={styles.buttonContent}>
          {icon && iconPosition === 'left' ? icon : null}
          <NativeText
            style={[
              styles.buttonText,
              variant === 'primary' && styles.buttonTextPrimary,
              isOutline && styles.buttonTextOutline,
              isSecondary && styles.buttonTextSecondary,
              isCoral && styles.buttonTextCoral,
              isGhost && styles.buttonTextGhost,
              textStyle,
            ]}
          >
            {label}
          </NativeText>
          {icon && iconPosition === 'right' ? icon : null}
        </Row>
      )}
    </Pressable>
  );
}

export function IconButton({
  onPress,
  icon,
  label,
  size = 44,
  variant = 'surface',
  style,
}: {
  onPress: () => void;
  icon: ReactNode;
  label: string;
  size?: number;
  variant?: 'surface' | 'brand' | 'glass';
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [
        styles.iconButton,
        { width: size, height: size, borderRadius: size / 2 },
        variant === 'brand' && styles.iconButtonBrand,
        variant === 'glass' && styles.iconButtonGlass,
        pressed && styles.pressed,
        style,
      ]}
    >
      {icon}
    </Pressable>
  );
}

export function Badge({
  label,
  variant = 'brand',
  style,
}: {
  label: string;
  variant?: 'brand' | 'coral' | 'muted';
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View
      style={[
        styles.badge,
        variant === 'brand' && styles.badgeBrand,
        variant === 'coral' && styles.badgeCoral,
        style,
      ]}
    >
      <NativeText
        style={[
          styles.badgeText,
          variant === 'brand' && styles.badgeTextBrand,
          variant === 'coral' && styles.badgeTextCoral,
        ]}
      >
        {label}
      </NativeText>
    </View>
  );
}

export function Avatar({
  uri,
  name = 'Alex',
  size = 40,
  online = true,
  ring = false,
  style,
}: {
  uri?: string | null;
  name?: string | null;
  size?: number;
  online?: boolean;
  ring?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const initials = (name ?? 'U').substring(0, 1).toUpperCase();

  return (
    <View style={[{ width: size, height: size }, style]}>
      <View
        style={[
          styles.avatarContainer,
          { width: size, height: size, borderRadius: size / 2 },
          ring && styles.avatarRing,
        ]}
      >
        {uri ? (
          <Image source={{ uri }} style={{ width: size, height: size, borderRadius: size / 2 }} />
        ) : (
          <View style={[styles.avatarFallback, { borderRadius: size / 2 }]}>
            <NativeText style={[styles.avatarInitial, { fontSize: size * 0.4 }]}>{initials}</NativeText>
          </View>
        )}
      </View>
      {online ? (
        <View
          style={[
            styles.onlineDot,
            {
              width: Math.max(8, size * 0.22),
              height: Math.max(8, size * 0.22),
              borderRadius: size,
              right: 0,
              bottom: 0,
            },
          ]}
        />
      ) : null}
    </View>
  );
}

export function BrandLogo({ subtitle = 'by ATEM' }: { subtitle?: string }) {
  return (
    <View style={styles.brandContainer}>
      <NativeText style={styles.brandTitle}>L U N Q R A</NativeText>
      {subtitle ? <NativeText style={styles.brandSubtitle}>{subtitle}</NativeText> : null}
    </View>
  );
}

export function Input({
  label,
  error,
  style,
  ...props
}: TextInputProps & { label: string; error?: string }) {
  return (
    <Stack style={styles.inputGroup}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        {...props}
        placeholderTextColor={t.color.textMuted}
        style={[styles.input, error ? styles.invalid : undefined, style]}
      />
      {error ? (
        <NativeText accessibilityRole="alert" style={styles.error}>
          {error}
        </NativeText>
      ) : null}
    </Stack>
  );
}

export function TextArea(props: Parameters<typeof Input>[0]) {
  return <Input {...props} multiline textAlignVertical="top" style={[styles.textArea, props.style]} />;
}

export function Divider() {
  return <View style={styles.divider} />;
}

export function LoadingState({ label = 'Connecting to LUNQRA…' }: { label?: string }) {
  return (
    <Row accessibilityLiveRegion="polite" style={styles.loadingRow}>
      <ActivityIndicator color={t.color.brandPrimary} size="large" />
      <Text style={styles.loadingText}>{label}</Text>
    </Row>
  );
}

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <Card>
      <Heading>{title}</Heading>
      <Text tone="secondary">{description}</Text>
    </Card>
  );
}

export function ErrorState({
  title = 'Something went wrong',
  description,
  onRetry,
}: {
  title?: string;
  description: string;
  onRetry?: () => void;
}) {
  return (
    <Card>
      <Heading accessibilityRole="alert">{title}</Heading>
      <Text tone="secondary">{description}</Text>
      {onRetry ? <Button label="Try again" onPress={onRetry} /> : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: t.type.body,
    lineHeight: t.lineHeight.body,
    color: t.color.textPrimary,
  },
  heading: {
    fontSize: t.type.title,
    lineHeight: t.lineHeight.title,
    fontWeight: t.weight.bold,
    color: t.color.textPrimary,
  },
  stack: { gap: t.space.md },
  row: { flexDirection: 'row', alignItems: 'center', gap: t.space.sm },
  card: {
    padding: t.space.lg,
    backgroundColor: t.color.surface,
    borderRadius: t.radius.md,
    gap: t.space.md,
    borderWidth: 1,
    borderColor: t.color.border,
  },
  cardElevated: {
    backgroundColor: t.color.surfaceElevated,
    borderColor: t.color.borderStrong,
  },
  screen: {
    flex: 1,
    backgroundColor: t.color.background,
  },
  content: {
    flexGrow: 1,
    padding: t.space.lg,
    gap: t.space.lg,
    width: '100%',
    maxWidth: t.contentWidth,
    alignSelf: 'center',
  },
  button: {
    minHeight: t.touchTarget,
    paddingVertical: t.space.sm + 4,
    paddingHorizontal: t.space.lg,
    borderRadius: t.radius.pill,
    backgroundColor: t.color.brandPrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPill: {
    borderRadius: t.radius.pill,
    paddingHorizontal: t.space.xl,
  },
  buttonSecondary: {
    backgroundColor: t.color.surfaceElevated,
    borderWidth: 1,
    borderColor: t.color.border,
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: t.color.brandPrimary,
  },
  buttonCoral: {
    backgroundColor: t.color.accentCoral,
  },
  buttonGhost: {
    backgroundColor: 'transparent',
  },
  buttonContent: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: t.space.sm,
  },
  buttonText: {
    color: t.color.textInverse,
    fontWeight: t.weight.bold,
    fontSize: t.type.body,
  },
  buttonTextPrimary: {
    color: t.color.textInverse,
    fontWeight: t.weight.bold,
  },
  buttonTextSecondary: {
    color: t.color.textPrimary,
  },
  buttonTextOutline: {
    color: t.color.brandPrimary,
  },
  buttonTextCoral: {
    color: '#FFFFFF',
  },
  buttonTextGhost: {
    color: t.color.textSecondary,
  },
  dimmed: { opacity: 0.5 },
  pressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
  iconButton: {
    backgroundColor: t.color.surfaceElevated,
    borderWidth: 1,
    borderColor: t.color.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconButtonBrand: {
    backgroundColor: t.color.brandPrimary,
    borderColor: t.color.brandPrimary,
  },
  iconButtonGlass: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderColor: 'rgba(255,255,255,0.12)',
  },
  badge: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: t.radius.pill,
    backgroundColor: t.color.surfaceMuted,
    alignSelf: 'flex-start',
  },
  badgeBrand: {
    backgroundColor: t.color.brandSecondary,
    borderWidth: 1,
    borderColor: 'rgba(212, 255, 50, 0.3)',
  },
  badgeCoral: {
    backgroundColor: t.color.accentCoralMuted,
    borderWidth: 1,
    borderColor: 'rgba(240, 130, 102, 0.4)',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: t.weight.medium,
    color: t.color.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  badgeTextBrand: {
    color: t.color.brandPrimary,
  },
  badgeTextCoral: {
    color: t.color.accentCoral,
  },
  avatarContainer: {
    overflow: 'hidden',
    backgroundColor: t.color.surfaceMuted,
  },
  avatarRing: {
    borderWidth: 2,
    borderColor: t.color.accentCoral,
  },
  avatarFallback: {
    flex: 1,
    backgroundColor: '#30263C',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    color: t.color.textPrimary,
    fontWeight: t.weight.bold,
  },
  onlineDot: {
    position: 'absolute',
    backgroundColor: t.color.onlineGreen,
    borderWidth: 1.5,
    borderColor: t.color.background,
  },
  brandContainer: {
    gap: 1,
  },
  brandTitle: {
    fontSize: 16,
    fontWeight: t.weight.bold,
    letterSpacing: 4,
    color: t.color.textPrimary,
  },
  brandSubtitle: {
    fontSize: 9,
    letterSpacing: 3,
    color: t.color.textMuted,
    textTransform: 'uppercase',
  },
  inputGroup: { gap: t.space.xs },
  inputLabel: {
    fontSize: t.type.caption,
    fontWeight: t.weight.medium,
    color: t.color.textSecondary,
  },
  input: {
    minHeight: t.touchTarget,
    paddingHorizontal: t.space.md,
    paddingVertical: t.space.sm,
    borderWidth: 1,
    borderColor: t.color.border,
    borderRadius: t.radius.md,
    color: t.color.textPrimary,
    backgroundColor: t.color.surface,
    fontSize: t.type.body,
  },
  textArea: { minHeight: t.touchTarget * 2.5 },
  invalid: { borderColor: t.color.danger },
  error: { color: t.color.danger, fontSize: t.type.caption },
  divider: { height: 1, backgroundColor: t.color.border },
  loadingRow: { justifyContent: 'center', padding: t.space.xl, gap: t.space.md },
  loadingText: { color: t.color.textSecondary, fontSize: t.type.body },
});
