import { StyleSheet, View, ImageBackground, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Heading, Text } from '@/design-system/primitives';
import { tokens as t } from '@/design-system/tokens';

export function WelcomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('@/../assets/images/celestial_welcome.jpg')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <LinearGradient
          colors={['rgba(11, 8, 14, 0.4)', 'rgba(11, 8, 14, 0.2)', 'rgba(11, 8, 14, 0.85)', '#0B080E']}
          locations={[0, 0.35, 0.75, 1]}
          style={styles.gradient}
        >
          <SafeAreaView style={styles.safeArea} edges={['top', 'bottom', 'left', 'right']}>
            {/* Header Brand */}
            <View style={styles.header}>
              <Text style={styles.brandTitle}>L U N Q R A</Text>
              <Text style={styles.brandSubtitle}>b y   A T E M</Text>
            </View>

            {/* Hero Copy */}
            <View style={styles.heroSection}>
              <Heading style={styles.title} serif>
                From{'\n'}intention{'\n'}to impact<Text style={styles.period}>.</Text>
              </Heading>
              <Text style={styles.subtitle}>
                People. Ideas. Opportunities.{'\n'}A brighter you.
              </Text>
            </View>

            {/* Call to Actions */}
            <View style={styles.actionSection}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Create an account"
                onPress={() => router.push('/(auth)/sign-up')}
                style={({ pressed }) => [
                  styles.getStartedButton,
                  pressed && styles.buttonPressed,
                ]}
              >
                <Text style={styles.getStartedText}>Get Started</Text>
                <Text style={styles.arrowText}>→</Text>
              </Pressable>

              <View style={styles.signInRow}>
                <View style={styles.dividerLine} />
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Sign in"
                  onPress={() => router.push('/(auth)/sign-in')}
                  style={({ pressed }) => [
                    styles.signInButton,
                    pressed && styles.buttonPressed,
                  ]}
                >
                  <Text style={styles.signInText}>Sign in</Text>
                </Pressable>
                <View style={styles.dividerLine} />
              </View>
            </View>
          </SafeAreaView>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: t.color.background,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: t.space.xl,
    justifyContent: 'space-between',
  },
  header: {
    paddingTop: t.space.md,
    gap: 3,
  },
  brandTitle: {
    fontSize: 18,
    fontWeight: t.weight.bold,
    letterSpacing: 6,
    color: t.color.textPrimary,
  },
  brandSubtitle: {
    fontSize: 9,
    letterSpacing: 4,
    color: t.color.textSecondary,
    textTransform: 'uppercase',
  },
  heroSection: {
    marginTop: 'auto',
    marginBottom: t.space.xxl,
    gap: t.space.md,
  },
  title: {
    fontSize: 48,
    lineHeight: 52,
    color: t.color.textPrimary,
    fontWeight: '400',
  },
  period: {
    color: t.color.accentCoral,
    fontSize: 52,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: t.type.body,
    lineHeight: 22,
    color: t.color.textSecondary,
    fontWeight: t.weight.regular,
  },
  actionSection: {
    gap: t.space.lg,
    paddingBottom: t.space.lg,
  },
  getStartedButton: {
    backgroundColor: t.color.brandPrimary,
    borderRadius: t.radius.pill,
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: t.space.sm,
    shadowColor: t.color.brandPrimary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
  buttonPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.98 }],
  },
  getStartedText: {
    color: t.color.textInverse,
    fontSize: 18,
    fontWeight: t.weight.bold,
  },
  arrowText: {
    color: t.color.textInverse,
    fontSize: 20,
    fontWeight: t.weight.bold,
  },
  signInRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: t.space.md,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  signInButton: {
    paddingVertical: t.space.xs,
    paddingHorizontal: t.space.sm,
  },
  signInText: {
    color: t.color.textPrimary,
    fontSize: t.type.body,
    fontWeight: t.weight.medium,
  },
});
