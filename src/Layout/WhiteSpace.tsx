import React from 'react';
import { View, ViewProps, ViewStyle } from 'react-native';
import { useTheme } from '../themes';

type WhiteSpaceSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;

interface WhiteSpaceProps extends ViewProps {
  size?: WhiteSpaceSize;
  style?: ViewStyle;
}

const WhiteSpace: React.FC<WhiteSpaceProps> = ({
  size = 'md',
  style,
  ...props
}) => {
  const theme = useTheme();

  const getSizeValue = (size: WhiteSpaceSize): number => {
    if (typeof size === 'number') {
      return size;
    }
    
    // Use theme spacing if available, fallback to hardcoded values
    const spacing = theme?.spacing;
    
    switch (size) {
      case 'xs':
        return spacing?.xs || 4;
      case 'sm':
        return spacing?.sm || 8;
      case 'md':
        return spacing?.md || 16;
      case 'lg':
        return spacing?.lg || 24;
      case 'xl':
        return spacing?.xl || 32;
      default:
        return spacing?.md || 16;
    }
  };

  const whiteSpaceStyle: ViewStyle = {
    height: getSizeValue(size),
  };

  return <View style={[whiteSpaceStyle, style]} {...props} />;
};

export default WhiteSpace;
