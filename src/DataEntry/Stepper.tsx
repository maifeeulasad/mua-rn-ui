import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';

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
  activeColor = '#007AFF',
  inactiveColor = '#F0F0F0',
  disabledColor = '#E0E0E0',
  textColor = '#000',
  disabledTextColor = '#999',
}) => {
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
    styles.button,
    {
      width: buttonSize,
      height: buttonSize,
      backgroundColor: canPress ? activeColor : disabledColor,
      borderRadius: buttonSize / 2,
    },
    buttonStyle,
    !canPress && disabledButtonStyle,
    extraStyle,
  ];

  const getButtonTextStyle = (canPress: boolean) => [
    styles.buttonText,
    {
      fontSize,
      color: canPress ? '#fff' : disabledTextColor,
    },
    buttonTextStyle,
    !canPress && disabledButtonTextStyle,
  ];

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        style={getButtonStyle(canDecrease, decreaseButtonStyle)}
        onPress={handleDecrease}
        disabled={!canDecrease}
        activeOpacity={0.7}
      >
        <Text style={getButtonTextStyle(canDecrease)}>−</Text>
      </TouchableOpacity>

      {showValue && (
        <View style={[styles.valueContainer, { width: valueWidth }]}>
          <Text
            style={[
              styles.valueText,
              {
                fontSize,
                color: disabled ? disabledTextColor : textColor,
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

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
  },
  buttonText: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  valueContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 12,
  },
  valueText: {
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default Stepper;
