import React from 'react';
import { View, ViewProps, ViewStyle } from 'react-native';
import { useTheme } from '../themes';

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
  const theme = useTheme();

  const getSizeValue = (size: WingBlankSize): number => {
    if (typeof size === 'number') {
      return size;
    }
    
    // Use theme spacing if available, fallback to hardcoded values
    const spacing = theme?.spacing;
    
    switch (size) {
      case 'sm':
        return spacing?.sm || 8;
      case 'md':
        return spacing?.md || 16;
      case 'lg':
        return spacing?.lg || 24;
      default:
        return spacing?.lg || 24;
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
