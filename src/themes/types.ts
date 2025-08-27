import { TextStyle, ViewStyle } from 'react-native';

export interface ColorPalette {
  // Primary colors
  primary: string;
  primaryLight: string;
  primaryDark: string;
  
  // Secondary colors
  secondary: string;
  secondaryLight: string;
  secondaryDark: string;
  
  // Background colors
  background: string;
  surface: string;
  card: string;
  
  // Text colors
  text: string;
  textSecondary: string;
  textDisabled: string;
  
  // Status colors
  success: string;
  warning: string;
  error: string;
  info: string;
  
  // Border and divider colors
  border: string;
  divider: string;
  
  // Overlay colors
  overlay: string;
  mask: string;
  
  // Component specific colors
  buttonText: string;
  buttonDisabled: string;
  inputBackground: string;
  inputBorder: string;
  inputPlaceholder: string;
  
  // Semantic colors
  link: string;
  visited: string;
  
  // Shadow color
  shadow: string;
}

export interface Typography {
  // Font families
  fontFamily: string;
  fontFamilyBold: string;
  fontFamilyLight: string;
  
  // Font sizes
  fontSize: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
  };
  
  // Line heights
  lineHeight: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
  };
  
  // Font weights
  fontWeight: {
    light: TextStyle['fontWeight'];
    normal: TextStyle['fontWeight'];
    medium: TextStyle['fontWeight'];
    semibold: TextStyle['fontWeight'];
    bold: TextStyle['fontWeight'];
  };
}

export interface Spacing {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
}

export interface BorderRadius {
  none: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  full: number;
}

export interface Shadows {
  none: ViewStyle;
  sm: ViewStyle;
  md: ViewStyle;
  lg: ViewStyle;
  xl: ViewStyle;
}

export interface ComponentStyles {
  button: {
    borderRadius: number;
    paddingHorizontal: number;
    paddingVertical: number;
    minHeight: number;
    fontSize: number;
  };
  input: {
    borderRadius: number;
    paddingHorizontal: number;
    paddingVertical: number;
    minHeight: number;
    fontSize: number;
    borderWidth: number;
  };
  card: {
    borderRadius: number;
    padding: number;
    elevation: number;
    shadowOpacity: number;
  };
  modal: {
    borderRadius: number;
    padding: number;
    elevation: number;
    shadowOpacity: number;
  };
  tag: {
    borderRadius: number;
    paddingHorizontal: number;
    paddingVertical: number;
    fontSize: number;
  };
  badge: {
    borderRadius: number;
    minWidth: number;
    height: number;
    fontSize: number;
  };
}

export interface Theme {
  name: string;
  colors: ColorPalette;
  typography: Typography;
  spacing: Spacing;
  borderRadius: BorderRadius;
  shadows: Shadows;
  components: ComponentStyles;
}

export type ThemeMode = 'light' | 'dark' | 'aesthetic';

export interface ThemeContextType {
  theme: Theme;
  themeName: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  colors: ColorPalette;
  typography: Typography;
  spacing: Spacing;
  borderRadius: BorderRadius;
  shadows: Shadows;
  components: ComponentStyles;
}
