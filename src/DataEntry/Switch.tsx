import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useTheme, useColors } from '../themes';

interface SwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
  activeColor?: string;
  inactiveColor?: string;
  thumbColor?: string;
  label?: string;
  labelPosition?: 'left' | 'right';
  style?: ViewStyle;
  labelStyle?: TextStyle;
  trackStyle?: ViewStyle;
  thumbStyle?: ViewStyle;
}

const Switch: React.FC<SwitchProps> = ({
  value,
  onValueChange,
  disabled = false,
  size = 'medium',
  activeColor,
  inactiveColor,
  thumbColor,
  label,
  labelPosition = 'right',
  style,
  labelStyle,
  trackStyle,
  thumbStyle,
}) => {
  const theme = useTheme();
  const colors = useColors();

  // Define theme-aware colors with prop fallbacks
  const finalActiveColor = activeColor || colors?.primary || '#007AFF';
  const finalInactiveColor = inactiveColor || colors?.border || '#E5E5EA';
  const finalThumbColor = thumbColor || colors?.surface || '#FFFFFF';
  const finalTextColor = colors?.text || '#000';

  const animatedValue = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: value ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [value, animatedValue]);

  const getSizes = () => {
    switch (size) {
      case 'small':
        return { width: 40, height: 24, thumbSize: 20 };
      case 'large':
        return { width: 60, height: 36, thumbSize: 32 };
      default: // medium
        return { width: 50, height: 30, thumbSize: 26 };
    }
  };

  const { width, height, thumbSize } = getSizes();
  const thumbOffset = width - thumbSize - 2;

  const handlePress = () => {
    if (!disabled) {
      onValueChange(!value);
    }
  };

  const trackColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [finalInactiveColor, finalActiveColor],
  });

  const thumbTranslateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [2, thumbOffset],
  });

  // Define theme-aware styles
  const containerStyle: ViewStyle = {
    justifyContent: 'center',
  };

  const labelContainerStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme?.spacing?.xs || 4,
  };

  const trackStyleBase: ViewStyle = {
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

  const thumbStyleBase: ViewStyle = {
    position: 'absolute',
    shadowColor: colors?.shadow || '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: theme?.shadows?.md?.shadowOpacity || 0.25,
    shadowRadius: theme?.shadows?.md?.shadowRadius || 2,
    elevation: theme?.shadows?.md?.elevation || 4,
  };

  const labelTextStyle: TextStyle = {
    fontSize: theme?.typography?.fontSize?.md || 16,
    color: finalTextColor,
    marginHorizontal: theme?.spacing?.sm || 8,
  };

  const renderSwitch = () => (
    <TouchableOpacity
      style={[
        containerStyle,
        { opacity: disabled ? 0.6 : 1 },
        style,
      ]}
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <Animated.View
        style={[
          trackStyleBase,
          {
            width,
            height,
            backgroundColor: trackColor,
            borderRadius: height / 2,
          },
          trackStyle,
        ]}
      >
        <Animated.View
          style={[
            thumbStyleBase,
            {
              width: thumbSize,
              height: thumbSize,
              borderRadius: thumbSize / 2,
              backgroundColor: finalThumbColor,
              transform: [{ translateX: thumbTranslateX }],
            },
            thumbStyle,
          ]}
        />
      </Animated.View>
    </TouchableOpacity>
  );

  if (!label) {
    return renderSwitch();
  }

  return (
    <View style={labelContainerStyle}>
      {labelPosition === 'left' && (
        <Text style={[labelTextStyle, labelStyle]}>{label}</Text>
      )}
      {renderSwitch()}
      {labelPosition === 'right' && (
        <Text style={[labelTextStyle, labelStyle]}>{label}</Text>
      )}
    </View>
  );
};

export default Switch;
