import { ViewStyle, TextStyle } from 'react-native';
import { Theme, ColorPalette } from './types';

// Helper function to create themed styles
export const createThemedStyles = <T extends Record<string, ViewStyle | TextStyle>>(
  styleFactory: (theme: Theme) => T
) => {
  return styleFactory;
};

// Helper function to get color with opacity
export const getColorWithOpacity = (color: string, opacity: number): string => {
  // Handle hex colors
  if (color.startsWith('#')) {
    const hex = color.slice(1);
    const alpha = Math.round(opacity * 255).toString(16).padStart(2, '0');
    return `#${hex}${alpha}`;
  }
  
  // Handle rgba colors
  if (color.startsWith('rgba')) {
    return color.replace(/[\d\.]+\)$/g, `${opacity})`);
  }
  
  // Handle rgb colors
  if (color.startsWith('rgb')) {
    return color.replace('rgb', 'rgba').replace(')', `, ${opacity})`);
  }
  
  return color;
};

// Helper function to create component variants
export const createVariants = <T extends Record<string, any>>(
  variants: T
): T => {
  return variants;
};

// Helper function to merge theme overrides
export const mergeTheme = (baseTheme: Theme, overrides: Partial<Theme>): Theme => {
  return {
    ...baseTheme,
    ...overrides,
    colors: { ...baseTheme.colors, ...overrides.colors },
    typography: { ...baseTheme.typography, ...overrides.typography },
    spacing: { ...baseTheme.spacing, ...overrides.spacing },
    borderRadius: { ...baseTheme.borderRadius, ...overrides.borderRadius },
    shadows: { ...baseTheme.shadows, ...overrides.shadows },
    components: { ...baseTheme.components, ...overrides.components },
  };
};

// Helper function to get status color
export const getStatusColor = (status: 'success' | 'warning' | 'error' | 'info', colors: ColorPalette): string => {
  return colors[status];
};

// Helper function to get text color based on background
export const getContrastTextColor = (backgroundColor: string, colors: ColorPalette): string => {
  // Simple contrast logic - can be enhanced with actual contrast calculation
  const darkColors = ['#000000', '#141414', '#1f1f1f', '#262626'];
  const isDark = darkColors.some(dark => backgroundColor.toLowerCase().includes(dark.toLowerCase()));
  
  return isDark ? colors.text : '#ffffff';
};

// Helper function to create responsive spacing
export const createSpacing = (
  top?: number,
  right?: number,
  bottom?: number,
  left?: number
): ViewStyle => {
  return {
    paddingTop: top,
    paddingRight: right,
    paddingBottom: bottom,
    paddingLeft: left,
  };
};

// Helper function to create elevation styles
export const createElevation = (elevation: number): ViewStyle => {
  return {
    elevation,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: elevation / 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: elevation,
  };
};

// Theme-aware style interpolation
export const interpolateStyle = (
  value: number,
  inputRange: number[],
  outputRange: any[]
): any => {
  if (inputRange.length !== outputRange.length) {
    throw new Error('inputRange and outputRange must have the same length');
  }

  if (value <= inputRange[0]) return outputRange[0];
  if (value >= inputRange[inputRange.length - 1]) return outputRange[outputRange.length - 1];

  for (let i = 0; i < inputRange.length - 1; i++) {
    if (value >= inputRange[i] && value <= inputRange[i + 1]) {
      const progress = (value - inputRange[i]) / (inputRange[i + 1] - inputRange[i]);
      
      // Simple interpolation for numbers
      if (typeof outputRange[i] === 'number') {
        return outputRange[i] + (outputRange[i + 1] - outputRange[i]) * progress;
      }
      
      // Return the closest value for non-numeric types
      return progress < 0.5 ? outputRange[i] : outputRange[i + 1];
    }
  }

  return outputRange[0];
};
