import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TextInput,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { tokens as t } from '@/design-system/tokens';
import { Heading, Text, Badge } from '@/design-system/primitives';
import {
  SearchIcon,
  FilterIcon,
  SparklesIcon,
  MapPinIcon,
  ArrowRightIcon,
  BriefcaseIcon,
  SproutIcon,
} from '@/design-system/icons';

const CATEGORIES = ['All', 'Design & Creative', 'AI & Tech', 'Founders', 'Mentorship', 'Impact'];

interface DiscoveryItem {
  id: string;
  category: string;
  title: string;
  creator: string;
  location: string;
  relevance: string;
  badgeVariant: 'brand' | 'coral' | 'muted';
  matchPercent: number;
}

const DISCOVERY_ITEMS: DiscoveryItem[] = [
  {
    id: '1',
    category: 'Design & Creative',
    title: 'Brand Designer seeking Web3 & AI founders for regenerative projects',
    creator: 'Elena Vance',
    location: 'Berlin, DE',
    relevance: 'High intent alignment with your Design skills',
    badgeVariant: 'brand',
    matchPercent: 96,
  },
  {
    id: '2',
    category: 'AI & Tech',
    title: 'Building multi-agent reasoning graphs for climate intelligence',
    creator: 'Kaelen Thorne',
    location: 'San Francisco, CA',
    relevance: 'Actively searching for AI Systems Architects',
    badgeVariant: 'coral',
    matchPercent: 92,
  },
  {
    id: '3',
    category: 'Founders',
    title: 'Next-gen Human Intent Protocol: Scaling trusted bilateral coordination',
    creator: 'Alex Rivera',
    location: 'London, UK',
    relevance: 'Mutual intent: Architecture & Protocol Design',
    badgeVariant: 'brand',
    matchPercent: 89,
  },
  {
    id: '4',
    category: 'Mentorship',
    title: 'Open office hours: Scaling from $0 to $10M ARR in developer tooling',
    creator: 'Devon Vance',
    location: 'New York, NY',
    relevance: '3 slots remaining this week',
    badgeVariant: 'muted',
    matchPercent: 84,
  },
];

export default function DiscoverScreen() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = DISCOVERY_ITEMS.filter(item => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchesQuery = !searchQuery.trim() ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.creator.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>INTENT EXPLORER</Text>
            <Heading style={styles.title}>
              Discover
            </Heading>
          </View>
          <View style={styles.headerIconPill}>
            <SparklesIcon size={18} color={t.color.brandPrimary} />
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchBarContainer}>
          <SearchIcon size={18} color={t.color.textMuted} />
          <TextInput
            placeholder="Search intents, people, or capabilities..."
            placeholderTextColor={t.color.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
          />
          <Pressable style={styles.filterButton} accessibilityLabel="Filter options">
            <FilterIcon size={16} color={t.color.textSecondary} />
          </Pressable>
        </View>

        {/* Category Pills Carousel */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesScroll}
        >
          {CATEGORIES.map(category => {
            const isSelected = activeCategory === category;
            return (
              <Pressable
                key={category}
                onPress={() => setActiveCategory(category)}
                style={[
                  styles.categoryPill,
                  isSelected && styles.categoryPillActive,
                ]}
              >
                <Text
                  style={[
                    styles.categoryPillText,
                    isSelected && styles.categoryPillTextActive,
                  ]}
                >
                  {category}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Section Heading */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Intent Matches</Text>
          <Text style={styles.sectionCount}>{filteredItems.length} found</Text>
        </View>

        {/* Discovery Feed */}
        <View style={styles.feedList}>
          {filteredItems.map(item => (
            <Pressable
              key={item.id}
              style={({ pressed }) => [
                styles.itemCard,
                pressed && styles.itemCardPressed,
              ]}
            >
              <View style={styles.itemTopRow}>
                <Badge
                  label={item.category}
                  variant={item.badgeVariant}
                />
                <View style={styles.matchScoreBadge}>
                  <SparklesIcon size={12} color={t.color.brandPrimary} />
                  <Text style={styles.matchScoreText}>{item.matchPercent}% match</Text>
                </View>
              </View>

              <Text style={styles.itemTitle}>{item.title}</Text>

              <View style={styles.itemMetaRow}>
                <View style={styles.creatorInfo}>
                  <BriefcaseIcon size={14} color={t.color.textMuted} />
                  <Text style={styles.creatorText}>{item.creator}</Text>
                </View>
                <View style={styles.locationInfo}>
                  <MapPinIcon size={14} color={t.color.textMuted} />
                  <Text style={styles.locationText}>{item.location}</Text>
                </View>
              </View>

              <View style={styles.relevanceBox}>
                <SproutIcon size={14} color={t.color.textSecondary} />
                <Text style={styles.relevanceText}>{item.relevance}</Text>
              </View>

              <View style={styles.cardFooter}>
                <Text style={styles.viewDetailsText}>View intent & connect</Text>
                <ArrowRightIcon size={14} color={t.color.brandPrimary} />
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: t.color.background,
  },
  scrollContent: {
    paddingHorizontal: t.space.lg,
    paddingTop: t.space.md,
    paddingBottom: 110,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: t.space.lg,
  },
  eyebrow: {
    color: t.color.brandPrimary,
    fontSize: 10,
    fontWeight: t.weight.bold,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  title: {
    color: t.color.textPrimary,
  },
  headerIconPill: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: t.color.surfaceElevated,
    borderWidth: 1,
    borderColor: t.color.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: t.color.surfaceElevated,
    borderRadius: t.radius.lg,
    paddingHorizontal: t.space.md,
    height: 48,
    borderWidth: 1,
    borderColor: t.color.border,
    marginBottom: t.space.md,
  },
  searchInput: {
    flex: 1,
    marginLeft: t.space.sm,
    color: t.color.textPrimary,
    fontSize: 14,
  },
  filterButton: {
    padding: t.space.xs,
  },
  categoriesScroll: {
    gap: t.space.sm,
    paddingBottom: t.space.lg,
  },
  categoryPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: t.color.surfaceElevated,
    borderWidth: 1,
    borderColor: t.color.border,
  },
  categoryPillActive: {
    backgroundColor: t.color.brandPrimary,
    borderColor: t.color.brandPrimary,
  },
  categoryPillText: {
    color: t.color.textSecondary,
    fontSize: 13,
    fontWeight: t.weight.medium,
  },
  categoryPillTextActive: {
    color: '#0B080E',
    fontWeight: t.weight.bold,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: t.space.md,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: t.weight.medium,
    color: t.color.textPrimary,
  },
  sectionCount: {
    fontSize: 13,
    color: t.color.textMuted,
  },
  feedList: {
    gap: t.space.md,
  },
  itemCard: {
    backgroundColor: t.color.surfaceElevated,
    borderRadius: t.radius.lg,
    padding: t.space.lg,
    borderWidth: 1,
    borderColor: t.color.border,
  },
  itemCardPressed: {
    borderColor: t.color.borderStrong,
    transform: [{ scale: 0.99 }],
  },
  itemTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: t.space.sm,
  },
  matchScoreBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(212, 255, 50, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  matchScoreText: {
    fontSize: 11,
    fontWeight: t.weight.bold,
    color: t.color.brandPrimary,
  },
  itemTitle: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: t.weight.medium,
    color: t.color.textPrimary,
    marginBottom: t.space.sm,
  },
  itemMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: t.space.md,
    marginBottom: t.space.sm,
  },
  creatorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  creatorText: {
    fontSize: 12,
    color: t.color.textSecondary,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontSize: 12,
    color: t.color.textMuted,
  },
  relevanceBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: t.color.background,
    paddingHorizontal: t.space.sm,
    paddingVertical: 8,
    borderRadius: t.radius.sm,
    marginBottom: t.space.md,
  },
  relevanceText: {
    fontSize: 12,
    color: t.color.textSecondary,
    flex: 1,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: t.color.border,
    paddingTop: t.space.sm,
  },
  viewDetailsText: {
    fontSize: 12,
    fontWeight: t.weight.medium,
    color: t.color.brandPrimary,
  },
});
