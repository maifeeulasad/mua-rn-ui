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
  backgroundColor = '#F0F0F0',
  borderColor = '#E0E0E0',
  focusedBorderColor = '#007AFF',
  searchIcon,
  clearIcon,
  loadingIcon,
  ...textInputProps
}) => {
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
    if (isFocused) return focusedBorderColor;
    return borderColor;
  };

  const renderSearchIcon = () => {
    if (!showSearchIcon) return null;

    if (loading && loadingIcon) {
      return (
        <View style={[styles.searchIcon, searchIconStyle]}>
          {loadingIcon}
        </View>
      );
    }

    if (searchIcon) {
      return (
        <View style={[styles.searchIcon, searchIconStyle]}>
          {searchIcon}
        </View>
      );
    }

    return (
      <View style={[styles.searchIcon, searchIconStyle]}>
        <Text style={styles.searchIconText}>🔍</Text>
      </View>
    );
  };

  const renderClearIcon = () => {
    if (!showClearIcon || !hasValue || loading) return null;

    if (clearIcon) {
      return (
        <TouchableOpacity
          style={[styles.clearIcon, clearIconStyle]}
          onPress={handleClear}
          disabled={disabled}
        >
          {clearIcon}
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity
        style={[styles.clearIcon, clearIconStyle]}
        onPress={handleClear}
        disabled={disabled}
      >
        <Text style={styles.clearIconText}>✕</Text>
      </TouchableOpacity>
    );
  };

  const renderCancelButton = () => {
    if (!showCancelButton) return null;

    return (
      <TouchableOpacity
        style={[styles.cancelButton, cancelButtonStyle]}
        onPress={handleCancel}
        disabled={disabled}
      >
        <Text style={[styles.cancelText, cancelTextStyle]}>
          {cancelText}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <View
        style={[
          styles.searchContainer,
          {
            backgroundColor,
            borderColor: getBorderColor(),
            opacity: disabled ? 0.6 : 1,
          },
          style,
        ]}
      >
        {renderSearchIcon()}
        
        <TextInput
          ref={inputRef}
          style={[styles.input, inputStyle]}
          value={value}
          onChangeText={handleChangeText}
          onSubmitEditing={handleSubmitEditing}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          placeholderTextColor="#999"
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

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 12,
    minHeight: 40,
  },
  searchIcon: {
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchIconText: {
    fontSize: 16,
    color: '#666',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#000',
    paddingVertical: 8,
  },
  clearIcon: {
    marginLeft: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: 20,
    height: 20,
  },
  clearIconText: {
    fontSize: 14,
    color: '#666',
    fontWeight: 'bold',
  },
  cancelButton: {
    marginLeft: 12,
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  cancelText: {
    fontSize: 16,
    color: '#007AFF',
  },
});

export default SearchBar;
