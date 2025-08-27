import { Theme, Typography, Spacing, BorderRadius, Shadows, ComponentStyles } from './types';

// Base typography (shared across all themes)
export const baseTypography: Typography = {
  fontFamily: 'System',
  fontFamilyBold: 'System',
  fontFamilyLight: 'System',
  fontSize: {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 16,
    xl: 18,
    xxl: 24,
  },
  lineHeight: {
    xs: 14,
    sm: 16,
    md: 20,
    lg: 22,
    xl: 24,
    xxl: 32,
  },
  fontWeight: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
};

// Base spacing (shared across all themes)
export const baseSpacing: Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

// Base border radius (shared across all themes)
export const baseBorderRadius: BorderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

// Base shadows (shared across all themes)
export const baseShadows: Shadows = {
  none: {
    elevation: 0,
    shadowOpacity: 0,
  },
  sm: {
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
  },
  md: {
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  lg: {
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
  },
  xl: {
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
  },
};

// Base component styles (shared across all themes)
export const baseComponentStyles: ComponentStyles = {
  button: {
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 40,
    fontSize: 14,
  },
  input: {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    minHeight: 40,
    fontSize: 14,
    borderWidth: 1,
  },
  card: {
    borderRadius: 8,
    padding: 16,
    elevation: 2,
    shadowOpacity: 0.18,
  },
  modal: {
    borderRadius: 8,
    padding: 16,
    elevation: 8,
    shadowOpacity: 0.30,
  },
  tag: {
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    fontSize: 12,
  },
  badge: {
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    fontSize: 10,
  },
};
