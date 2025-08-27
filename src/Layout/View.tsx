import React from 'react';
import { View as RNView, ViewProps, ViewStyle } from 'react-native';
import { useTheme, useColors } from '../themes';

interface CustomViewProps extends ViewProps {
  padding?: number;
  margin?: number;
  backgroundColor?: string;
  borderRadius?: number;
  shadow?: boolean;
  style?: ViewStyle;
}

const View: React.FC<CustomViewProps> = ({
  padding,
  margin,
  backgroundColor,
  borderRadius,
  shadow = false,
  style,
  children,
  ...props
}) => {
  const theme = useTheme();
  const colors = useColors();

  const viewStyle: ViewStyle = {
    ...(padding !== undefined && { padding }),
    ...(margin !== undefined && { margin }),
    ...(backgroundColor && { backgroundColor }),
    ...(borderRadius !== undefined && { borderRadius }),
    ...(shadow && {
      shadowColor: colors?.shadow || '#000',
      ...(theme?.shadows?.md || {
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      }),
    }),
  };

  return (
    <RNView style={[viewStyle, style]} {...props}>
      {children}
    </RNView>
  );
};

export default View;
