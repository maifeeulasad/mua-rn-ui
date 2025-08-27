import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  Dimensions,
  LayoutChangeEvent,
} from 'react-native';
import { useTheme, useColors } from '../themes';

// Note: For a production app, you'd want to use react-native-gesture-handler
// This is a simplified version using basic React Native components

interface SliderProps {
  value: number;
  onValueChange: (value: number) => void;
  onSlidingStart?: (value: number) => void;
  onSlidingComplete?: (value: number) => void;
  minimumValue?: number;
  maximumValue?: number;
  step?: number;
  disabled?: boolean;
  minimumTrackTintColor?: string;
  maximumTrackTintColor?: string;
  thumbTintColor?: string;
  trackStyle?: ViewStyle;
  thumbStyle?: ViewStyle;
  minimumTrackStyle?: ViewStyle;
  maximumTrackStyle?: ViewStyle;
  style?: ViewStyle;
  showValue?: boolean;
  valueStyle?: TextStyle;
  thumbSize?: number;
  trackHeight?: number;
}

const { width: screenWidth } = Dimensions.get('window');

const Slider: React.FC<SliderProps> = ({
  value,
  onValueChange,
  onSlidingStart,
  onSlidingComplete,
  minimumValue = 0,
  maximumValue = 100,
  step = 1,
  disabled = false,
  minimumTrackTintColor,
  maximumTrackTintColor,
  thumbTintColor,
  trackStyle,
  thumbStyle,
  minimumTrackStyle,
  maximumTrackStyle,
  style,
  showValue = false,
  valueStyle,
  thumbSize = 20,
  trackHeight = 4,
}) => {
  const theme = useTheme();
  const colors = useColors();

  // Define theme-aware colors with prop fallbacks
  const finalMinimumTrackColor = minimumTrackTintColor || colors?.primary || '#007AFF';
  const finalMaximumTrackColor = maximumTrackTintColor || colors?.border || '#E0E0E0';
  const finalThumbColor = thumbTintColor || colors?.primary || '#007AFF';
  const finalTextColor = colors?.textSecondary || '#666';

  const [sliderWidth, setSliderWidth] = useState(screenWidth - 32);
  const [isDragging, setIsDragging] = useState(false);
  const panRef = useRef(null);

  const normalizedValue = Math.max(minimumValue, Math.min(maximumValue, value));
  const percentage = (normalizedValue - minimumValue) / (maximumValue - minimumValue);
  const thumbPosition = percentage * (sliderWidth - thumbSize);

  const handleLayout = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    setSliderWidth(width);
  };

  const calculateValueFromPosition = (positionX: number): number => {
    const clampedPosition = Math.max(0, Math.min(sliderWidth - thumbSize, positionX));
    const percentage = clampedPosition / (sliderWidth - thumbSize);
    const rawValue = minimumValue + percentage * (maximumValue - minimumValue);
    
    if (step > 0) {
      return Math.round(rawValue / step) * step;
    }
    return rawValue;
  };

  const handlePanStart = () => {
    if (!disabled) {
      setIsDragging(true);
      onSlidingStart?.(value);
    }
  };

  const handlePanMove = (positionX: number) => {
    if (!disabled && isDragging) {
      const newValue = calculateValueFromPosition(positionX);
      onValueChange(newValue);
    }
  };

  const handlePanEnd = () => {
    if (isDragging) {
      setIsDragging(false);
      onSlidingComplete?.(value);
    }
  };

  // Simplified touch handling without gesture handler
  const handleTouch = (event: any) => {
    if (disabled) return;
    
    const { locationX } = event.nativeEvent;
    const newValue = calculateValueFromPosition(locationX - thumbSize / 2);
    onValueChange(newValue);
  };

  // Define theme-aware styles
  const containerStyle: ViewStyle = {
    paddingVertical: theme?.spacing?.sm || 8,
  };

  const valueTextStyle: TextStyle = {
    fontSize: theme?.typography?.fontSize?.sm || 14,
    color: finalTextColor,
    textAlign: 'center',
    marginBottom: theme?.spacing?.sm || 8,
  };

  const sliderContainerStyle: ViewStyle = {
    height: 40,
    justifyContent: 'center',
    paddingHorizontal: theme?.spacing?.sm || 10,
  };

  const trackStyleBase: ViewStyle = {
    position: 'absolute',
    left: theme?.spacing?.sm || 10,
    right: theme?.spacing?.sm || 10,
    borderRadius: theme?.borderRadius?.sm || 2,
  };

  const minimumTrackStyleBase: ViewStyle = {
    position: 'absolute',
    left: theme?.spacing?.sm || 10,
    borderRadius: theme?.borderRadius?.sm || 2,
  };

  const thumbStyleBase: ViewStyle = {
    position: 'absolute',
    shadowColor: colors?.shadow || '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: theme?.shadows?.md?.shadowOpacity || 0.25,
    shadowRadius: theme?.shadows?.md?.shadowRadius || 3,
    elevation: theme?.shadows?.md?.elevation || 5,
  };

  return (
    <View style={[containerStyle, style]}>
      {showValue && (
        <Text style={[valueTextStyle, valueStyle]}>
          {normalizedValue.toFixed(step < 1 ? 2 : 0)}
        </Text>
      )}
      
      <View
        style={[sliderContainerStyle, { opacity: disabled ? 0.6 : 1 }]}
        onLayout={handleLayout}
        onStartShouldSetResponder={() => !disabled}
        onResponderGrant={handleTouch}
        onResponderMove={handleTouch}
      >
        {/* Track */}
        <View
          style={[
            trackStyleBase,
            {
              height: trackHeight,
              backgroundColor: finalMaximumTrackColor,
            },
            trackStyle,
            maximumTrackStyle,
          ]}
        />
        
        {/* Minimum track (filled portion) */}
        <View
          style={[
            minimumTrackStyleBase,
            {
              height: trackHeight,
              width: thumbPosition + thumbSize / 2,
              backgroundColor: finalMinimumTrackColor,
            },
            trackStyle,
            minimumTrackStyle,
          ]}
        />
        
        {/* Thumb */}
        <View
          style={[
            thumbStyleBase,
            {
              width: thumbSize,
              height: thumbSize,
              borderRadius: thumbSize / 2,
              backgroundColor: finalThumbColor,
              left: thumbPosition,
              transform: [{ scale: isDragging ? 1.2 : 1 }],
            },
            thumbStyle,
          ]}
        />
      </View>
    </View>
  );
};

export default Slider;
