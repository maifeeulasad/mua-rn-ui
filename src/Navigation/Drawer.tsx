import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Modal,
  TouchableOpacity,
  Animated,
  Dimensions,
  StyleSheet,
  ViewStyle,
  ModalProps,
} from 'react-native';

type DrawerPosition = 'left' | 'right';

interface DrawerProps extends Omit<ModalProps, 'visible'> {
  isOpen: boolean;
  onClose: () => void;
  position?: DrawerPosition;
  width?: number;
  overlayColor?: string;
  drawerStyle?: ViewStyle;
  overlayStyle?: ViewStyle;
  children: React.ReactNode;
}

const { width: screenWidth } = Dimensions.get('window');

const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  position = 'left',
  width = screenWidth * 0.8,
  overlayColor = 'rgba(0, 0, 0, 0.5)',
  drawerStyle,
  overlayStyle,
  children,
  ...modalProps
}) => {
  const translateX = useRef(new Animated.Value(position === 'left' ? -width : width)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isOpen) {
      Animated.parallel([
        Animated.timing(translateX, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateX, {
          toValue: position === 'left' ? -width : width,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isOpen, translateX, overlayOpacity, position, width]);

  const drawerStyles: ViewStyle = {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width,
    backgroundColor: '#fff',
    ...(position === 'left' ? { left: 0 } : { right: 0 }),
    ...drawerStyle,
  };

  return (
    <Modal
      transparent
      visible={isOpen}
      onRequestClose={onClose}
      {...modalProps}
    >
      <View style={{ flex: 1 }}>
        <Animated.View
          style={[
            {
              ...StyleSheet.absoluteFillObject,
              backgroundColor: overlayColor,
              opacity: overlayOpacity,
            },
            overlayStyle,
          ]}
        >
          <TouchableOpacity
            style={{ flex: 1 }}
            activeOpacity={1}
            onPress={onClose}
          />
        </Animated.View>
        
        <Animated.View
          style={[
            drawerStyles,
            {
              transform: [{ translateX }],
            },
          ]}
        >
          {children}
        </Animated.View>
      </View>
    </Modal>
  );
};

export default Drawer;
