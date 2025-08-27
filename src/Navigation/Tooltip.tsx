import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ViewStyle,
  TextStyle,
  Dimensions,
} from 'react-native';
import { useTheme, useColors } from '../themes';

type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

interface TooltipProps {
  content: string;
  position?: TooltipPosition;
  backgroundColor?: string;
  textColor?: string;
  arrowSize?: number;
  containerStyle?: ViewStyle;
  textStyle?: TextStyle;
  children: React.ReactElement;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const Tooltip: React.FC<TooltipProps> = ({
  content,
  position = 'top',
  backgroundColor,
  textColor,
  arrowSize = 8,
  containerStyle,
  textStyle,
  children,
}) => {
  const theme = useTheme();
  const colors = useColors();
  
  const [isVisible, setIsVisible] = useState(false);
  const [targetLayout, setTargetLayout] = useState({ x: 0, y: 0, width: 0, height: 0 });

  // Use theme colors with fallbacks
  const finalBackgroundColor = backgroundColor || colors?.text || '#333';
  const finalTextColor = textColor || colors?.buttonText || '#fff';

  const showTooltip = () => {
    setIsVisible(true);
  };

  const hideTooltip = () => {
    setIsVisible(false);
  };

  const onLayout = (event: any) => {
    const { x, y, width, height } = event.nativeEvent.layout;
    setTargetLayout({ x, y, width, height });
  };

  const getTooltipStyle = (): ViewStyle => {
    const tooltipWidth = 200;
    const tooltipHeight = 40;
    let top = 0;
    let left = 0;

    switch (position) {
      case 'top':
        top = targetLayout.y - tooltipHeight - arrowSize;
        left = targetLayout.x + targetLayout.width / 2 - tooltipWidth / 2;
        break;
      case 'bottom':
        top = targetLayout.y + targetLayout.height + arrowSize;
        left = targetLayout.x + targetLayout.width / 2 - tooltipWidth / 2;
        break;
      case 'left':
        top = targetLayout.y + targetLayout.height / 2 - tooltipHeight / 2;
        left = targetLayout.x - tooltipWidth - arrowSize;
        break;
      case 'right':
        top = targetLayout.y + targetLayout.height / 2 - tooltipHeight / 2;
        left = targetLayout.x + targetLayout.width + arrowSize;
        break;
    }

    return {
      position: 'absolute',
      top: Math.max(10, Math.min(top, screenHeight - tooltipHeight - 10)),
      left: Math.max(10, Math.min(left, screenWidth - tooltipWidth - 10)),
      width: tooltipWidth,
      minHeight: tooltipHeight,
      backgroundColor: finalBackgroundColor,
      borderRadius: theme?.borderRadius?.md || 8,
      paddingHorizontal: theme?.spacing?.md || 12,
      paddingVertical: theme?.spacing?.sm || 8,
      ...containerStyle,
    };
  };

  return (
    <>
      <TouchableOpacity
        onPress={showTooltip}
        onLayout={onLayout}
        activeOpacity={0.8}
      >
        {children}
      </TouchableOpacity>

      <Modal
        transparent
        visible={isVisible}
        onRequestClose={hideTooltip}
        animationType="fade"
      >
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: colors?.overlay || 'rgba(0, 0, 0, 0.1)',
          }}
          activeOpacity={1}
          onPress={hideTooltip}
        >
          <View style={getTooltipStyle()}>
            <Text
              style={[
                {
                  fontSize: theme?.typography?.fontSize?.sm || 14,
                  textAlign: 'center',
                  color: finalTextColor,
                },
                textStyle,
              ]}
            >
              {content}
            </Text>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

export default Tooltip;
