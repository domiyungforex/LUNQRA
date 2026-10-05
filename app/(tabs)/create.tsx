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
  ChevronLeftIcon,
  ChevronRightIcon,
  BellIcon,
  ArrowRightIcon,
  SproutIcon,
  HandshakeIcon,
  LightbulbIcon,
  CategoryGridIcon,
  PriceTagIcon,
  MapPinIcon,
  CalendarIcon,
  SparklesIcon,
} from '@/design-system/icons';

type IntentType = 'need' | 'offer' | 'opportunity';

export default function CreateIntentScreen() {
  const router = useRouter();
  const [intentType, setIntentType] = useState<IntentType>('need');
  const [intentText, setIntentText] = useState('');
  const [category, setCategory] = useState('Select a category');
  const [budget, setBudget] = useState('Any budget');
  const [location, setLocation] = useState('Remote, Anywhere');
  const [deadline, setDeadline] = useState('No deadline');
  const [published, setPublished] = useState(false);

  const handlePublish = () => {
    if (!intentText.trim()) return;
    setPublished(true);
    setTimeout(() => {
      setPublished(false);
      setIntentText('');
      router.push('/(tabs)');
    }, 1200);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Header */}
        <View style={styles.topHeader}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Back"
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <ChevronLeftIcon size={20} color={t.color.textPrimary} />
          </Pressable>

          <View style={styles.brandTitleContainer}>
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

        {/* Title Section with Motto Pillar */}
        <View style={styles.heroSection}>
          <View style={styles.heroMain}>
            <Text style={styles.createTag}>CREATE</Text>
            <Heading style={styles.title} serif>
              Create an Intent
            </Heading>
            <Text style={styles.subtitle}>
              Express what you need, offer, or are looking for. Be open, thoughtful, and specific — LUNQRA will help you find the right people.
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

        {/* Intent Type Cards (3 Cards) */}
        <View style={styles.intentTypeRow}>
          {/* Need Card */}
          <Pressable
            onPress={() => setIntentType('need')}
            style={[
              styles.typeCard,
              intentType === 'need' ? styles.typeCardActive : styles.typeCardInactive,
            ]}
          >
            <SproutIcon size={24} color={intentType === 'need' ? t.color.brandPrimary : t.color.textMuted} />
            <Text style={[styles.typeTitle, intentType === 'need' && styles.typeTitleActive]}>
              Need
            </Text>
            <Text style={styles.typeDesc}>Get help or support</Text>
          </Pressable>

          {/* Offer Card */}
          <Pressable
            onPress={() => setIntentType('offer')}
            style={[
              styles.typeCard,
              intentType === 'offer' ? styles.typeCardActive : styles.typeCardInactive,
            ]}
          >
            <HandshakeIcon size={24} color={intentType === 'offer' ? t.color.brandPrimary : t.color.textMuted} />
            <Text style={[styles.typeTitle, intentType === 'offer' && styles.typeTitleActive]}>
              Offer
            </Text>
            <Text style={styles.typeDesc}>Share your skills or resources</Text>
          </Pressable>

          {/* Opportunity Card */}
          <Pressable
            onPress={() => setIntentType('opportunity')}
            style={[
              styles.typeCard,
              intentType === 'opportunity' ? styles.typeCardActive : styles.typeCardInactive,
            ]}
          >
            <LightbulbIcon size={24} color={intentType === 'opportunity' ? t.color.brandPrimary : t.color.textMuted} />
            <Text style={[styles.typeTitle, intentType === 'opportunity' && styles.typeTitleActive]}>
              Opportunity
            </Text>
            <Text style={styles.typeDesc}>Find collaborators or explore ideas</Text>
          </Pressable>
        </View>

        {/* Describe Your Intent Input Box */}
        <View style={styles.describeHeader}>
          <Heading style={styles.describeTitle} serif>
            Describe your intent
          </Heading>
          <Text style={styles.charCount}>{intentText.length}/500</Text>
        </View>

        <View style={styles.inputCard}>
          <TextInput
            placeholder="What do you need? Be as specific or open as you like... e.g. I'm looking for a creative collaborator to help me bring a wellness app idea to life..."
            placeholderTextColor={t.color.textMuted}
            multiline
            numberOfLines={5}
            maxLength={500}
            value={intentText}
            onChangeText={setIntentText}
            style={styles.textInputArea}
            textAlignVertical="top"
          />

          <View style={styles.promptHintBox}>
            <SparklesIcon size={14} color={t.color.accentCoral} />
            <Text style={styles.promptHintText}>
              <Text style={{ color: t.color.accentCoral, fontWeight: t.weight.medium }}>Try: </Text>
              Be clear about your goals, timeline, and what you&apos;re looking for in a person or collaboration.
            </Text>
          </View>
        </View>

        {/* Metadata Selectors */}
        <View style={styles.metadataList}>
          {/* Category */}
          <Pressable
            onPress={() => {
              const options = ['Design & Creative', 'Software & AI', 'Business Strategy', 'Community & Social'];
              const nextIndex = (options.indexOf(category) + 1) % options.length;
              const next = options[nextIndex] ?? options[0]!;
              setCategory(next);
            }}
            style={styles.metaRow}
          >
            <View style={styles.metaLeft}>
              <CategoryGridIcon size={20} color={t.color.textSecondary} />
              <Text style={styles.metaLabel}>Category</Text>
            </View>
            <View style={styles.metaRight}>
              <Text style={category === 'Select a category' ? styles.metaPlaceholder : styles.metaValue}>
                {category}
              </Text>
              <ChevronRightIcon size={16} color={t.color.textMuted} />
            </View>
          </Pressable>

          {/* Budget */}
          <Pressable
            onPress={() => {
              const options = ['Any budget', 'Equity / Rev-share', '$500 - $2,000', '$2,000 - $10,000+'];
              const nextIndex = (options.indexOf(budget) + 1) % options.length;
              const next = options[nextIndex] ?? options[0]!;
              setBudget(next);
            }}
            style={styles.metaRow}
          >
            <View style={styles.metaLeft}>
              <PriceTagIcon size={20} color={t.color.textSecondary} />
              <Text style={styles.metaLabel}>Budget</Text>
            </View>
            <View style={styles.metaRight}>
              <Text style={styles.metaValue}>{budget}</Text>
              <ChevronRightIcon size={16} color={t.color.textMuted} />
            </View>
          </Pressable>

          {/* Location */}
          <Pressable
            onPress={() => {
              const options = ['Remote, Anywhere', 'San Francisco, CA', 'New York, NY', 'Europe', 'Africa'];
              const nextIndex = (options.indexOf(location) + 1) % options.length;
              const next = options[nextIndex] ?? options[0]!;
              setLocation(next);
            }}
            style={styles.metaRow}
          >
            <View style={styles.metaLeft}>
              <MapPinIcon size={20} color={t.color.textSecondary} />
              <Text style={styles.metaLabel}>Location</Text>
            </View>
            <View style={styles.metaRight}>
              <Text style={styles.metaValue}>{location}</Text>
              <ChevronRightIcon size={16} color={t.color.textMuted} />
            </View>
          </Pressable>

          {/* Deadline */}
          <Pressable
            onPress={() => {
              const options = ['No deadline', 'Within 2 weeks', 'Within 1 month', 'Flexible'];
              const nextIndex = (options.indexOf(deadline) + 1) % options.length;
              const next = options[nextIndex] ?? options[0]!;
              setDeadline(next);
            }}
            style={styles.metaRow}
          >
            <View style={styles.metaLeft}>
              <CalendarIcon size={20} color={t.color.textSecondary} />
              <Text style={styles.metaLabel}>Deadline</Text>
            </View>
            <View style={styles.metaRight}>
              <Text style={styles.metaValue}>{deadline}</Text>
              <ChevronRightIcon size={16} color={t.color.textMuted} />
            </View>
          </Pressable>
        </View>

        {/* Publish Intent Button */}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Publish Intent"
          onPress={handlePublish}
          disabled={!intentText.trim() || published}
          style={({ pressed }) => [
            styles.publishButton,
            (!intentText.trim() || published) && styles.publishButtonDisabled,
            pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] },
          ]}
        >
          <Text style={styles.publishButtonText}>
            {published ? 'Intent Published! ✓' : 'Publish Intent'}
          </Text>
          {!published && <ArrowRightIcon size={18} color="#0B080E" />}
        </Pressable>

        {/* Disclaimer */}
        <Text style={styles.disclaimerText}>
          Your intent will be visible to the LUNQRA community, helping the right people find and connect with you.
        </Text>

        <View style={{ height: 120 }} />
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
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: t.color.surface,
    borderWidth: 1,
    borderColor: t.color.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandTitleContainer: {
    alignItems: 'center',
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
  createTag: {
    fontSize: 12,
    fontWeight: t.weight.bold,
    color: t.color.accentCoral,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 34,
    lineHeight: 38,
    color: t.color.textPrimary,
  },
  subtitle: {
    fontSize: 12.5,
    lineHeight: 18,
    color: t.color.textSecondary,
    marginTop: 4,
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
  intentTypeRow: {
    flexDirection: 'row',
    gap: t.space.sm,
    marginVertical: t.space.md,
  },
  typeCard: {
    flex: 1,
    backgroundColor: t.color.surface,
    borderRadius: t.radius.md,
    padding: t.space.md,
    alignItems: 'center',
    textAlign: 'center',
    gap: 6,
    borderWidth: 1,
  },
  typeCardActive: {
    borderColor: t.color.brandPrimary,
    backgroundColor: 'rgba(212, 255, 50, 0.05)',
  },
  typeCardInactive: {
    borderColor: t.color.border,
  },
  typeTitle: {
    fontSize: 15,
    fontWeight: t.weight.bold,
    color: t.color.textPrimary,
  },
  typeTitleActive: {
    color: t.color.brandPrimary,
  },
  typeDesc: {
    fontSize: 10,
    lineHeight: 13,
    color: t.color.textMuted,
    textAlign: 'center',
  },
  describeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: t.space.md,
    marginBottom: t.space.sm,
  },
  describeTitle: {
    fontSize: 20,
    color: t.color.textPrimary,
  },
  charCount: {
    fontSize: 12,
    color: t.color.textMuted,
  },
  inputCard: {
    backgroundColor: t.color.surface,
    borderWidth: 1,
    borderColor: 'rgba(240, 130, 102, 0.25)',
    borderRadius: t.radius.md,
    padding: t.space.md,
    gap: t.space.md,
  },
  textInputArea: {
    minHeight: 100,
    color: t.color.textPrimary,
    fontSize: 14,
    lineHeight: 20,
  },
  promptHintBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(240, 130, 102, 0.08)',
    borderRadius: t.radius.sm,
    padding: t.space.sm,
    gap: 8,
  },
  promptHintText: {
    flex: 1,
    fontSize: 11,
    lineHeight: 16,
    color: t.color.textSecondary,
  },
  metadataList: {
    gap: t.space.sm,
    marginVertical: t.space.lg,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: t.color.surface,
    borderWidth: 1,
    borderColor: t.color.border,
    borderRadius: t.radius.md,
    paddingHorizontal: t.space.md,
    height: 52,
  },
  metaLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: t.space.sm + 2,
  },
  metaLabel: {
    fontSize: 14,
    fontWeight: t.weight.medium,
    color: t.color.textPrimary,
  },
  metaRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaPlaceholder: {
    fontSize: 13,
    color: t.color.textMuted,
  },
  metaValue: {
    fontSize: 13,
    color: t.color.textSecondary,
  },
  publishButton: {
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
    shadowRadius: 14,
    elevation: 8,
    marginTop: t.space.xs,
  },
  publishButtonDisabled: {
    opacity: 0.5,
  },
  publishButtonText: {
    color: '#0B080E',
    fontSize: 16,
    fontWeight: t.weight.bold,
  },
  disclaimerText: {
    fontSize: 11.5,
    lineHeight: 16,
    color: t.color.textMuted,
    textAlign: 'center',
    marginTop: t.space.md,
    paddingHorizontal: t.space.md,
  },
});
