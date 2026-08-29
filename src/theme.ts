export const colors = {
  bg: '#0A0E13',
  surface: '#121821',
  surface2: '#1A222D',
  surface3: '#232D3B',
  border: '#253141',
  borderSoft: '#1C2530',
  text: '#F3F6FA',
  text2: '#A7B2C1',
  text3: '#6B7787',
  accent: '#17D1B0',
  accentDim: '#0F9C84',
  accentSoft: 'rgba(23, 209, 176, 0.14)',
  gold: '#F5C542',
  taxi: '#F5C542',
  danger: '#FF5A5F',
  dangerSoft: 'rgba(255, 90, 95, 0.14)',
  white: '#FFFFFF',
  black: '#000000',
  mapRoute: '#17D1B0',
  ok: '#2FBF71',
} as const;

export const radii = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 22,
  xl: 28,
  pill: 999,
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const shadows = {
  card: {
    shadowColor: '#000000',
    shadowOpacity: 0.35,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
  floating: {
    shadowColor: '#000000',
    shadowOpacity: 0.5,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 16,
  },
} as const;
