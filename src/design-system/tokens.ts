export const tokens = {
  color: {
    background: '#F5F6FA', surface: '#FFFFFF', surfaceElevated: '#FFFFFF',
    surfaceMuted: '#E9ECF5', border: '#D9DDEA', borderStrong: '#81899F',
    textPrimary: '#18213B', textSecondary: '#48536F', textMuted: '#626D85',
    textInverse: '#FFFFFF', brandPrimary: '#3845B9', brandSecondary: '#E0E5FF',
    success: '#176541', warning: '#805800', danger: '#B0263B', info: '#255BA0',
  },
  space: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48, xxxl: 64 },
  radius: { sm: 8, md: 16, lg: 24, pill: 999 },
  type: { caption: 13, body: 17, title: 26, display: 42 },
  lineHeight: { caption: 20, body: 26, title: 34, display: 48 },
  weight: { regular: '400', medium: '600', bold: '700' },
  elevation: { card: 0, overlay: 8 },
  icon: { sm: 20, md: 24 },
  motion: { fast: 150, standard: 250 },
  touchTarget: 48,
  contentWidth: 640,
} as const;
