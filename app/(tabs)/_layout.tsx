import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Tabs, useRouter } from 'expo-router';
import { tokens as t } from '@/design-system/tokens';
import { Text } from '@/design-system/primitives';
import {
  HomeIcon,
  DiscoverIcon,
  PlusIcon,
  MessagesIcon,
  ProfileIcon,
} from '@/design-system/icons';

type CustomTabBarProps = Parameters<NonNullable<React.ComponentProps<typeof Tabs>['tabBar']>>[0];

function CustomTabBar({ state, descriptors, navigation }: CustomTabBarProps) {
  const router = useRouter();

  return (
    <View style={styles.tabBarContainer}>
      <View style={styles.tabBarBackground}>
        {state.routes.map((route, index: number) => {
          const isFocused = state.index === index;
          const options = descriptors[route.key]?.options;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          // Center Create Button (Index 2)
          if (route.name === 'create') {
            return (
              <View key={route.key} style={styles.centerButtonWrapper}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Create"
                  onPress={() => router.push('/(tabs)/create')}
                  style={({ pressed }) => [
                    styles.centerButton,
                    pressed && styles.centerButtonPressed,
                  ]}
                >
                  <PlusIcon size={26} color="#0B080E" />
                </Pressable>
                <Text style={styles.centerButtonLabel}>Create</Text>
              </View>
            );
          }

          let icon = null;
          let label = 'Home';

          if (route.name === 'index') {
            label = 'Home';
            icon = <HomeIcon size={22} color={isFocused ? t.color.brandPrimary : t.color.textSecondary} />;
          } else if (route.name === 'discover') {
            label = 'Discover';
            icon = <DiscoverIcon size={22} color={isFocused ? t.color.brandPrimary : t.color.textSecondary} />;
          } else if (route.name === 'messages') {
            label = 'Messages';
            icon = (
              <View style={styles.iconWithBadge}>
                <MessagesIcon size={22} color={isFocused ? t.color.brandPrimary : t.color.textSecondary} />
                <View style={styles.coralNotificationDot} />
              </View>
            );
          } else if (route.name === 'profile') {
            label = 'Profile';
            icon = <ProfileIcon size={22} color={isFocused ? t.color.brandPrimary : t.color.textSecondary} />;
          }

          return (
            <Pressable
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options?.tabBarAccessibilityLabel ?? label}
              onPress={onPress}
              style={styles.tabItem}
            >
              <View style={styles.tabIconContainer}>{icon}</View>
              <Text
                style={[
                  styles.tabLabel,
                  isFocused ? styles.tabLabelActive : styles.tabLabelInactive,
                ]}
              >
                {label}
              </Text>
              {isFocused ? <View style={styles.activeIndicatorDot} /> : <View style={styles.indicatorSpacer} />}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="discover" options={{ title: 'Discover' }} />
      <Tabs.Screen name="create" options={{ title: 'Create' }} />
      <Tabs.Screen name="messages" options={{ title: 'Messages' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
  },
  tabBarBackground: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(12, 10, 14, 0.95)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
    paddingTop: 10,
    paddingBottom: 24,
    paddingHorizontal: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  tabIconContainer: {
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWithBadge: {
    position: 'relative',
  },
  coralNotificationDot: {
    position: 'absolute',
    top: -2,
    right: -4,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: t.color.accentCoral,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: t.weight.medium,
  },
  tabLabelActive: {
    color: t.color.brandPrimary,
  },
  tabLabelInactive: {
    color: t.color.textMuted,
  },
  activeIndicatorDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: t.color.brandPrimary,
    marginTop: 1,
  },
  indicatorSpacer: {
    height: 4,
    marginTop: 1,
  },
  centerButtonWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -22,
    gap: 3,
  },
  centerButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: t.color.brandPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: t.color.brandPrimary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 3,
    borderColor: '#0C0A0E',
  },
  centerButtonPressed: {
    transform: [{ scale: 0.94 }],
    opacity: 0.9,
  },
  centerButtonLabel: {
    fontSize: 11,
    color: t.color.textSecondary,
    fontWeight: t.weight.medium,
  },
});
