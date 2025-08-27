import React from 'react';
import {
  View,
  Text,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useTheme, useColors } from '../themes';

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
  textColor,
  size = 'default',
  style,
  textStyle,
  children,
  offset = [0, 0],
}) => {
  const theme = useTheme();
  const colors = useColors();
  
  const getStatusColor = () => {
    if (color) return color;
    
    // Use theme colors if available, fallback to hardcoded values
    const statusColors = {
      success: colors?.success || '#52C41A',
      processing: colors?.primary || '#1890FF',
      error: colors?.error || '#FF4D4F',
      warning: colors?.warning || '#FAAD14',
      default: colors?.error || '#FF4D4F',
    };
    
    return statusColors[status];
  };

  const getSizes = () => {
    const typography = theme?.typography;
    
    switch (size) {
      case 'small':
        return { 
          height: 16, 
          minWidth: 16, 
          fontSize: typography?.fontSize?.xs || 10, 
          padding: 2 
        };
      default:
        return { 
          height: 20, 
          minWidth: 20, 
          fontSize: typography?.fontSize?.sm || 12, 
          padding: 4 
        };
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

  const badgeTextStyle: TextStyle[] = [
    {
      color: textColor || colors?.buttonText || '#fff',
      fontSize,
      fontWeight: theme?.typography?.fontWeight?.bold || 'bold',
      lineHeight: fontSize + 2,
    },
    textStyle && textStyle,
  ].filter(Boolean) as TextStyle[];

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
      <View style={{ position: 'relative' }}>
        {children}
        {renderBadge()}
      </View>
    );
  }

  return renderBadge();
};

export default Badge;
