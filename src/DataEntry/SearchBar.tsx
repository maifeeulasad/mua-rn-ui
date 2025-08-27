import React, { useState, useRef } from 'react';
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
import { useTheme, useColors } from '../themes';

interface SearchBarProps extends Omit<TextInputProps, 'style'> {
  value?: string;
  onChangeText?: (text: string) => void;
  onSearch?: (text: string) => void;
  onClear?: () => void;
  onCancel?: () => void;
  placeholder?: string;
  showCancelButton?: boolean;
  showSearchIcon?: boolean;
  showClearIcon?: boolean;
  cancelText?: string;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  inputStyle?: TextStyle;
  containerStyle?: ViewStyle;
  searchIconStyle?: ViewStyle;
  clearIconStyle?: ViewStyle;
  cancelButtonStyle?: ViewStyle;
  cancelTextStyle?: TextStyle;
  backgroundColor?: string;
  borderColor?: string;
  focusedBorderColor?: string;
  searchIcon?: React.ReactNode;
  clearIcon?: React.ReactNode;
  loadingIcon?: React.ReactNode;
}

const SearchBar: React.FC<SearchBarProps> = ({
  value: propValue,
  onChangeText,
  onSearch,
  onClear,
  onCancel,
  placeholder = 'Search...',
  showCancelButton = false,
  showSearchIcon = true,
  showClearIcon = true,
  cancelText = 'Cancel',
  disabled = false,
  loading = false,
  style,
  inputStyle,
  containerStyle,
  searchIconStyle,
  clearIconStyle,
  cancelButtonStyle,
  cancelTextStyle,
  backgroundColor,
  borderColor,
  focusedBorderColor,
  searchIcon,
  clearIcon,
  loadingIcon,
  ...textInputProps
}) => {
  const theme = useTheme();
  const colors = useColors();

  // Define theme-aware colors with prop fallbacks
  const finalBackgroundColor = backgroundColor || colors?.surface || '#F0F0F0';
  const finalBorderColor = borderColor || colors?.border || '#E0E0E0';
  const finalFocusedBorderColor = focusedBorderColor || colors?.primary || '#007AFF';
  const finalTextColor = colors?.text || '#000';
  const finalPlaceholderColor = colors?.textSecondary || '#999';

  const [internalValue, setInternalValue] = useState(propValue || '');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const value = propValue !== undefined ? propValue : internalValue;
  const hasValue = value.length > 0;

  const handleChangeText = (text: string) => {
    if (propValue === undefined) {
      setInternalValue(text);
    }
    onChangeText?.(text);
  };

  const handleSubmitEditing = () => {
    onSearch?.(value);
  };

  const handleClear = () => {
    if (propValue === undefined) {
      setInternalValue('');
    }
    onChangeText?.('');
    onClear?.();
    inputRef.current?.focus();
  };

  const handleCancel = () => {
    if (propValue === undefined) {
      setInternalValue('');
    }
    onChangeText?.('');
    onCancel?.();
    inputRef.current?.blur();
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const getBorderColor = () => {
    if (isFocused) return finalFocusedBorderColor;
    return finalBorderColor;
  };

  // Define theme-aware styles
  const containerStyleBase: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme?.spacing?.xs || 4,
  };

  const searchBarStyle: ViewStyle = {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: finalBackgroundColor,
    borderRadius: theme?.borderRadius?.md || 8,
    borderWidth: 1,
    borderColor: getBorderColor(),
    paddingHorizontal: theme?.spacing?.sm || 12,
    minHeight: theme?.components?.input?.minHeight || 40,
  };

  const inputStyleBase: TextStyle = {
    flex: 1,
    fontSize: theme?.typography?.fontSize?.md || 16,
    color: finalTextColor,
    paddingVertical: theme?.spacing?.sm || 8,
  };

  const searchIconStyleBase: ViewStyle = {
    marginRight: theme?.spacing?.sm || 8,
    alignItems: 'center',
    justifyContent: 'center',
  };

  const clearIconStyleBase: ViewStyle = {
    marginLeft: theme?.spacing?.sm || 8,
    padding: theme?.spacing?.xs || 4,
    alignItems: 'center',
    justifyContent: 'center',
  };

  const cancelButtonStyleBase: ViewStyle = {
    marginLeft: theme?.spacing?.sm || 12,
    paddingHorizontal: theme?.spacing?.sm || 8,
    paddingVertical: theme?.spacing?.xs || 4,
  };

  const cancelTextStyleBase: TextStyle = {
    fontSize: theme?.typography?.fontSize?.md || 16,
    color: colors?.primary || '#007AFF',
    fontWeight: theme?.typography?.fontWeight?.medium || '500',
  };

  const searchIconTextStyle: TextStyle = {
    fontSize: 16,
    color: finalPlaceholderColor,
  };

  const clearIconTextStyle: TextStyle = {
    fontSize: 16,
    color: finalPlaceholderColor,
    fontWeight: theme?.typography?.fontWeight?.bold || 'bold',
  };

  const renderSearchIcon = () => {
    if (!showSearchIcon) return null;

    if (loading && loadingIcon) {
      return (
        <View style={[searchIconStyleBase, searchIconStyle]}>
          {loadingIcon}
        </View>
      );
    }

    if (searchIcon) {
      return (
        <View style={[searchIconStyleBase, searchIconStyle]}>
          {searchIcon}
        </View>
      );
    }

    return (
      <View style={[searchIconStyleBase, searchIconStyle]}>
        <Text style={searchIconTextStyle}>🔍</Text>
      </View>
    );
  };

  const renderClearIcon = () => {
    if (!showClearIcon || !hasValue || loading) return null;

    if (clearIcon) {
      return (
        <TouchableOpacity
          style={[clearIconStyleBase, clearIconStyle]}
          onPress={handleClear}
          disabled={disabled}
        >
          {clearIcon}
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity
        style={[clearIconStyleBase, clearIconStyle]}
        onPress={handleClear}
        disabled={disabled}
      >
        <Text style={clearIconTextStyle}>✕</Text>
      </TouchableOpacity>
    );
  };

  const renderCancelButton = () => {
    if (!showCancelButton) return null;

    return (
      <TouchableOpacity
        style={[cancelButtonStyleBase, cancelButtonStyle]}
        onPress={handleCancel}
        disabled={disabled}
      >
        <Text style={[cancelTextStyleBase, cancelTextStyle]}>
          {cancelText}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[containerStyleBase, containerStyle]}>
      <View
        style={[
          searchBarStyle,
          {
            opacity: disabled ? 0.6 : 1,
          },
          style,
        ]}
      >
        {renderSearchIcon()}
        
        <TextInput
          ref={inputRef}
          style={[inputStyleBase, inputStyle]}
          value={value}
          onChangeText={handleChangeText}
          onSubmitEditing={handleSubmitEditing}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          placeholderTextColor={finalPlaceholderColor}
          editable={!disabled && !loading}
          returnKeyType="search"
          autoCorrect={false}
          autoCapitalize="none"
          {...textInputProps}
        />

        {renderClearIcon()}
      </View>
      
      {renderCancelButton()}
    </View>
  );
};

export default SearchBar;
