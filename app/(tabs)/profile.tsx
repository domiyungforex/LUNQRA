import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Pressable,
  Image,
  ImageBackground,
  type ImageSourcePropType,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { tokens as t } from '@/design-system/tokens';
import { Heading, Text } from '@/design-system/primitives';
import { useAuthSession } from '@/features/auth/useAuthSession';
import {
  BellIcon,
  MoreHorizontalIcon,
  MapPinIcon,
  VerifiedCheckIcon,
  HeartIcon,
  CommentBubbleIcon,
  ArrowRightIcon,
  CategoryGridIcon,
  SproutIcon,
  BriefcaseIcon,
  ProfileIcon,
} from '@/design-system/icons';

type ProfileTab = 'posts' | 'intents' | 'services' | 'about';

interface FeedCard {
  id: string;
  tag: string;
  type: 'thought' | 'intent' | 'post' | 'service';
  title: string;
  excerpt: string;
  likes?: number;
  comments?: number;
  image: ImageSourcePropType;
}

const FEED_CARDS: FeedCard[] = [
  {
    id: '1',
    tag: 'Today · Thought',
    type: 'thought',
    title: 'A quieter, brighter future is possible.',
    excerpt: 'Grateful for the people, ideas and conversations that keep me inspired.',
    likes: 342,
    comments: 28,
    image: require('@/../assets/images/cosmic_mountains.jpg'),
  },
  {
    id: '2',
    tag: '3 days ago · Intent',
    type: 'intent',
    title: 'Build a creative retreat experience',
    excerpt: 'Bringing together curious minds for a week of deep work, nature and new perspectives.',
    likes: 129,
    comments: 17,
    image: require('@/../assets/images/celestial_welcome.jpg'),
  },
  {
    id: '3',
    tag: '1 week ago · Post',
    type: 'post',
    title: 'Moments like this. More of this.',
    excerpt: 'A reminder to step back, look at the horizon, and build with clarity.',
    likes: 511,
    comments: 42,
    image: require('@/../assets/images/celestial_welcome.jpg'),
  },
  {
    id: '4',
    tag: 'Service',
    type: 'service',
    title: '1:1 Creative Coaching',
    excerpt: 'Clarity, direction and accountability for your biggest ideas.',
    image: require('@/../assets/images/cosmic_mountains.jpg'),
  },
];

export default function ProfileScreen() {
  const router = useRouter();
  const { profile, signOut } = useAuthSession();
  const [activeTab, setActiveTab] = useState<ProfileTab>('posts');

  const displayName = profile?.display_name || 'Alex Rivera';
  const username = profile?.username || 'alexrivera';
  const bio = profile?.bio || 'Designer, builder, and curious human. Exploring ideas, people and possibilities for a brighter tomorrow.';
  const location = profile?.location || 'San Francisco, CA';

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Header */}
        <View style={styles.topHeader}>
          <View>
            <Text style={styles.brandTitle}>L U N Q R A</Text>
            <Text style={styles.brandSubtitle}>b y   A T E M</Text>
          </View>

          <View style={styles.headerActions}>
            <Pressable style={styles.headerIconButton}>
              <BellIcon size={22} color={t.color.textPrimary} hasUnread />
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Options"
              onPress={async () => {
                await signOut();
                router.replace('/(auth)/welcome');
              }}
              style={styles.moreButton}
            >
              <MoreHorizontalIcon size={20} color={t.color.textPrimary} />
            </Pressable>
          </View>
        </View>

        {/* Profile Hero Card with Celestial Backdrop */}
        <View style={styles.profileHero}>
          {/* Header Banner Backdrop */}
          <ImageBackground
            source={require('@/../assets/images/cosmic_mountains.jpg')}
            style={styles.bannerBackdrop}
            imageStyle={styles.bannerImage}
          >
            <LinearGradient
              colors={['transparent', 'rgba(11, 8, 14, 0.95)', '#0B080E']}
              locations={[0, 0.65, 1]}
              style={styles.bannerGradient}
            />
          </ImageBackground>

          <View style={styles.profileInfoContainer}>
            {/* Avatar & Name Row */}
            <View style={styles.avatarRow}>
              <View style={styles.avatarContainer}>
                <Image
                  source={require('@/../assets/images/alex_rivera_avatar.jpg')}
                  style={styles.avatar}
                />
                <View style={styles.onlineBadge} />
              </View>

              <View style={styles.nameDetails}>
                <View style={styles.nameWithBadge}>
                  <Heading style={styles.profileName} serif>
                    {displayName}
                  </Heading>
                  <VerifiedCheckIcon size={18} />
                </View>

                <Text style={styles.profileHandle}>@{username}</Text>

                <View style={styles.locationRow}>
                  <MapPinIcon size={14} color={t.color.accentCoral} />
                  <Text style={styles.locationText}>{location}</Text>
                </View>
              </View>
            </View>

            {/* Bio */}
            <Text style={styles.bioText}>{bio}</Text>

            {/* Stats & Actions Row */}
            <View style={styles.statsAndActionsRow}>
              <View style={styles.statsGroup}>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>128</Text>
                  <Text style={styles.statLabel}>Posts</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>4.2K</Text>
                  <Text style={styles.statLabel}>Followers</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>684</Text>
                  <Text style={styles.statLabel}>Following</Text>
                </View>
              </View>

              <View style={styles.profileActionButtons}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Add contact"
                  style={styles.addContactButton}
                >
                  <ProfileIcon size={18} color={t.color.brandPrimary} />
                </Pressable>

                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Edit Profile"
                  style={styles.editProfileButton}
                >
                  <Text style={styles.editProfileText}>Edit Profile</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>

        {/* Tab Pills */}
        <View style={styles.tabPillsRow}>
          <Pressable
            onPress={() => setActiveTab('posts')}
            style={[
              styles.tabPill,
              activeTab === 'posts' ? styles.tabPillActive : styles.tabPillInactive,
            ]}
          >
            <CategoryGridIcon size={16} color={activeTab === 'posts' ? t.color.brandPrimary : t.color.textSecondary} />
            <Text style={[styles.tabPillText, activeTab === 'posts' && styles.tabPillTextActive]}>
              Posts
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setActiveTab('intents')}
            style={[
              styles.tabPill,
              activeTab === 'intents' ? styles.tabPillActive : styles.tabPillInactive,
            ]}
          >
            <SproutIcon size={16} color={activeTab === 'intents' ? t.color.brandPrimary : t.color.textSecondary} />
            <Text style={[styles.tabPillText, activeTab === 'intents' && styles.tabPillTextActive]}>
              Intents
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setActiveTab('services')}
            style={[
              styles.tabPill,
              activeTab === 'services' ? styles.tabPillActive : styles.tabPillInactive,
            ]}
          >
            <BriefcaseIcon size={16} color={activeTab === 'services' ? t.color.brandPrimary : t.color.textSecondary} />
            <Text style={[styles.tabPillText, activeTab === 'services' && styles.tabPillTextActive]}>
              Services
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setActiveTab('about')}
            style={[
              styles.tabPill,
              activeTab === 'about' ? styles.tabPillActive : styles.tabPillInactive,
            ]}
          >
            <ProfileIcon size={16} color={activeTab === 'about' ? t.color.brandPrimary : t.color.textSecondary} />
            <Text style={[styles.tabPillText, activeTab === 'about' && styles.tabPillTextActive]}>
              About
            </Text>
          </Pressable>
        </View>

        {/* 2-Column Masonry Feed Grid */}
        <View style={styles.masonryGrid}>
          {FEED_CARDS.map(card => (
            <View key={card.id} style={styles.gridCard}>
              <ImageBackground
                source={card.image}
                style={styles.cardImage}
                imageStyle={{ borderRadius: t.radius.md }}
              >
                <LinearGradient
                  colors={['rgba(11, 8, 14, 0.2)', 'rgba(11, 8, 14, 0.95)']}
                  locations={[0.2, 0.9]}
                  style={styles.cardGradient}
                >
                  <Text style={styles.cardTag}>{card.tag}</Text>
                  <Heading style={styles.cardTitle} serif>
                    {card.title}
                  </Heading>
                  <Text style={styles.cardExcerpt} numberOfLines={2}>
                    {card.excerpt}
                  </Text>

                  {/* Card Footer with Social Stats or Action */}
                  {card.type === 'service' ? (
                    <Pressable style={styles.serviceActionButton}>
                      <ArrowRightIcon size={16} color="#0B080E" />
                    </Pressable>
                  ) : (
                    <View style={styles.cardSocialFooter}>
                      <View style={styles.socialStat}>
                        <HeartIcon size={14} color={t.color.accentCoral} />
                        <Text style={styles.socialText}>{card.likes}</Text>
                      </View>
                      <View style={styles.socialStat}>
                        <CommentBubbleIcon size={14} color={t.color.textMuted} />
                        <Text style={styles.socialText}>{card.comments}</Text>
                      </View>
                      <Pressable style={{ marginLeft: 'auto' }}>
                        <MoreHorizontalIcon size={16} color={t.color.textMuted} />
                      </Pressable>
                    </View>
                  )}
                </LinearGradient>
              </ImageBackground>
            </View>
          ))}
        </View>

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
    gap: t.space.sm,
  },
  headerIconButton: {
    padding: 6,
  },
  moreButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: t.color.surface,
    borderWidth: 1,
    borderColor: t.color.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileHero: {
    position: 'relative',
    marginTop: t.space.sm,
    marginBottom: t.space.md,
  },
  bannerBackdrop: {
    height: 120,
    width: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    overflow: 'hidden',
  },
  bannerImage: {
    opacity: 0.35,
  },
  bannerGradient: {
    flex: 1,
  },
  profileInfoContainer: {
    paddingTop: 45,
    gap: t.space.md,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: t.space.md,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 82,
    height: 82,
    borderRadius: 41,
    borderWidth: 2.5,
    borderColor: t.color.accentCoral,
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: t.color.onlineGreen,
    borderWidth: 2.5,
    borderColor: t.color.background,
  },
  nameDetails: {
    flex: 1,
    gap: 3,
  },
  nameWithBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  profileName: {
    fontSize: 24,
    lineHeight: 28,
    color: t.color.textPrimary,
  },
  profileHandle: {
    fontSize: 13,
    color: t.color.textMuted,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  locationText: {
    fontSize: 12,
    color: t.color.textSecondary,
  },
  bioText: {
    fontSize: 13,
    lineHeight: 18,
    color: t.color.textSecondary,
  },
  statsAndActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: t.space.xs,
  },
  statsGroup: {
    flexDirection: 'row',
    gap: t.space.md + 4,
  },
  statItem: {
    gap: 1,
  },
  statNumber: {
    fontSize: 16,
    fontWeight: t.weight.bold,
    color: t.color.textPrimary,
  },
  statLabel: {
    fontSize: 11,
    color: t.color.textMuted,
  },
  profileActionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: t.space.sm,
  },
  addContactButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    borderColor: t.color.border,
    backgroundColor: t.color.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editProfileButton: {
    backgroundColor: t.color.brandPrimary,
    borderRadius: t.radius.pill,
    paddingVertical: 9,
    paddingHorizontal: 16,
  },
  editProfileText: {
    color: '#0B080E',
    fontSize: 13,
    fontWeight: t.weight.bold,
  },
  tabPillsRow: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: t.space.md,
  },
  tabPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 8,
    borderRadius: t.radius.pill,
    borderWidth: 1,
  },
  tabPillActive: {
    borderColor: t.color.brandPrimary,
    backgroundColor: 'rgba(212, 255, 50, 0.05)',
  },
  tabPillInactive: {
    borderColor: t.color.border,
    backgroundColor: t.color.surface,
  },
  tabPillText: {
    fontSize: 12,
    fontWeight: t.weight.medium,
    color: t.color.textSecondary,
  },
  tabPillTextActive: {
    color: t.color.brandPrimary,
  },
  masonryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: t.space.md,
    justifyContent: 'space-between',
  },
  gridCard: {
    width: '48%',
    height: 230,
    borderRadius: t.radius.md,
    overflow: 'hidden',
    backgroundColor: t.color.surface,
    borderWidth: 1,
    borderColor: t.color.border,
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardGradient: {
    flex: 1,
    padding: t.space.sm + 4,
    justifyContent: 'flex-end',
    gap: 4,
  },
  cardTag: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: t.weight.medium,
  },
  cardTitle: {
    fontSize: 14.5,
    lineHeight: 18,
    color: '#FFFFFF',
    fontWeight: '400',
  },
  cardExcerpt: {
    fontSize: 11,
    lineHeight: 15,
    color: 'rgba(255, 255, 255, 0.75)',
  },
  cardSocialFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: t.space.sm,
    marginTop: 4,
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  socialStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  socialText: {
    fontSize: 11,
    color: t.color.textMuted,
  },
  serviceActionButton: {
    alignSelf: 'flex-end',
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: t.color.brandPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
});
