import React from 'react';
import { View, ViewProps, ViewStyle } from 'react-native';
import { useTheme, useColors } from '../themes';

interface FlexProps extends ViewProps {
  direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  justify?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
  align?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
  wrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
  flex?: number;
  style?: ViewStyle;
  // Theme-aware properties
  padding?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | number;
  margin?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | number;
  backgroundColor?: 'surface' | 'background' | 'card' | string;
  borderRadius?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full' | number;
  gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | number;
}

const Flex: React.FC<FlexProps> = ({
  direction = 'row',
  justify = 'flex-start',
  align = 'flex-start',
  wrap = 'nowrap',
  flex,
  style,
  padding,
  margin,
  backgroundColor,
  borderRadius,
  gap,
  children,
  ...props
}) => {
  const theme = useTheme();
  const colors = useColors();

  const getSpacingValue = (value: string | number | undefined): number | undefined => {
    if (typeof value === 'number') return value;
    if (typeof value === 'string' && theme.spacing[value as keyof typeof theme.spacing]) {
      return theme.spacing[value as keyof typeof theme.spacing];
    }
    return undefined;
  };

  const getBorderRadiusValue = (value: string | number | undefined): number | undefined => {
    if (typeof value === 'number') return value;
    if (typeof value === 'string' && theme.borderRadius[value as keyof typeof theme.borderRadius]) {
      return theme.borderRadius[value as keyof typeof theme.borderRadius];
    }
    return undefined;
  };

  const getBackgroundColor = (value: string | undefined): string | undefined => {
    if (!value) return undefined;
    
    // Check if it's a theme color key
    if (colors[value as keyof typeof colors]) {
      return colors[value as keyof typeof colors];
    }
    
    // Otherwise treat as custom color
    return value;
  };

  const flexStyle: ViewStyle = {
    display: 'flex',
    flexDirection: direction,
    justifyContent: justify,
    alignItems: align,
    flexWrap: wrap,
    ...(flex !== undefined && { flex }),
    ...(padding !== undefined && { padding: getSpacingValue(padding) }),
    ...(margin !== undefined && { margin: getSpacingValue(margin) }),
    ...(backgroundColor && { backgroundColor: getBackgroundColor(backgroundColor) }),
    ...(borderRadius !== undefined && { borderRadius: getBorderRadiusValue(borderRadius) }),
    ...(gap !== undefined && { gap: getSpacingValue(gap) }),
  };

  return (
    <View style={[flexStyle, style]} {...props}>
      {children}
    </View>
  );
};

export default Flex;
