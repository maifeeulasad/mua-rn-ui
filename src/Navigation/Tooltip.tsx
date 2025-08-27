import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ViewStyle,
  TextStyle,
  Dimensions,
} from 'react-native';

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
  backgroundColor = '#333',
  textColor = '#fff',
  arrowSize = 8,
  containerStyle,
  textStyle,
  children,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [targetLayout, setTargetLayout] = useState({ x: 0, y: 0, width: 0, height: 0 });

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
      backgroundColor,
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 8,
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
          style={styles.overlay}
          activeOpacity={1}
          onPress={hideTooltip}
        >
          <View style={getTooltipStyle()}>
            <Text style={[styles.text, { color: textColor }, textStyle]}>
              {content}
            </Text>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  text: {
    fontSize: 14,
    textAlign: 'center',
  },
});

export default Tooltip;
