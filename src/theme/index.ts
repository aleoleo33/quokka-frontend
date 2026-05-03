import { Platform } from 'react-native';

export const Theme = {
  colors: {
    primary: '#754C34',
    secondary: '#966749',
    tertiary: '#A97458',

    bg: '#FAFAFA',
    bgWarm: '#F7F5F2',
    background: '#FFFFFF',
    surface: '#F4F3F0',

    text: '#000000',
    textSecondary: '#666666',
    textLight: '#FFFFFF',

    border: '#F0EDE8',
    borderLight: '#F0F0F0',
    divider: '#EAEAEA',

    overlay: 'rgba(117, 76, 52, 0.25)',

    cardPeach: '#F0A78F',
    cardDarkBrown: '#6A544D',

    circle1: '#F4CEC5',
    circle2: '#C98F73',
    circle3: '#8E5A4B',
    circle4: '#684C45',

    success: '#4CAF50',
    successBg: '#E8F5E9',
    successText: '#2E7D32',
    danger: '#D32F2F',
  },

  typography: {
    fontFamily: {
      regular: 'PlusJakartaSans_400Regular',
      medium: 'PlusJakartaSans_500Medium',
      semiBold: 'PlusJakartaSans_600SemiBold',
      bold: 'PlusJakartaSans_700Bold',
    },
    sizes: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 20,
      xl: 24,
      xxl: 32,
    },
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },

  borderRadius: {
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    full: 9999,
  },

  shadow: {
    subtle: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 5,
      elevation: 2,
    },
    card: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    float: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
      elevation: 8,
    },
    elevated: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.15,
      shadowRadius: 16,
      elevation: 10,
    },
  },
} as const;
