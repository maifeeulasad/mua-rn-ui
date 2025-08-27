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
  activeColor = '#007AFF',
  inactiveColor = '#E5E5EA',
  thumbColor = '#FFFFFF',
  label,
  labelPosition = 'right',
  style,
  labelStyle,
  trackStyle,
  thumbStyle,
}) => {
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
    outputRange: [inactiveColor, activeColor],
  });

  const thumbTranslateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [2, thumbOffset],
  });

  const renderSwitch = () => (
    <TouchableOpacity
      style={[
        styles.container,
        { opacity: disabled ? 0.6 : 1 },
        style,
      ]}
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <Animated.View
        style={[
          styles.track,
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
            styles.thumb,
            {
              width: thumbSize,
              height: thumbSize,
              borderRadius: thumbSize / 2,
              backgroundColor: thumbColor,
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
    <View style={styles.labelContainer}>
      {labelPosition === 'left' && (
        <Text style={[styles.label, labelStyle]}>{label}</Text>
      )}
      {renderSwitch()}
      {labelPosition === 'right' && (
        <Text style={[styles.label, labelStyle]}>{label}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  track: {
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
  thumb: {
    position: 'absolute',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 4,
  },
  label: {
    fontSize: 16,
    color: '#000',
    marginHorizontal: 8,
  },
});

export default Switch;
