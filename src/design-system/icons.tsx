import React from 'react';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { tokens as t } from './tokens';

export interface IconProps {
  size?: number;
  color?: string;
  focused?: boolean;
}

export function HomeIcon({ size = 22, color = t.color.textSecondary }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 10.182V20a1 1 0 0 0 1 1h5v-6h6v6h5a1 1 0 0 0 1-1v-9.818a1 1 0 0 0-.379-.784l-8-6.222a1 1 0 0 0-1.242 0l-8 6.222A1 1 0 0 0 3 10.182Z"
        fill={color}
      />
    </Svg>
  );
}

export function DiscoverIcon({ size = 22, color = t.color.textSecondary }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8">
      <Circle cx="12" cy="12" r="10" />
      <Path d="m16.24 7.76-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12Z" fill={color} />
    </Svg>
  );
}

export function PlusIcon({ size = 24, color = '#000000' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round">
      <Path d="M12 5v14M5 12h14" />
    </Svg>
  );
}

export function MessagesIcon({ size = 22, color = t.color.textSecondary }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2Z"
        fill={color}
      />
    </Svg>
  );
}

export function ProfileIcon({ size = 22, color = t.color.textSecondary }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8">
      <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <Circle cx="12" cy="7" r="4" />
    </Svg>
  );
}

export function BellIcon({ size = 22, color = t.color.textPrimary, hasUnread = true }: IconProps & { hasUnread?: boolean }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8">
      <Path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" />
      {hasUnread && (
        <Circle cx="19" cy="5" r="3.5" fill={t.color.accentCoral} stroke={t.color.background} strokeWidth="1" />
      )}
    </Svg>
  );
}

export function SearchIcon({ size = 20, color = t.color.textMuted }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <Circle cx="11" cy="11" r="8" />
      <Path d="m21 21-4.35-4.35" strokeLinecap="round" />
    </Svg>
  );
}

export function ArrowRightIcon({ size = 18, color = '#000000' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <Path d="M5 12h14M12 5l7 7-7 7" />
    </Svg>
  );
}

export function ChevronLeftIcon({ size = 22, color = t.color.textPrimary }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round">
      <Path d="m15 18-6-6 6-6" />
    </Svg>
  );
}

export function ChevronRightIcon({ size = 18, color = t.color.textMuted }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
      <Path d="m9 18 6-6-6-6" />
    </Svg>
  );
}

export function VerifiedCheckIcon({ size = 16 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="10" fill={t.color.accentCoral} />
      <Path d="m8.5 12.5 2.5 2.5 5-5" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function SparklesIcon({ size = 16, color = t.color.accentCoral }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <Path d="m12 0 2.8 7.2L22 10l-7.2 2.8L12 20l-2.8-7.2L2 10l7.2-2.8L12 0Z" />
    </Svg>
  );
}

export function HeartIcon({ size = 16, color = t.color.textMuted }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8">
      <Path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </Svg>
  );
}

export function CommentBubbleIcon({ size = 16, color = t.color.textMuted }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8">
      <Path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </Svg>
  );
}

export function MoreHorizontalIcon({ size = 20, color = t.color.textMuted }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <Circle cx="12" cy="12" r="2" />
      <Circle cx="19" cy="12" r="2" />
      <Circle cx="5" cy="12" r="2" />
    </Svg>
  );
}

export function SproutIcon({ size = 24, color = t.color.brandPrimary }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <Path d="M7 20h10M12 20v-8M12 12c-3.5 0-6-2.5-6-6 4 0 6 2.5 6 6ZM12 10c3 0 5-2 5-5-3.5 0-5 2-5 5Z" />
    </Svg>
  );
}

export function HandshakeIcon({ size = 24, color = t.color.textSecondary }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <Path d="m11 17 2 2a1 1 0 0 0 1.4 0l4.6-4.6a1 1 0 0 0 0-1.4l-3-3M18 10l-3-3a1 1 0 0 0-1.4 0L9 11M3 11l4.6-4.6a1 1 0 0 1 1.4 0l3 3M7 15l2 2" />
    </Svg>
  );
}

export function LightbulbIcon({ size = 24, color = t.color.textSecondary }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round">
      <Path d="M9 18h6M10 22h4M15 9a3 3 0 1 0-6 0c0 1.5.5 2.5 1.5 3.5.5.5 1 1 1 2.5h1c0-1.5.5-2 1-2.5 1-1 1.5-2 1.5-3.5Z" />
    </Svg>
  );
}

export function CategoryGridIcon({ size = 20, color = t.color.textSecondary }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round">
      <Rect x="3" y="3" width="7" height="7" rx="1.5" />
      <Rect x="14" y="3" width="7" height="7" rx="1.5" />
      <Rect x="14" y="14" width="7" height="7" rx="1.5" />
      <Rect x="3" y="14" width="7" height="7" rx="1.5" />
    </Svg>
  );
}

export function PriceTagIcon({ size = 20, color = t.color.textSecondary }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round">
      <Path d="m20.59 13.41-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82Z" />
      <Circle cx="7" cy="7" r="1.5" fill={color} />
    </Svg>
  );
}

export function MapPinIcon({ size = 20, color = t.color.textSecondary }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round">
      <Path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <Circle cx="12" cy="10" r="3" />
    </Svg>
  );
}

export function CalendarIcon({ size = 20, color = t.color.textSecondary }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round">
      <Rect x="3" y="4" width="18" height="18" rx="2" />
      <Path d="M16 2v4M8 2v4M3 10h18" />
    </Svg>
  );
}

export function BriefcaseIcon({ size = 20, color = t.color.textSecondary }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round">
      <Rect x="2" y="7" width="20" height="14" rx="2" />
      <Path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
    </Svg>
  );
}

export function UserGroupIcon({ size = 20, color = t.color.textSecondary }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round">
      <Path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <Circle cx="9" cy="7" r="4" />
      <Path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </Svg>
  );
}

export function FilterIcon({ size = 20, color = t.color.textSecondary }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round">
      <Path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />
    </Svg>
  );
}

