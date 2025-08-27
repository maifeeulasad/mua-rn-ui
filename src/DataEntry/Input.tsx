import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TextInputProps,
} from 'react-native';
import { useForm } from './Form';
import { useTheme, useIsThemeProvided } from '../themes';

interface InputProps extends Omit<TextInputProps, 'style'> {
  name?: string;
  label?: string;
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
  style?: ViewStyle;
  inputStyle?: TextStyle;
  labelStyle?: TextStyle;
  errorStyle?: TextStyle;
  containerStyle?: ViewStyle;
  multiline?: boolean;
  numberOfLines?: number;
  maxLength?: number;
  showCharCount?: boolean;
}

const Input: React.FC<InputProps> = ({
  name,
  label,
  placeholder,
  value: propValue,
  onChangeText,
  error: propError,
  disabled = false,
  required = false,
  leftIcon,
  rightIcon,
  onRightIconPress,
  style,
  inputStyle,
  labelStyle,
  errorStyle,
  containerStyle,
  multiline = false,
  numberOfLines = 1,
  maxLength,
  showCharCount = false,
  ...textInputProps
}) => {
  const { colors, components, spacing, borderRadius } = useTheme();
  const isThemeProvided = useIsThemeProvided();
  const form = name ? useForm() : null;
  const [internalValue, setInternalValue] = useState(propValue || '');
  const [isFocused, setIsFocused] = useState(false);

  // Use form context if available, otherwise use internal state
  const field = form?.getField(name!);
  const value = field?.value ?? propValue ?? internalValue;
  const error = field?.error ?? propError;

  useEffect(() => {
    if (propValue !== undefined) {
      setInternalValue(propValue);
    }
  }, [propValue]);

  const handleChangeText = (text: string) => {
    if (form && name) {
      form.setField(name, text);
    } else {
      setInternalValue(text);
    }
    onChangeText?.(text);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (form && name) {
      form.validateField(name);
    }
  };

  const getBorderColor = () => {
    if (!isThemeProvided) {
      // Fallback colors
      if (error) return '#FF3B30';
      if (isFocused) return '#007AFF';
      return '#D1D1D6';
    }
    
    // Theme-aware colors
    if (error) return colors.error;
    if (isFocused) return colors.primary;
    return colors.inputBorder;
  };

  const getInputStyles = () => {
    if (!isThemeProvided) {
      return {
        container: { marginBottom: 16 },
        label: { fontSize: 14, fontWeight: '500' as const, marginBottom: 8, color: '#333' },
        required: { color: '#FF3B30' },
        inputContainer: {
          flexDirection: 'row' as const,
          alignItems: 'center' as const,
          borderWidth: 1,
          borderRadius: 8,
          paddingHorizontal: 12,
          backgroundColor: '#fff',
          minHeight: 48,
        },
        input: { flex: 1, fontSize: 16, color: '#333', paddingVertical: 12 },
        multilineInput: { paddingTop: 12, textAlignVertical: 'top' as const },
        leftIcon: { marginRight: 8 },
        rightIcon: { marginLeft: 8, padding: 4 },
        footer: { flexDirection: 'row' as const, justifyContent: 'space-between' as const, alignItems: 'center' as const },
        error: { fontSize: 12, color: '#FF3B30', marginTop: 4 },
        charCount: { fontSize: 12, color: '#999', marginTop: 4, textAlign: 'right' as const },
      };
    }

    return {
      container: { marginBottom: spacing.md },
      label: { 
        fontSize: 14, 
        fontWeight: '500' as const, 
        marginBottom: spacing.xs, 
        color: colors.text 
      },
      required: { color: colors.error },
      inputContainer: {
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        borderWidth: components.input.borderWidth,
        borderRadius: components.input.borderRadius,
        paddingHorizontal: components.input.paddingHorizontal,
        backgroundColor: colors.inputBackground,
        minHeight: components.input.minHeight,
      },
      input: { 
        flex: 1, 
        fontSize: components.input.fontSize, 
        color: colors.text, 
        paddingVertical: components.input.paddingVertical 
      },
      multilineInput: { 
        paddingTop: components.input.paddingVertical, 
        textAlignVertical: 'top' as const 
      },
      leftIcon: { marginRight: spacing.xs },
      rightIcon: { marginLeft: spacing.xs, padding: spacing.xs },
      footer: { 
        flexDirection: 'row' as const, 
        justifyContent: 'space-between' as const, 
        alignItems: 'center' as const 
      },
      error: { 
        fontSize: 12, 
        color: colors.error, 
        marginTop: spacing.xs 
      },
      charCount: { 
        fontSize: 12, 
        color: colors.textSecondary, 
        marginTop: spacing.xs, 
        textAlign: 'right' as const 
      },
    };
  };

  const styles = getInputStyles();

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={[styles.label, labelStyle]}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      )}
      
      <View
        style={[
          styles.inputContainer,
          {
            borderColor: getBorderColor(),
            opacity: disabled ? 0.6 : 1,
          },
          multiline && { height: 'auto', minHeight: 48 },
          style,
        ]}
      >
        {leftIcon && (
          <View style={styles.leftIcon}>
            {leftIcon}
          </View>
        )}
        
        <TextInput
          style={[
            styles.input,
            multiline && styles.multilineInput,
            inputStyle,
          ]}
          value={value}
          onChangeText={handleChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          placeholderTextColor={isThemeProvided ? colors.inputPlaceholder : "#999"}
          editable={!disabled}
          multiline={multiline}
          numberOfLines={numberOfLines}
          maxLength={maxLength}
          {...textInputProps}
        />
        
        {rightIcon && (
          <TouchableOpacity
            style={styles.rightIcon}
            onPress={onRightIconPress}
            disabled={disabled}
          >
            {rightIcon}
          </TouchableOpacity>
        )}
      </View>
      
      <View style={styles.footer}>
        {error && (
          <Text style={[styles.error, errorStyle]}>
            {error}
          </Text>
        )}
        
        {showCharCount && maxLength && (
          <Text style={styles.charCount}>
            {value.length}/{maxLength}
          </Text>
        )}
      </View>
    </View>
  );
};

export default Input;
