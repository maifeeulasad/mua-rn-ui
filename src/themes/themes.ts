import { Theme, ColorPalette } from './types';
import { baseTypography, baseSpacing, baseBorderRadius, baseShadows, baseComponentStyles } from './base';

// Light Theme Colors
const lightColors: ColorPalette = {
  // Primary colors
  primary: '#1890ff',
  primaryLight: '#40a9ff',
  primaryDark: '#096dd9',
  
  // Secondary colors
  secondary: '#52c41a',
  secondaryLight: '#73d13d',
  secondaryDark: '#389e0d',
  
  // Background colors
  background: '#ffffff',
  surface: '#fafafa',
  card: '#ffffff',
  
  // Text colors
  text: '#333333',
  textSecondary: '#666666',
  textDisabled: '#999999',
  
  // Status colors
  success: '#52c41a',
  warning: '#fa8c16',
  error: '#ff4d4f',
  info: '#1890ff',
  
  // Border and divider colors
  border: '#e8e8e8',
  divider: '#f0f0f0',
  
  // Overlay colors
  overlay: 'rgba(0, 0, 0, 0.5)',
  mask: 'rgba(0, 0, 0, 0.45)',
  
  // Component specific colors
  buttonText: '#ffffff',
  buttonDisabled: '#f5f5f5',
  inputBackground: '#ffffff',
  inputBorder: '#d9d9d9',
  inputPlaceholder: '#bfbfbf',
  
  // Semantic colors
  link: '#1890ff',
  visited: '#722ed1',
  
  // Shadow color
  shadow: '#000000',
};

// Dark Theme Colors
const darkColors: ColorPalette = {
  // Primary colors
  primary: '#1890ff',
  primaryLight: '#40a9ff',
  primaryDark: '#096dd9',
  
  // Secondary colors
  secondary: '#52c41a',
  secondaryLight: '#73d13d',
  secondaryDark: '#389e0d',
  
  // Background colors
  background: '#141414',
  surface: '#1f1f1f',
  card: '#262626',
  
  // Text colors
  text: '#ffffff',
  textSecondary: '#bfbfbf',
  textDisabled: '#595959',
  
  // Status colors
  success: '#52c41a',
  warning: '#fa8c16',
  error: '#ff4d4f',
  info: '#1890ff',
  
  // Border and divider colors
  border: '#434343',
  divider: '#303030',
  
  // Overlay colors
  overlay: 'rgba(0, 0, 0, 0.7)',
  mask: 'rgba(0, 0, 0, 0.65)',
  
  // Component specific colors
  buttonText: '#ffffff',
  buttonDisabled: '#262626',
  inputBackground: '#262626',
  inputBorder: '#434343',
  inputPlaceholder: '#8c8c8c',
  
  // Semantic colors
  link: '#40a9ff',
  visited: '#b37feb',
  
  // Shadow color
  shadow: '#000000',
};

// Aesthetic (Purple) Theme Colors
const aestheticColors: ColorPalette = {
  // Primary colors
  primary: '#722ed1',
  primaryLight: '#9254de',
  primaryDark: '#531dab',
  
  // Secondary colors
  secondary: '#eb2f96',
  secondaryLight: '#f759ab',
  secondaryDark: '#c41d7f',
  
  // Background colors
  background: '#f9f0ff',
  surface: '#f0f0ff',
  card: '#fafafa',
  
  // Text colors
  text: '#2f1b69',
  textSecondary: '#531dab',
  textDisabled: '#b37feb',
  
  // Status colors
  success: '#52c41a',
  warning: '#fa8c16',
  error: '#ff4d4f',
  info: '#722ed1',
  
  // Border and divider colors
  border: '#d3adf7',
  divider: '#efdbff',
  
  // Overlay colors
  overlay: 'rgba(114, 46, 209, 0.5)',
  mask: 'rgba(114, 46, 209, 0.45)',
  
  // Component specific colors
  buttonText: '#ffffff',
  buttonDisabled: '#f0f0ff',
  inputBackground: '#ffffff',
  inputBorder: '#d3adf7',
  inputPlaceholder: '#b37feb',
  
  // Semantic colors
  link: '#722ed1',
  visited: '#531dab',
  
  // Shadow color
  shadow: '#722ed1',
};

// Light Theme
export const lightTheme: Theme = {
  name: 'light',
  colors: lightColors,
  typography: baseTypography,
  spacing: baseSpacing,
  borderRadius: baseBorderRadius,
  shadows: baseShadows,
  components: baseComponentStyles,
};

// Dark Theme
export const darkTheme: Theme = {
  name: 'dark',
  colors: darkColors,
  typography: baseTypography,
  spacing: baseSpacing,
  borderRadius: baseBorderRadius,
  shadows: baseShadows,
  components: baseComponentStyles,
};

// Aesthetic Theme
export const aestheticTheme: Theme = {
  name: 'aesthetic',
  colors: aestheticColors,
  typography: baseTypography,
  spacing: baseSpacing,
  borderRadius: baseBorderRadius,
  shadows: baseShadows,
  components: baseComponentStyles,
};

// Default theme export
export const defaultTheme = lightTheme;
