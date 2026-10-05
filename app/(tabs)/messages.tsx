import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Pressable,
  TextInput,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { tokens as t } from '@/design-system/tokens';
import { Heading, Text } from '@/design-system/primitives';
import {
  BellIcon,
  SearchIcon,
  ArrowRightIcon,
  ChevronRightIcon,
  UserGroupIcon,
  MessagesIcon,
} from '@/design-system/icons';

interface MessageThread {
  id: string;
  name: string;
  avatarType: 'alex' | 'group1' | 'group2' | 'placeholder';
  lastMessage: string;
  time: string;
  unreadCount?: number;
  isGroup?: boolean;
  online?: boolean;
  muted?: boolean;
}

const THREADS: MessageThread[] = [
  {
    id: '1',
    name: 'Maya Chen',
    avatarType: 'alex',
    lastMessage: "That's such a powerful perspective. Would love to hear more!",
    time: '5m ago',
    unreadCount: 2,
    online: true,
  },
  {
    id: '2',
    name: 'Daniel Park',
    avatarType: 'placeholder',
    lastMessage: 'Sharing the resource I mentioned earlier. Let me know what you think!',
    time: '47m ago',
  },
  {
    id: '3',
    name: 'Creative Collaborators',
    avatarType: 'group1',
    lastMessage: 'Sarah: Just dropped a new idea in the group. Excited for your thoughts!',
    time: '2h ago',
    unreadCount: 4,
    isGroup: true,
  },
  {
    id: '4',
    name: 'Priya Kapoor',
    avatarType: 'alex',
    lastMessage: "Let's schedule a time to chat this week. I have a few ideas to share.",
    time: '4h ago',
    online: true,
  },
  {
    id: '5',
    name: 'Sustainable Futures',
    avatarType: 'group2',
    lastMessage: "Alex: This is such a timely topic. Here's an article I found...",
    time: '1d ago',
    isGroup: true,
    muted: true,
  },
  {
    id: '6',
    name: 'Jordan Lee',
    avatarType: 'placeholder',
    lastMessage: 'Appreciate the intro! Looking forward to connecting.',
    time: '1d ago',
    online: true,
  },
  {
    id: '7',
    name: 'Tech for Good',
    avatarType: 'group1',
    lastMessage: "Natalie: The event next month looks incredible. Who's joining?",
    time: '2d ago',
    isGroup: true,
  },
];

export default function MessagesScreen() {
  const router = useRouter();
  const [filter, setFilter] = useState<'all' | 'unread' | 'groups'>('all');
  const [search, setSearch] = useState('');

  const filteredThreads = THREADS.filter(item => {
    if (filter === 'unread' && !item.unreadCount) return false;
    if (filter === 'groups' && !item.isGroup) return false;
    if (search.trim()) {
      return (
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.lastMessage.toLowerCase().includes(search.toLowerCase())
      );
    }
    return true;
  });

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
            <Pressable onPress={() => router.push('/(tabs)/profile')}>
              <Image
                source={require('@/../assets/images/alex_rivera_avatar.jpg')}
                style={styles.avatarImage}
              />
            </Pressable>
          </View>
        </View>

        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.heroMain}>
            <Heading style={styles.heroTitle} serif>
              Messages
            </Heading>
            <Text style={styles.heroSubtitle}>
              Meaningful conversations for a brighter you.
            </Text>
          </View>

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

        {/* Search Bar */}
        <View style={styles.searchBar}>
          <SearchIcon size={20} color={t.color.textMuted} />
          <TextInput
            placeholder="Search messages, people or groups..."
            placeholderTextColor={t.color.textMuted}
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
          />
          <Pressable style={styles.searchArrowButton}>
            <ArrowRightIcon size={18} color="#0B080E" />
          </Pressable>
        </View>

        {/* Filter Pills */}
        <View style={styles.filterPillsRow}>
          {/* All */}
          <Pressable
            onPress={() => setFilter('all')}
            style={[
              styles.filterPill,
              filter === 'all' ? styles.filterPillActive : styles.filterPillInactive,
            ]}
          >
            <MessagesIcon size={16} color={filter === 'all' ? t.color.brandPrimary : t.color.textMuted} />
            <Text style={[styles.filterPillText, filter === 'all' && styles.filterPillTextActive]}>
              All
            </Text>
          </Pressable>

          {/* Unread */}
          <Pressable
            onPress={() => setFilter('unread')}
            style={[
              styles.filterPill,
              filter === 'unread' ? styles.filterPillActive : styles.filterPillInactive,
            ]}
          >
            <View style={styles.unreadFilterDot} />
            <Text style={[styles.filterPillText, filter === 'unread' && styles.filterPillTextActive]}>
              Unread
            </Text>
          </Pressable>

          {/* Groups */}
          <Pressable
            onPress={() => setFilter('groups')}
            style={[
              styles.filterPill,
              filter === 'groups' ? styles.filterPillActive : styles.filterPillInactive,
            ]}
          >
            <UserGroupIcon size={16} color={filter === 'groups' ? t.color.brandPrimary : t.color.textMuted} />
            <Text style={[styles.filterPillText, filter === 'groups' && styles.filterPillTextActive]}>
              Groups
            </Text>
          </Pressable>
        </View>

        {/* Conversation List */}
        <View style={styles.threadList}>
          {filteredThreads.map(thread => (
            <Pressable
              key={thread.id}
              style={({ pressed }) => [
                styles.threadItem,
                pressed && { backgroundColor: t.color.surfaceElevated },
              ]}
            >
              {/* Avatar Column */}
              <View style={styles.avatarWrapper}>
                {thread.avatarType === 'alex' ? (
                  <Image
                    source={require('@/../assets/images/alex_rivera_avatar.jpg')}
                    style={styles.threadAvatar}
                  />
                ) : (
                  <Image
                    source={require('@/../assets/images/cosmic_mountains.jpg')}
                    style={styles.threadAvatar}
                  />
                )}

                {thread.online && <View style={styles.onlineBadge} />}
                {thread.isGroup && (
                  <View style={styles.groupBadge}>
                    <UserGroupIcon size={10} color="#FFFFFF" />
                  </View>
                )}
              </View>

              {/* Message Details */}
              <View style={styles.threadDetails}>
                <View style={styles.threadHeader}>
                  <Text style={styles.threadName}>{thread.name}</Text>
                  <Text style={styles.threadTime}>{thread.time}</Text>
                </View>

                <View style={styles.threadFooter}>
                  <Text style={styles.lastMessage} numberOfLines={1}>
                    {thread.lastMessage}
                  </Text>

                  <View style={styles.threadTrailing}>
                    {thread.unreadCount ? (
                      <View style={styles.unreadBadge}>
                        <Text style={styles.unreadBadgeText}>{thread.unreadCount}</Text>
                      </View>
                    ) : null}

                    {thread.muted ? (
                      <BellIcon size={14} color={t.color.textMuted} hasUnread={false} />
                    ) : null}

                    <ChevronRightIcon size={14} color={t.color.textMuted} />
                  </View>
                </View>
              </View>
            </Pressable>
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
    gap: t.space.md,
  },
  headerIconButton: {
    padding: 6,
  },
  avatarImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.15)',
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
  heroTitle: {
    fontSize: 34,
    lineHeight: 38,
    color: t.color.textPrimary,
  },
  heroSubtitle: {
    fontSize: 13,
    color: t.color.textSecondary,
    marginTop: 2,
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
  filterPillsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: t.space.sm,
    marginBottom: t.space.lg,
  },
  filterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 7,
    paddingHorizontal: 16,
    borderRadius: t.radius.pill,
    borderWidth: 1,
  },
  filterPillActive: {
    borderColor: t.color.brandPrimary,
    backgroundColor: 'rgba(212, 255, 50, 0.08)',
  },
  filterPillInactive: {
    borderColor: t.color.border,
    backgroundColor: t.color.surface,
  },
  filterPillText: {
    fontSize: 13,
    fontWeight: t.weight.medium,
    color: t.color.textSecondary,
  },
  filterPillTextActive: {
    color: t.color.brandPrimary,
  },
  unreadFilterDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: t.color.accentCoral,
  },
  threadList: {
    backgroundColor: t.color.surface,
    borderRadius: t.radius.lg,
    borderWidth: 1,
    borderColor: t.color.border,
    overflow: 'hidden',
  },
  threadItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: t.space.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
    gap: t.space.md,
  },
  avatarWrapper: {
    position: 'relative',
  },
  threadAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: t.color.onlineGreen,
    borderWidth: 2,
    borderColor: t.color.surface,
  },
  groupBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#382D4A',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: t.color.surface,
  },
  threadDetails: {
    flex: 1,
    gap: 4,
  },
  threadHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  threadName: {
    fontSize: 15,
    fontWeight: t.weight.bold,
    color: t.color.textPrimary,
  },
  threadTime: {
    fontSize: 11,
    color: t.color.textMuted,
  },
  threadFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: t.space.sm,
  },
  lastMessage: {
    flex: 1,
    fontSize: 12.5,
    lineHeight: 16,
    color: t.color.textSecondary,
  },
  threadTrailing: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  unreadBadge: {
    backgroundColor: t.color.accentCoral,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  unreadBadgeText: {
    fontSize: 10,
    fontWeight: t.weight.bold,
    color: '#FFFFFF',
  },
});
