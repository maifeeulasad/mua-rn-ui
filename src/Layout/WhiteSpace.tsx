import React from 'react';
import { View, ViewProps, ViewStyle } from 'react-native';

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
  const getSizeValue = (size: WhiteSpaceSize): number => {
    if (typeof size === 'number') {
      return size;
    }
    
    switch (size) {
      case 'xs':
        return 4;
      case 'sm':
        return 8;
      case 'md':
        return 16;
      case 'lg':
        return 24;
      case 'xl':
        return 32;
      default:
        return 16;
    }
  };

  const whiteSpaceStyle: ViewStyle = {
    height: getSizeValue(size),
  };

  return <View style={[whiteSpaceStyle, style]} {...props} />;
};

export default WhiteSpace;
