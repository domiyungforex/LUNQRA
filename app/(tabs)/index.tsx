import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Pressable,
  TextInput,
  ImageBackground,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { tokens as t } from '@/design-system/tokens';
import { Heading, Text } from '@/design-system/primitives';
import { useAuthSession } from '@/features/auth/useAuthSession';
import {
  BellIcon,
  SearchIcon,
  ArrowRightIcon,
  SparklesIcon,
  ProfileIcon,
  BriefcaseIcon,
  UserGroupIcon,
  HandshakeIcon,
} from '@/design-system/icons';

const CATEGORIES = [
  { id: 'for-you', label: 'For You', icon: ProfileIcon },
  { id: 'matches', label: 'Matches', icon: HandshakeIcon },
  { id: 'people', label: 'People', icon: ProfileIcon },
  { id: 'communities', label: 'Communities', icon: UserGroupIcon },
  { id: 'opportunities', label: 'Opportunities', icon: BriefcaseIcon },
];

const SUGGESTIONS = [
  'Find collaborators',
  'Explore opportunities',
  'Meet creative people',
  'Launch a project',
];

export default function HomeScreen() {
  const router = useRouter();
  const { profile } = useAuthSession();
  const [activeCategory, setActiveCategory] = useState('for-you');
  const [searchQuery, setSearchQuery] = useState('');

  const displayName = profile?.display_name?.split(' ')[0] || 'Alex';

  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      router.push('/(tabs)/create');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Bar */}
        <View style={styles.topHeader}>
          <View>
            <Text style={styles.brandTitle}>L U N Q R A</Text>
            <Text style={styles.brandSubtitle}>b y   A T E M</Text>
          </View>

          <View style={styles.headerActions}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Notifications"
              style={styles.headerIconButton}
            >
              <BellIcon size={22} color={t.color.textPrimary} hasUnread />
            </Pressable>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Profile"
              onPress={() => router.push('/(tabs)/profile')}
              style={styles.avatarButton}
            >
              <Image
                source={require('@/../assets/images/alex_rivera_avatar.jpg')}
                style={styles.avatarImage}
              />
              <View style={styles.avatarOnlineDot} />
            </Pressable>
          </View>
        </View>

        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.heroMain}>
            <Text style={styles.greetingText}>Good evening, {displayName}</Text>
            <Heading style={styles.heroTitle} serif>
              What do you{'\n'}need today?
            </Heading>
          </View>

          {/* Right Motto Pillar */}
          <View style={styles.mottoPillar}>
            <View style={styles.mottoLine} />
            <View style={styles.mottoTextContainer}>
              <Text style={styles.mottoItem}>PEOPLE</Text>
              <Text style={styles.mottoItem}>IDEAS</Text>
              <Text style={styles.mottoItem}>OPPORTUNITIES</Text>
              <Text style={styles.mottoItem}>A BRIGHTER YOU</Text>
            </View>
          </View>
        </View>

        {/* Intent Search Bar */}
        <View style={styles.searchBar}>
          <SearchIcon size={20} color={t.color.textMuted} />
          <TextInput
            placeholder="Ask, search, or set an intention..."
            placeholderTextColor={t.color.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearchSubmit}
            style={styles.searchInput}
          />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Submit search"
            onPress={handleSearchSubmit}
            style={({ pressed }) => [
              styles.searchArrowButton,
              pressed && styles.searchArrowButtonPressed,
            ]}
          >
            <ArrowRightIcon size={18} color="#0B080E" />
          </Pressable>
        </View>

        {/* Suggestion Chips */}
        <View style={styles.suggestionsRow}>
          <View style={styles.tryLabelContainer}>
            <SparklesIcon size={14} color={t.color.accentCoral} />
            <Text style={styles.tryText}>Try:</Text>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.suggestionScroll}>
            {SUGGESTIONS.map((item, idx) => (
              <Pressable
                key={idx}
                onPress={() => {
                  setSearchQuery(item);
                }}
                style={styles.suggestionChip}
              >
                <Text style={styles.suggestionChipText}>{item}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Category Pills */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesScroll}>
          {CATEGORIES.map(cat => {
            const isSelected = activeCategory === cat.id;
            const Icon = cat.icon;
            return (
              <Pressable
                key={cat.id}
                onPress={() => setActiveCategory(cat.id)}
                style={styles.categoryItem}
              >
                <View
                  style={[
                    styles.categoryCircle,
                    isSelected ? styles.categoryCircleActive : styles.categoryCircleInactive,
                  ]}
                >
                  <Icon
                    size={22}
                    color={isSelected ? t.color.brandPrimary : t.color.textSecondary}
                  />
                </View>
                <Text
                  style={[
                    styles.categoryLabel,
                    isSelected ? styles.categoryLabelActive : styles.categoryLabelInactive,
                  ]}
                >
                  {cat.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* For You Section */}
        <View style={styles.sectionHeader}>
          <Heading style={styles.sectionTitle} serif>
            For You
          </Heading>
          <Pressable style={styles.seeAllButton}>
            <Text style={styles.seeAllText}>See all →</Text>
          </Pressable>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalCardsScroll}>
          {/* Main Featured Card */}
          <ImageBackground
            source={require('@/../assets/images/celestial_welcome.jpg')}
            style={styles.featuredCard}
            imageStyle={styles.featuredCardImage}
          >
            <LinearGradient
              colors={['rgba(11, 8, 14, 0.45)', 'rgba(11, 8, 14, 0.88)']}
              style={styles.featuredCardGradient}
            >
              <Text style={styles.featuredTag}>FEATURED FOR YOU</Text>
              <Heading style={styles.featuredCardTitle} serif>
                Turn your ideas{'\n'}into real momentum.
              </Heading>
              <Text style={styles.featuredCardSubtitle}>
                Find people, resources, and opportunities to bring what you care about to life.
              </Text>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Explore Opportunities"
                onPress={() => router.push('/(tabs)/create')}
                style={({ pressed }) => [
                  styles.exploreButton,
                  pressed && { opacity: 0.9 },
                ]}
              >
                <Text style={styles.exploreButtonText}>Explore Opportunities</Text>
                <ArrowRightIcon size={16} color="#0B080E" />
              </Pressable>
            </LinearGradient>
          </ImageBackground>

          {/* Secondary For You Card */}
          <ImageBackground
            source={require('@/../assets/images/cosmic_mountains.jpg')}
            style={styles.alignedCard}
            imageStyle={styles.featuredCardImage}
          >
            <LinearGradient
              colors={['rgba(11, 8, 14, 0.4)', 'rgba(11, 8, 14, 0.85)']}
              style={styles.featuredCardGradient}
            >
              <Heading style={styles.alignedCardTitle} serif>
                A more{'\n'}aligned you.
              </Heading>
              <Text style={styles.alignedCardSubtitle}>
                People. Projects. Purpose.{'\n'}All in one place.
              </Text>
            </LinearGradient>
          </ImageBackground>
        </ScrollView>

        {/* Matches Section */}
        <View style={styles.sectionHeader}>
          <Heading style={styles.sectionTitle} serif>
            Matches
          </Heading>
          <Pressable style={styles.seeAllButton}>
            <Text style={styles.seeAllText}>See all →</Text>
          </Pressable>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalCardsScroll}>
          {/* Match Card 1 */}
          <View style={styles.matchCard}>
            <View style={styles.matchCardHeader}>
              <View style={styles.overlappingAvatars}>
                <Image
                  source={require('@/../assets/images/alex_rivera_avatar.jpg')}
                  style={[styles.miniAvatar, { zIndex: 3 }]}
                />
                <View style={[styles.miniAvatar, styles.miniAvatarSecondary, { zIndex: 2 }]}>
                  <Text style={styles.avatarInitials}>DP</Text>
                </View>
                <View style={[styles.miniAvatar, styles.miniAvatarTertiary, { zIndex: 1 }]}>
                  <Text style={styles.avatarInitials}>MC</Text>
                </View>
              </View>

              <View style={styles.matchBadge}>
                <Text style={styles.matchBadgeText}>92% match</Text>
              </View>
            </View>

            <Text style={styles.matchCardText}>
              Creative collaborators who share your interests.
            </Text>

            <Pressable
              onPress={() => router.push('/(tabs)/messages')}
              style={styles.matchArrowButton}
            >
              <ArrowRightIcon size={16} color={t.color.textPrimary} />
            </Pressable>
          </View>

          {/* Match Card 2 */}
          <View style={styles.matchCard}>
            <View style={styles.matchIconCircle}>
              <BriefcaseIcon size={20} color={t.color.textPrimary} />
            </View>
            <Text style={styles.matchCardText}>
              3 new opportunities in your fields
            </Text>
            <Pressable
              onPress={() => router.push('/(tabs)/create')}
              style={styles.matchArrowButton}
            >
              <ArrowRightIcon size={16} color={t.color.textPrimary} />
            </Pressable>
          </View>

          {/* Match Card 3 */}
          <View style={styles.matchCard}>
            <View style={styles.matchIconCircle}>
              <UserGroupIcon size={20} color={t.color.textPrimary} />
            </View>
            <Text style={styles.matchCardText}>
              5 people match your goals
            </Text>
            <Pressable
              onPress={() => router.push('/(tabs)/messages')}
              style={styles.matchArrowButton}
            >
              <ArrowRightIcon size={16} color={t.color.textPrimary} />
            </Pressable>
          </View>
        </ScrollView>

        {/* Communities Section */}
        <View style={styles.sectionHeader}>
          <Heading style={styles.sectionTitle} serif>
            Communities
          </Heading>
          <Pressable style={styles.seeAllButton}>
            <Text style={styles.seeAllText}>See all →</Text>
          </Pressable>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalCardsScroll}>
          {[
            { name: 'Sustainable Futures', count: '12.4K members' },
            { name: 'Indie Creators', count: '8.1K members' },
            { name: 'Tech for Good', count: '10.7K members' },
          ].map((comm, idx) => (
            <View key={idx} style={styles.communityCard}>
              <ImageBackground
                source={require('@/../assets/images/cosmic_mountains.jpg')}
                style={styles.communityCardImage}
                imageStyle={{ borderRadius: t.radius.md }}
              >
                <LinearGradient
                  colors={['transparent', 'rgba(11, 8, 14, 0.95)']}
                  style={styles.communityGradient}
                >
                  <Text style={styles.communityName}>{comm.name}</Text>
                  <View style={styles.communityFooter}>
                    <Text style={styles.communityCount}>{comm.count}</Text>
                    <Pressable style={styles.joinButton}>
                      <Text style={styles.joinButtonText}>Join</Text>
                    </Pressable>
                  </View>
                </LinearGradient>
              </ImageBackground>
            </View>
          ))}
        </ScrollView>

        {/* Bottom Padding for floating tab bar */}
        <View style={{ height: 110 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: t.color.background,
  },
  scrollContent: {
    paddingHorizontal: t.space.lg,
    paddingTop: t.space.sm,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: t.space.sm,
  },
  brandTitle: {
    fontSize: 16,
    fontWeight: t.weight.bold,
    letterSpacing: 5,
    color: t.color.textPrimary,
  },
  brandSubtitle: {
    fontSize: 8.5,
    letterSpacing: 3,
    color: t.color.textMuted,
    textTransform: 'uppercase',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: t.space.md,
  },
  headerIconButton: {
    padding: 6,
  },
  avatarButton: {
    position: 'relative',
  },
  avatarImage: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  avatarOnlineDot: {
    position: 'absolute',
    bottom: -1,
    right: -1,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: t.color.onlineGreen,
    borderWidth: 2,
    borderColor: t.color.background,
  },
  heroSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingTop: t.space.lg,
    paddingBottom: t.space.md,
  },
  heroMain: {
    flex: 1,
    gap: 4,
  },
  greetingText: {
    fontSize: t.type.body,
    fontWeight: t.weight.medium,
    color: t.color.accentCoral,
  },
  heroTitle: {
    fontSize: 34,
    lineHeight: 38,
    color: t.color.textPrimary,
    fontWeight: '400',
  },
  mottoPillar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: t.space.md,
    gap: t.space.sm,
    paddingTop: 8,
  },
  mottoLine: {
    width: 1,
    height: 60,
    backgroundColor: 'rgba(240, 130, 102, 0.4)',
  },
  mottoTextContainer: {
    gap: 4,
  },
  mottoItem: {
    fontSize: 8,
    letterSpacing: 1.5,
    color: t.color.textMuted,
    fontWeight: t.weight.bold,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: t.color.surface,
    borderWidth: 1,
    borderColor: t.color.border,
    borderRadius: t.radius.pill,
    paddingLeft: t.space.md,
    paddingRight: 6,
    height: 52,
    marginVertical: t.space.md,
    gap: t.space.sm,
  },
  searchInput: {
    flex: 1,
    color: t.color.textPrimary,
    fontSize: t.type.body,
  },
  searchArrowButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: t.color.brandPrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchArrowButtonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.95 }],
  },
  suggestionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: t.space.sm,
    marginBottom: t.space.lg,
  },
  tryLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  tryText: {
    fontSize: 12,
    color: t.color.accentCoral,
    fontWeight: t.weight.medium,
  },
  suggestionScroll: {
    gap: t.space.xs + 2,
    paddingRight: t.space.md,
  },
  suggestionChip: {
    backgroundColor: t.color.surfaceElevated,
    borderWidth: 1,
    borderColor: t.color.border,
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: t.radius.pill,
  },
  suggestionChipText: {
    fontSize: 12,
    color: t.color.textSecondary,
  },
  categoriesScroll: {
    gap: t.space.lg,
    paddingVertical: t.space.sm,
    marginBottom: t.space.md,
  },
  categoryItem: {
    alignItems: 'center',
    gap: 6,
  },
  categoryCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryCircleActive: {
    borderWidth: 2,
    borderColor: t.color.brandPrimary,
    backgroundColor: 'rgba(212, 255, 50, 0.08)',
  },
  categoryCircleInactive: {
    backgroundColor: t.color.surface,
    borderWidth: 1,
    borderColor: t.color.border,
  },
  categoryLabel: {
    fontSize: 12,
    fontWeight: t.weight.medium,
  },
  categoryLabelActive: {
    color: t.color.brandPrimary,
  },
  categoryLabelInactive: {
    color: t.color.textMuted,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: t.space.lg,
    marginBottom: t.space.md,
  },
  sectionTitle: {
    fontSize: 22,
    color: t.color.textPrimary,
  },
  seeAllButton: {
    paddingVertical: 4,
  },
  seeAllText: {
    fontSize: 13,
    color: t.color.brandPrimary,
    fontWeight: t.weight.medium,
  },
  horizontalCardsScroll: {
    gap: t.space.md,
    paddingRight: t.space.lg,
  },
  featuredCard: {
    width: 290,
    height: 190,
    borderRadius: t.radius.md,
    overflow: 'hidden',
  },
  featuredCardImage: {
    borderRadius: t.radius.md,
  },
  featuredCardGradient: {
    flex: 1,
    padding: t.space.md,
    justifyContent: 'space-between',
  },
  featuredTag: {
    fontSize: 9.5,
    letterSpacing: 1.5,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: t.weight.bold,
  },
  featuredCardTitle: {
    fontSize: 20,
    lineHeight: 24,
    color: '#FFFFFF',
    fontWeight: '400',
  },
  featuredCardSubtitle: {
    fontSize: 11,
    lineHeight: 15,
    color: 'rgba(255, 255, 255, 0.75)',
  },
  exploreButton: {
    alignSelf: 'flex-start',
    backgroundColor: t.color.brandPrimary,
    borderRadius: t.radius.pill,
    paddingVertical: 7,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  exploreButtonText: {
    color: '#0B080E',
    fontSize: 12,
    fontWeight: t.weight.bold,
  },
  alignedCard: {
    width: 170,
    height: 190,
    borderRadius: t.radius.md,
    overflow: 'hidden',
  },
  alignedCardTitle: {
    fontSize: 19,
    lineHeight: 23,
    color: '#FFFFFF',
  },
  alignedCardSubtitle: {
    fontSize: 11,
    lineHeight: 15,
    color: 'rgba(255, 255, 255, 0.75)',
    marginTop: 'auto',
  },
  matchCard: {
    width: 210,
    height: 150,
    backgroundColor: t.color.surface,
    borderWidth: 1,
    borderColor: t.color.border,
    borderRadius: t.radius.md,
    padding: t.space.md,
    justifyContent: 'space-between',
  },
  matchCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  overlappingAvatars: {
    flexDirection: 'row',
  },
  miniAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: t.color.surface,
  },
  miniAvatarSecondary: {
    marginLeft: -10,
    backgroundColor: '#3D2A45',
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniAvatarTertiary: {
    marginLeft: -10,
    backgroundColor: '#263D45',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: {
    fontSize: 10,
    fontWeight: t.weight.bold,
    color: '#FFFFFF',
  },
  matchBadge: {
    backgroundColor: t.color.accentCoralMuted,
    borderWidth: 1,
    borderColor: 'rgba(240, 130, 102, 0.3)',
    borderRadius: t.radius.pill,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  matchBadgeText: {
    fontSize: 10.5,
    color: t.color.accentCoral,
    fontWeight: t.weight.medium,
  },
  matchCardText: {
    fontSize: 13,
    lineHeight: 17,
    color: t.color.textPrimary,
  },
  matchIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: t.color.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  matchArrowButton: {
    alignSelf: 'flex-end',
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: t.color.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  communityCard: {
    width: 170,
    height: 130,
    borderRadius: t.radius.md,
    overflow: 'hidden',
  },
  communityCardImage: {
    width: '100%',
    height: '100%',
  },
  communityGradient: {
    flex: 1,
    padding: t.space.md,
    justifyContent: 'flex-end',
    gap: 4,
  },
  communityName: {
    fontSize: 13,
    fontWeight: t.weight.bold,
    color: '#FFFFFF',
  },
  communityFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  communityCount: {
    fontSize: 10.5,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  joinButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: t.radius.pill,
    paddingVertical: 3,
    paddingHorizontal: 10,
  },
  joinButtonText: {
    fontSize: 10.5,
    fontWeight: t.weight.medium,
    color: '#FFFFFF',
  },
});
