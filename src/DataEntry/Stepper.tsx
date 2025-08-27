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

interface StepperProps {
  value: number;
  onValueChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  showValue?: boolean;
  size?: 'small' | 'medium' | 'large';
  style?: ViewStyle;
  buttonStyle?: ViewStyle;
  disabledButtonStyle?: ViewStyle;
  valueStyle?: TextStyle;
  buttonTextStyle?: TextStyle;
  disabledButtonTextStyle?: TextStyle;
  decreaseButtonStyle?: ViewStyle;
  increaseButtonStyle?: ViewStyle;
  activeColor?: string;
  inactiveColor?: string;
  disabledColor?: string;
  textColor?: string;
  disabledTextColor?: string;
}

const Stepper: React.FC<StepperProps> = ({
  value,
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
  showValue = true,
  size = 'medium',
  style,
  buttonStyle,
  disabledButtonStyle,
  valueStyle,
  buttonTextStyle,
  disabledButtonTextStyle,
  decreaseButtonStyle,
  increaseButtonStyle,
  activeColor,
  inactiveColor,
  disabledColor,
  textColor,
  disabledTextColor,
}) => {
  const theme = useTheme();
  const colors = useColors();

  // Define theme-aware colors with prop fallbacks
  const finalActiveColor = activeColor || colors?.primary || '#007AFF';
  const finalInactiveColor = inactiveColor || colors?.border || '#F0F0F0';
  const finalDisabledColor = disabledColor || colors?.border || '#E0E0E0';
  const finalTextColor = textColor || colors?.text || '#000';
  const finalDisabledTextColor = disabledTextColor || colors?.textDisabled || '#999';

  const canDecrease = !disabled && value > min;
  const canIncrease = !disabled && value < max;

  const getSizes = () => {
    switch (size) {
      case 'small':
        return { buttonSize: 28, fontSize: 14, valueWidth: 40 };
      case 'large':
        return { buttonSize: 48, fontSize: 20, valueWidth: 60 };
      default: // medium
        return { buttonSize: 36, fontSize: 16, valueWidth: 50 };
    }
  };

  const { buttonSize, fontSize, valueWidth } = getSizes();

  // Define theme-aware styles
  const containerStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const buttonStyleBase: ViewStyle = {
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors?.shadow || '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: theme?.shadows?.sm?.shadowOpacity || 0.2,
    shadowRadius: theme?.shadows?.sm?.shadowRadius || 1,
    elevation: theme?.shadows?.sm?.elevation || 2,
  };

  const buttonTextStyleBase: TextStyle = {
    fontWeight: theme?.typography?.fontWeight?.bold || 'bold',
    textAlign: 'center',
  };

  const valueContainerStyle: ViewStyle = {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: theme?.spacing?.md || 12,
  };

  const valueTextStyleBase: TextStyle = {
    fontWeight: theme?.typography?.fontWeight?.semibold || '600',
    textAlign: 'center',
  };

  const handleDecrease = () => {
    if (canDecrease) {
      const newValue = Math.max(min, value - step);
      onValueChange(newValue);
    }
  };

  const handleIncrease = () => {
    if (canIncrease) {
      const newValue = Math.min(max, value + step);
      onValueChange(newValue);
    }
  };

  const getButtonStyle = (canPress: boolean, extraStyle?: ViewStyle) => [
    buttonStyleBase,
    {
      width: buttonSize,
      height: buttonSize,
      backgroundColor: canPress ? finalActiveColor : finalDisabledColor,
      borderRadius: buttonSize / 2,
    },
    buttonStyle,
    !canPress && disabledButtonStyle,
    extraStyle,
  ];

  const getButtonTextStyle = (canPress: boolean) => [
    buttonTextStyleBase,
    {
      fontSize,
      color: canPress ? colors?.surface || '#fff' : finalDisabledTextColor,
    },
    buttonTextStyle,
    !canPress && disabledButtonTextStyle,
  ];

  return (
    <View style={[containerStyle, style]}>
      <TouchableOpacity
        style={getButtonStyle(canDecrease, decreaseButtonStyle)}
        onPress={handleDecrease}
        disabled={!canDecrease}
        activeOpacity={0.7}
      >
        <Text style={getButtonTextStyle(canDecrease)}>−</Text>
      </TouchableOpacity>

      {showValue && (
        <View style={[valueContainerStyle, { width: valueWidth }]}>
          <Text
            style={[
              valueTextStyleBase,
              {
                fontSize,
                color: disabled ? finalDisabledTextColor : finalTextColor,
              },
              valueStyle,
            ]}
          >
            {value}
          </Text>
        </View>
      )}

      <TouchableOpacity
        style={getButtonStyle(canIncrease, increaseButtonStyle)}
        onPress={handleIncrease}
        disabled={!canIncrease}
        activeOpacity={0.7}
      >
        <Text style={getButtonTextStyle(canIncrease)}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Stepper;
