import React from 'react';
import { TouchableOpacity, Text, StyleSheet, TouchableOpacityProps, TextStyle, ViewStyle } from 'react-native';
import { useTheme, useIsThemeProvided, createThemedStyles } from '../themes';

interface ButtonProps extends TouchableOpacityProps {
  title?: string;
  onPress?: () => void;
  type?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  backgroundColor?: string;
  textColor?: string;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const Button: React.FC<ButtonProps> = ({
  title = 'Button',
  onPress = () => {},
  type = 'primary',
  size = 'medium',
  backgroundColor,
  textColor,
  disabled = false,
  style = {},
  textStyle = {},
  ...props
}) => {
  const { colors, components, spacing, borderRadius } = useTheme();
  const isThemeProvided = useIsThemeProvided();
  
  // Use theme-aware styles if ThemeProvider is available
  const getButtonStyles = () => {
    if (!isThemeProvided) {
      // Fallback to original styles if no theme provider
      return {
        button: {
          paddingVertical: 12,
          paddingHorizontal: 24,
          borderRadius: 8,
          alignItems: 'center' as const,
          justifyContent: 'center' as const,
          minHeight: 48,
          backgroundColor: disabled ? '#CCCCCC' : (backgroundColor || '#007AFF'),
        },
        text: {
          fontSize: 16,
          fontWeight: '600' as const,
          color: textColor || '#FFFFFF',
        },
      };
    }

    // Theme-aware styles
    const getBackgroundColor = () => {
      if (backgroundColor) return backgroundColor;
      if (disabled) return colors.buttonDisabled;
      
      switch (type) {
        case 'primary':
          return colors.primary;
        case 'secondary':
          return colors.secondary;
        case 'danger':
          return colors.error;
        case 'ghost':
          return 'transparent';
        default:
          return colors.primary;
      }
    };

    const getTextColor = () => {
      if (textColor) return textColor;
      if (disabled) return colors.textDisabled;
      if (type === 'ghost') return colors.primary;
      return colors.buttonText;
    };

    const getSizeStyles = () => {
      switch (size) {
        case 'small':
          return {
            paddingVertical: spacing.xs,
            paddingHorizontal: spacing.sm,
            minHeight: 32,
            fontSize: 12,
          };
        case 'large':
          return {
            paddingVertical: spacing.lg,
            paddingHorizontal: spacing.xl,
            minHeight: 56,
            fontSize: 18,
          };
        default: // medium
          return {
            paddingVertical: components.button.paddingVertical,
            paddingHorizontal: components.button.paddingHorizontal,
            minHeight: components.button.minHeight,
            fontSize: components.button.fontSize,
          };
      }
    };

    const sizeStyles = getSizeStyles();
    
    return {
      button: {
        backgroundColor: getBackgroundColor(),
        borderRadius: components.button.borderRadius,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
        paddingVertical: sizeStyles.paddingVertical,
        paddingHorizontal: sizeStyles.paddingHorizontal,
        minHeight: sizeStyles.minHeight,
        borderWidth: type === 'ghost' ? 1 : 0,
        borderColor: type === 'ghost' ? colors.primary : 'transparent',
      },
      text: {
        fontSize: sizeStyles.fontSize,
        fontWeight: '600' as const,
        color: getTextColor(),
      },
    };
  };

  const styles = getButtonStyles();

  return (
    <TouchableOpacity
      style={[
        styles.button,
        style,
      ]}
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
      {...props}
    >
      <Text style={[styles.text, textStyle]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default Button;
