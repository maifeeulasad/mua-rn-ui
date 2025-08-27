import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';

interface BadgeProps {
  count?: number | string;
  maxCount?: number;
  showZero?: boolean;
  dot?: boolean;
  status?: 'default' | 'success' | 'processing' | 'error' | 'warning';
  color?: string;
  textColor?: string;
  size?: 'small' | 'default';
  style?: ViewStyle;
  textStyle?: TextStyle;
  children?: React.ReactNode;
  offset?: [number, number];
}

const Badge: React.FC<BadgeProps> = ({
  count,
  maxCount = 99,
  showZero = false,
  dot = false,
  status = 'default',
  color,
  textColor = '#fff',
  size = 'default',
  style,
  textStyle,
  children,
  offset = [0, 0],
}) => {
  const getStatusColor = () => {
    if (color) return color;
    
    switch (status) {
      case 'success':
        return '#52C41A';
      case 'processing':
        return '#1890FF';
      case 'error':
        return '#FF4D4F';
      case 'warning':
        return '#FAAD14';
      default:
        return '#FF4D4F';
    }
  };

  const getSizes = () => {
    switch (size) {
      case 'small':
        return { height: 16, minWidth: 16, fontSize: 10, padding: 2 };
      default:
        return { height: 20, minWidth: 20, fontSize: 12, padding: 4 };
    }
  };

  const { height, minWidth, fontSize, padding } = getSizes();

  const shouldShow = () => {
    if (dot) return true;
    if (count === undefined || count === null) return false;
    if (count === 0 && !showZero) return false;
    return true;
  };

  const getDisplayText = () => {
    if (dot) return '';
    if (typeof count === 'string') return count;
    if (typeof count === 'number') {
      return count > maxCount ? `${maxCount}+` : count.toString();
    }
    return '';
  };

  const badgeStyle: ViewStyle = {
    backgroundColor: getStatusColor(),
    height: dot ? 8 : height,
    minWidth: dot ? 8 : minWidth,
    borderRadius: dot ? 4 : height / 2,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: dot ? 0 : padding,
    position: children ? 'absolute' : 'relative',
    top: children ? offset[1] : 0,
    right: children ? offset[0] : 0,
    zIndex: 1,
    ...style,
  };

  const badgeTextStyle: TextStyle = {
    color: textColor,
    fontSize,
    fontWeight: 'bold',
    lineHeight: fontSize + 2,
    ...textStyle,
  };

  const renderBadge = () => {
    if (!shouldShow()) return null;

    return (
      <View style={badgeStyle}>
        {!dot && (
          <Text style={badgeTextStyle} numberOfLines={1}>
            {getDisplayText()}
          </Text>
        )}
      </View>
    );
  };

  if (children) {
    return (
      <View style={styles.wrapper}>
        {children}
        {renderBadge()}
      </View>
    );
  }

  return renderBadge();
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
  },
});

export default Badge;
