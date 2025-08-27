import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useTheme, useColors } from '../themes';

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  size?: number;
  color?: string;
  backgroundColor?: string;
  borderColor?: string;
  disabledColor?: string;
  style?: ViewStyle;
  labelStyle?: TextStyle;
  checkboxStyle?: ViewStyle;
}

const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onChange,
  label,
  disabled = false,
  size = 20,
  color,
  backgroundColor,
  borderColor,
  disabledColor,
  style,
  labelStyle,
  checkboxStyle,
}) => {
  const theme = useTheme();
  const colors = useColors();

  // Define theme-aware colors with prop fallbacks
  const finalColor = color || colors?.primary || '#007AFF';
  const finalBackgroundColor = backgroundColor || colors?.background || '#fff';
  const finalBorderColor = borderColor || colors?.border || '#D1D1D6';
  const finalDisabledColor = disabledColor || colors?.textDisabled || '#C7C7CC';
  const finalTextColor = colors?.text || '#000';
  // Define theme-aware styles
  const containerStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme?.spacing?.xs || 4,
  };

  const checkboxStyles: ViewStyle = {
    width: size,
    height: size,
    borderWidth: 2,
    borderRadius: theme?.borderRadius?.sm || 4,
    borderColor: disabled ? finalDisabledColor : checked ? finalColor : finalBorderColor,
    backgroundColor: disabled ? finalDisabledColor : checked ? finalColor : finalBackgroundColor,
    alignItems: 'center',
    justifyContent: 'center',
    ...checkboxStyle,
  };

  const checkmarkStyle: ViewStyle = {
    alignItems: 'center',
    justifyContent: 'center',
  };

  const checkmarkTextStyle: TextStyle = {
    fontSize: size * 0.6,
    color: colors?.surface || '#fff',
    fontWeight: theme?.typography?.fontWeight?.bold || 'bold',
  };

  const labelTextStyle: TextStyle = {
    marginLeft: theme?.spacing?.sm || 8,
    fontSize: theme?.typography?.fontSize?.md || 16,
    flex: 1,
    color: disabled ? finalDisabledColor : finalTextColor,
  };

  const handlePress = () => {
    if (!disabled) {
      onChange(!checked);
    }
  };

  const renderCheckmark = () => {
    if (!checked) return null;
    
    return (
      <View style={checkmarkStyle}>
        <Text style={checkmarkTextStyle}>
          ✓
        </Text>
      </View>
    );
  };

  return (
    <TouchableOpacity
      style={[containerStyle, style]}
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <View style={checkboxStyles}>
        {renderCheckmark()}
      </View>
      {label && (
        <Text style={[labelTextStyle, labelStyle]}>
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default Checkbox;
