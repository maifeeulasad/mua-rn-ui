import React, { useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  Animated,
  ViewStyle, 
  TextStyle,
  StyleSheet 
} from 'react-native';

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
  trailColor = '#f3f3f3',
  strokeColor,
  type = 'line',
  size = 'normal',
  testID,
}) => {
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
    
    switch (status) {
      case 'success':
        return '#52c41a';
      case 'exception':
        return '#ff4d4f';
      case 'active':
        return '#1890ff';
      default:
        return '#1890ff';
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

  const renderLineProgress = () => {
    const progressHeight = size === 'small' ? 6 : strokeWidth;
    const statusColor = getStatusColor();
    
    const containerStyles: ViewStyle[] = [
      styles.lineContainer,
      ...(position === 'fixed' ? [styles.fixedPosition] : []),
      { height: progressHeight },
      ...(style ? [style] : []),
    ];

    const trackStyles: ViewStyle[] = [
      styles.track,
      {
        height: progressHeight,
        backgroundColor: unfilled ? 'transparent' : trailColor,
      },
      ...(barStyle ? [barStyle] : []),
    ];

    const fillStyles: ViewStyle[] = [
      styles.fill,
      {
        height: progressHeight,
        backgroundColor: statusColor,
      },
      ...(fillStyle ? [fillStyle] : []),
    ];

    return (
      <Animated.View style={[containerStyles, { opacity: animatedOpacity }]}>
        <View style={styles.progressWrapper}>
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
            <View style={styles.infoContainer}>
              <Text style={[styles.infoText, textStyle]}>
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
      styles.circleContainer,
      {
        width: radius * 2,
        height: radius * 2,
      },
      ...(style ? [style] : []),
    ];

    return (
      <Animated.View style={[containerStyles, { opacity: animatedOpacity }]}>
        <View style={styles.circleWrapper}>
          {/* Background circle */}
          <View
            style={[
              styles.circleTrack,
              {
                width: radius * 2,
                height: radius * 2,
                borderRadius: radius,
                borderWidth: strokeWidthValue,
                borderColor: unfilled ? 'transparent' : trailColor,
              },
            ]}
          />
          
          {/* Progress circle */}
          <Animated.View
            style={[
              styles.circleProgress,
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
            <View style={styles.circleInfo}>
              <Text style={[styles.circleInfoText, textStyle]}>
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

const styles = StyleSheet.create({
  lineContainer: {
    width: '100%',
  },
  fixedPosition: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  progressWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  track: {
    flex: 1,
    borderRadius: 4,
    overflow: 'hidden',
  },
  fill: {
    borderRadius: 4,
    transition: 'width 0.3s ease',
  },
  infoContainer: {
    marginLeft: 8,
    minWidth: 40,
    alignItems: 'center',
  },
  infoText: {
    fontSize: 12,
    color: '#666666',
    fontWeight: '500',
  },
  circleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleTrack: {
    position: 'absolute',
  },
  circleProgress: {
    position: 'absolute',
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  circleInfo: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleInfoText: {
    fontSize: 14,
    color: '#333333',
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default Progress;
