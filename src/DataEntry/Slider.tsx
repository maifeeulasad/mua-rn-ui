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
  minimumTrackTintColor = '#007AFF',
  maximumTrackTintColor = '#E0E0E0',
  thumbTintColor = '#007AFF',
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

  return (
    <View style={[styles.container, style]}>
      {showValue && (
        <Text style={[styles.valueText, valueStyle]}>
          {normalizedValue.toFixed(step < 1 ? 2 : 0)}
        </Text>
      )}
      
      <View
        style={[styles.sliderContainer, { opacity: disabled ? 0.6 : 1 }]}
        onLayout={handleLayout}
        onStartShouldSetResponder={() => !disabled}
        onResponderGrant={handleTouch}
        onResponderMove={handleTouch}
      >
        {/* Track */}
        <View
          style={[
            styles.track,
            {
              height: trackHeight,
              backgroundColor: maximumTrackTintColor,
            },
            trackStyle,
            maximumTrackStyle,
          ]}
        />
        
        {/* Minimum track (filled portion) */}
        <View
          style={[
            styles.minimumTrack,
            {
              height: trackHeight,
              width: thumbPosition + thumbSize / 2,
              backgroundColor: minimumTrackTintColor,
            },
            trackStyle,
            minimumTrackStyle,
          ]}
        />
        
        {/* Thumb */}
        <View
          style={[
            styles.thumb,
            {
              width: thumbSize,
              height: thumbSize,
              borderRadius: thumbSize / 2,
              backgroundColor: thumbTintColor,
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

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  valueText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
  },
  sliderContainer: {
    height: 40,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  track: {
    position: 'absolute',
    left: 10,
    right: 10,
    borderRadius: 2,
  },
  minimumTrack: {
    position: 'absolute',
    left: 10,
    borderRadius: 2,
  },
  thumb: {
    position: 'absolute',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 5,
  },
});

export default Slider;
