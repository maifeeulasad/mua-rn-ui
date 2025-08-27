import React from 'react';
import { View, ViewProps, ViewStyle } from 'react-native';

type WingBlankSize = 'sm' | 'md' | 'lg' | number;

interface WingBlankProps extends ViewProps {
  size?: WingBlankSize;
  style?: ViewStyle;
}

const WingBlank: React.FC<WingBlankProps> = ({
  size = 'lg',
  style,
  children,
  ...props
}) => {
  const getSizeValue = (size: WingBlankSize): number => {
    if (typeof size === 'number') {
      return size;
    }
    
    switch (size) {
      case 'sm':
        return 8;
      case 'md':
        return 16;
      case 'lg':
        return 24;
      default:
        return 24;
    }
  };

  const wingBlankStyle: ViewStyle = {
    paddingHorizontal: getSizeValue(size),
  };

  return (
    <View style={[wingBlankStyle, style]} {...props}>
      {children}
    </View>
  );
};

export default WingBlank;
