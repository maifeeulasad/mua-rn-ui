import React from 'react';
import { View, ViewProps, ViewStyle } from 'react-native';

interface FlexProps extends ViewProps {
  direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  justify?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
  align?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
  wrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
  flex?: number;
  style?: ViewStyle;
}

const Flex: React.FC<FlexProps> = ({
  direction = 'row',
  justify = 'flex-start',
  align = 'flex-start',
  wrap = 'nowrap',
  flex,
  style,
  children,
  ...props
}) => {
  const flexStyle: ViewStyle = {
    display: 'flex',
    flexDirection: direction,
    justifyContent: justify,
    alignItems: align,
    flexWrap: wrap,
    ...(flex !== undefined && { flex }),
  };

  return (
    <View style={[flexStyle, style]} {...props}>
      {children}
    </View>
  );
};

export default Flex;
