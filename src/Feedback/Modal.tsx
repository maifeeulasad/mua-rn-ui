import React, { useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  Modal as RNModal,
  TouchableOpacity, 
  TouchableWithoutFeedback,
  Animated,
  Dimensions,
  ViewStyle, 
  TextStyle,
} from 'react-native';
import { useTheme, useColors } from '../themes';

export interface ModalProps {
  visible: boolean;
  title?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  onClose?: () => void;
  onCancel?: () => void;
  onOk?: () => void;
  closable?: boolean;
  maskClosable?: boolean;
  transparent?: boolean;
  animationType?: 'slide' | 'fade' | 'none';
  popup?: boolean;
  operation?: boolean;
  platform?: 'android' | 'ios';
  style?: ViewStyle;
  bodyStyle?: ViewStyle;
  titleStyle?: TextStyle;
  maskStyle?: ViewStyle;
  testID?: string;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const Modal: React.FC<ModalProps> = ({
  visible,
  title,
  children,
  footer,
  onClose,
  onCancel,
  onOk,
  closable = true,
  maskClosable = true,
  transparent = true,
  animationType = 'fade',
  popup = false,
  operation = false,
  platform = 'ios',
  style,
  bodyStyle,
  titleStyle,
  maskStyle,
  testID,
}) => {
  const theme = useTheme();
  const colors = useColors();
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(screenHeight)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: screenHeight,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, fadeAnim, slideAnim]);

  const handleMaskPress = () => {
    if (maskClosable) {
      onClose?.();
    }
  };

  const handleClose = () => {
    onClose?.();
  };

  const handleCancel = () => {
    onCancel?.();
    onClose?.();
  };

  const handleOk = () => {
    onOk?.();
    onClose?.();
  };

  // Define styles using theme values
  const containerStyle: ViewStyle = {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  };

  const themeAwareMaskStyle: ViewStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors?.overlay || 'rgba(0, 0, 0, 0.5)',
  };

  const maskTouchableStyle: ViewStyle = {
    flex: 1,
  };

  const centerModalStyle: ViewStyle = {
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  };

  const popupModalStyle: ViewStyle = {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  };

  const modalStyle: ViewStyle = {
    backgroundColor: colors?.surface || '#ffffff',
    borderRadius: theme?.borderRadius?.md || 8,
    maxWidth: screenWidth - 32,
    maxHeight: screenHeight - 100,
    overflow: 'hidden',
    ...(theme?.shadows?.lg || {
      elevation: 5,
      shadowColor: colors?.shadow || '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    }),
  };

  const headerStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme?.spacing?.md || 16,
    paddingVertical: theme?.spacing?.md || 12,
    borderBottomWidth: 1,
    borderBottomColor: colors?.border || '#e8e8e8',
  };

  const themeAwareTitleStyle: TextStyle = {
    fontSize: theme?.typography?.fontSize?.md || 16,
    fontWeight: theme?.typography?.fontWeight?.semibold || '600',
    color: colors?.text || '#333333',
    flex: 1,
  };

  const closeButtonStyle: ViewStyle = {
    marginLeft: theme?.spacing?.md || 12,
    padding: theme?.spacing?.xs || 4,
  };

  const closeIconStyle: TextStyle = {
    fontSize: theme?.typography?.fontSize?.md || 16,
    color: colors?.textSecondary || '#666666',
    fontWeight: theme?.typography?.fontWeight?.bold || 'bold',
  };

  const contentStyle: ViewStyle = {
    padding: theme?.spacing?.md || 16,
    maxHeight: screenHeight - 200,
  };

  const footerStyle: ViewStyle = {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: theme?.spacing?.md || 16,
    paddingVertical: theme?.spacing?.md || 12,
    borderTopWidth: 1,
    borderTopColor: colors?.border || '#e8e8e8',
  };

  const buttonStyle: ViewStyle = {
    paddingHorizontal: theme?.spacing?.md || 16,
    paddingVertical: theme?.spacing?.sm || 8,
    borderRadius: theme?.borderRadius?.sm || 4,
    marginLeft: theme?.spacing?.sm || 8,
    minWidth: 64,
    alignItems: 'center',
  };

  const cancelButtonStyle: ViewStyle = {
    backgroundColor: colors?.surface || '#f5f5f5',
    borderWidth: 1,
    borderColor: colors?.border || '#d9d9d9',
  };

  const cancelButtonTextStyle: TextStyle = {
    fontSize: theme?.typography?.fontSize?.sm || 14,
    color: colors?.text || '#333333',
  };

  const okButtonStyle: ViewStyle = {
    backgroundColor: colors?.primary || '#1890ff',
  };

  const okButtonTextStyle: TextStyle = {
    fontSize: theme?.typography?.fontSize?.sm || 14,
    color: colors?.buttonText || '#ffffff',
    fontWeight: theme?.typography?.fontWeight?.medium || '500',
  };

  const renderHeader = () => {
    if (!title && !closable) return null;

    return (
      <View style={headerStyle}>
        {title && (
          <Text style={[themeAwareTitleStyle, titleStyle]} numberOfLines={1}>
            {title}
          </Text>
        )}
        {closable && (
          <TouchableOpacity
            onPress={handleClose}
            style={closeButtonStyle}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={closeIconStyle}>✕</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderFooter = () => {
    if (footer) {
      return <View style={footerStyle}>{footer}</View>;
    }

    if (operation) {
      return (
        <View style={footerStyle}>
          <TouchableOpacity
            onPress={handleCancel}
            style={[buttonStyle, cancelButtonStyle]}
          >
            <Text style={cancelButtonTextStyle}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleOk}
            style={[buttonStyle, okButtonStyle]}
          >
            <Text style={okButtonTextStyle}>OK</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return null;
  };

  const getModalStyle = () => {
    if (popup) {
      return [
        popupModalStyle,
        {
          transform: [{ translateY: slideAnim }],
        },
        style,
      ];
    }

    return [
      centerModalStyle,
      {
        opacity: fadeAnim,
      },
      style,
    ];
  };

  const getMaskStyle = () => {
    return [
      themeAwareMaskStyle,
      {
        opacity: fadeAnim,
      },
      maskStyle,
    ];
  };

  return (
    <RNModal
      visible={visible}
      transparent={transparent}
      animationType="none"
      onRequestClose={handleClose}
      testID={testID}
    >
      <View style={containerStyle}>
        <Animated.View style={getMaskStyle()}>
          <TouchableWithoutFeedback onPress={handleMaskPress}>
            <View style={maskTouchableStyle} />
          </TouchableWithoutFeedback>
        </Animated.View>

        <Animated.View style={getModalStyle()}>
          <View style={[modalStyle, bodyStyle]}>
            {renderHeader()}
            
            <View style={contentStyle}>
              {children}
            </View>
            
            {renderFooter()}
          </View>
        </Animated.View>
      </View>
    </RNModal>
  );
};

export default Modal;
