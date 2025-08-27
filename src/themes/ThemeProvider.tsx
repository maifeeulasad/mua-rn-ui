import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Theme, ThemeContextType, ThemeMode } from './types';
import { lightTheme, darkTheme, aestheticTheme, defaultTheme } from './themes';

// Theme context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Theme map
const themes: Record<ThemeMode, Theme> = {
  light: lightTheme,
  dark: darkTheme,
  aesthetic: aestheticTheme,
};

// ThemeProvider props
export interface ThemeProviderProps {
  children: ReactNode;
  initialTheme?: ThemeMode;
  theme?: Theme; // Allow custom theme override
}

// ThemeProvider component
export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  initialTheme = 'light',
  theme: customTheme,
}) => {
  const [themeName, setThemeName] = useState<ThemeMode>(initialTheme);
  
  // Use custom theme if provided, otherwise use theme from map
  const currentTheme = customTheme || themes[themeName];
  
  const setTheme = (newTheme: ThemeMode) => {
    if (!customTheme) { // Only allow theme switching if no custom theme is provided
      setThemeName(newTheme);
    }
  };

  const contextValue: ThemeContextType = {
    theme: currentTheme,
    themeName,
    setTheme,
    colors: currentTheme.colors,
    typography: currentTheme.typography,
    spacing: currentTheme.spacing,
    borderRadius: currentTheme.borderRadius,
    shadows: currentTheme.shadows,
    components: currentTheme.components,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook to use theme
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  
  if (!context) {
    // Return default theme if no ThemeProvider is found
    return {
      theme: defaultTheme,
      themeName: 'light',
      setTheme: () => {
        console.warn('setTheme called outside of ThemeProvider context');
      },
      colors: defaultTheme.colors,
      typography: defaultTheme.typography,
      spacing: defaultTheme.spacing,
      borderRadius: defaultTheme.borderRadius,
      shadows: defaultTheme.shadows,
      components: defaultTheme.components,
    };
  }
  
  return context;
};

// Hook to use colors specifically
export const useColors = () => {
  const { colors } = useTheme();
  return colors;
};

// Hook to use typography specifically
export const useTypography = () => {
  const { typography } = useTheme();
  return typography;
};

// Hook to use spacing specifically
export const useSpacing = () => {
  const { spacing } = useTheme();
  return spacing;
};

// Hook to check if theme provider is available
export const useIsThemeProvided = (): boolean => {
  const context = useContext(ThemeContext);
  return context !== undefined;
};

// Export themes for direct usage
export { lightTheme, darkTheme, aestheticTheme, defaultTheme, themes };
