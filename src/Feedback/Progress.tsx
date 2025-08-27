import React, { useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  Animated,
  ViewStyle, 
  TextStyle,
} from 'react-native';
import { useTheme, useColors } from '../themes';

export interface ProgressProps {
  percent?: number;
  position?: 'fixed' | 'normal';
  unfilled?: boolean;
  appearTransition?: boolean;
  style?: ViewStyle;
  barStyle?: ViewStyle;
  fillStyle?: ViewStyle;
  textStyle?: TextStyle;
  showInfo?: boolean;
  format?: (percent: number) => string;
  status?: 'success' | 'exception' | 'active' | 'normal';
  strokeWidth?: number;
  trailColor?: string;
  strokeColor?: string;
  type?: 'line' | 'circle';
  size?: 'small' | 'normal';
  testID?: string;
}

const Progress: React.FC<ProgressProps> = ({
  percent = 0,
  position = 'normal',
  unfilled = false,
  appearTransition = false,
  style,
  barStyle,
  fillStyle,
  textStyle,
  showInfo = true,
  format,
  status = 'normal',
  strokeWidth = 8,
  trailColor,
  strokeColor,
  type = 'line',
  size = 'normal',
  testID,
}) => {
  const theme = useTheme();
  const colors = useColors();
  
  const animatedProgress = useRef(new Animated.Value(0)).current;
  const animatedOpacity = useRef(new Animated.Value(appearTransition ? 0 : 1)).current;

  const safePercent = Math.max(0, Math.min(100, percent));

  useEffect(() => {
    if (appearTransition) {
      Animated.timing(animatedOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }

    Animated.timing(animatedProgress, {
      toValue: safePercent,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [safePercent, appearTransition, animatedProgress, animatedOpacity]);

  const getStatusColor = () => {
    if (strokeColor) return strokeColor;
    
    // Use theme colors with fallbacks
    switch (status) {
      case 'success':
        return colors?.success || '#52c41a';
      case 'exception':
        return colors?.error || '#ff4d4f';
      case 'active':
        return colors?.primary || '#1890ff';
      default:
        return colors?.primary || '#1890ff';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'success':
        return '✓';
      case 'exception':
        return '✕';
      default:
        return null;
    }
  };

  const formatPercent = (value: number) => {
    if (format) {
      return format(value);
    }
    return `${Math.round(value)}%`;
  };

  // Define styles using theme values
  const finalTrailColor = trailColor || colors?.border || '#f3f3f3';

  const lineContainerStyle: ViewStyle = {
    width: '100%',
  };

  const fixedPositionStyle: ViewStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  };

  const progressWrapperStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
  };

  const trackStyle: ViewStyle = {
    flex: 1,
    borderRadius: theme?.borderRadius?.sm || 4,
    overflow: 'hidden',
  };

  const themeAwareFillStyle: ViewStyle = {
    borderRadius: theme?.borderRadius?.sm || 4,
  };

  const infoContainerStyle: ViewStyle = {
    marginLeft: theme?.spacing?.sm || 8,
    minWidth: 40,
    alignItems: 'center',
  };

  const infoTextStyle: TextStyle = {
    fontSize: theme?.typography?.fontSize?.xs || 12,
    color: colors?.textSecondary || '#666666',
    fontWeight: theme?.typography?.fontWeight?.medium || '500',
  };

  const circleContainerStyle: ViewStyle = {
    alignItems: 'center',
    justifyContent: 'center',
  };

  const circleWrapperStyle: ViewStyle = {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const circleTrackStyle: ViewStyle = {
    position: 'absolute',
  };

  const circleProgressStyle: ViewStyle = {
    position: 'absolute',
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
  };

  const circleInfoStyle: ViewStyle = {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const circleInfoTextStyle: TextStyle = {
    fontSize: theme?.typography?.fontSize?.sm || 14,
    color: colors?.text || '#333333',
    fontWeight: theme?.typography?.fontWeight?.medium || '500',
    textAlign: 'center',
  };

  const renderLineProgress = () => {
    const progressHeight = size === 'small' ? 6 : strokeWidth;
    const statusColor = getStatusColor();
    
    const containerStyles: ViewStyle[] = [
      lineContainerStyle,
      ...(position === 'fixed' ? [fixedPositionStyle] : []),
      { height: progressHeight },
      ...(style ? [style] : []),
    ];

    const trackStyles: ViewStyle[] = [
      trackStyle,
      {
        height: progressHeight,
        backgroundColor: unfilled ? 'transparent' : finalTrailColor,
      },
      ...(barStyle ? [barStyle] : []),
    ];

    const fillStyles: ViewStyle[] = [
      themeAwareFillStyle,
      {
        height: progressHeight,
        backgroundColor: statusColor,
      },
      ...(fillStyle ? [fillStyle] : []),
    ];

    return (
      <Animated.View style={[containerStyles, { opacity: animatedOpacity }]}>
        <View style={progressWrapperStyle}>
          <View style={trackStyles}>
            <Animated.View
              style={[
                fillStyles,
                {
                  width: animatedProgress.interpolate({
                    inputRange: [0, 100],
                    outputRange: ['0%', '100%'],
                    extrapolate: 'clamp',
                  }),
                },
              ]}
            />
          </View>
          
          {showInfo && (
            <View style={infoContainerStyle}>
              <Text style={[infoTextStyle, textStyle]}>
                {getStatusIcon() || formatPercent(safePercent)}
              </Text>
            </View>
          )}
        </View>
      </Animated.View>
    );
  };

  const renderCircleProgress = () => {
    const radius = size === 'small' ? 40 : 50;
    const strokeWidthValue = size === 'small' ? 4 : strokeWidth;
    const normalizedRadius = radius - strokeWidthValue * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const statusColor = getStatusColor();

    const containerStyles: ViewStyle[] = [
      circleContainerStyle,
      {
        width: radius * 2,
        height: radius * 2,
      },
      ...(style ? [style] : []),
    ];

    return (
      <Animated.View style={[containerStyles, { opacity: animatedOpacity }]}>
        <View style={circleWrapperStyle}>
          {/* Background circle */}
          <View
            style={[
              circleTrackStyle,
              {
                width: radius * 2,
                height: radius * 2,
                borderRadius: radius,
                borderWidth: strokeWidthValue,
                borderColor: unfilled ? 'transparent' : finalTrailColor,
              },
            ]}
          />
          
          {/* Progress circle */}
          <Animated.View
            style={[
              circleProgressStyle,
              {
                width: radius * 2,
                height: radius * 2,
                borderRadius: radius,
                borderWidth: strokeWidthValue,
                borderColor: statusColor,
                transform: [
                  { rotate: '-90deg' },
                  {
                    rotate: animatedProgress.interpolate({
                      inputRange: [0, 100],
                      outputRange: ['0deg', '360deg'],
                      extrapolate: 'clamp',
                    }),
                  },
                ],
              },
            ]}
          />
          
          {showInfo && (
            <View style={circleInfoStyle}>
              <Text style={[circleInfoTextStyle, textStyle]}>
                {getStatusIcon() || formatPercent(safePercent)}
              </Text>
            </View>
          )}
        </View>
      </Animated.View>
    );
  };

  return (
    <View testID={testID}>
      {type === 'circle' ? renderCircleProgress() : renderLineProgress()}
    </View>
  );
};

export default Progress;
