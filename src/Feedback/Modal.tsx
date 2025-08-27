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
  StyleSheet 
} from 'react-native';

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

  const renderHeader = () => {
    if (!title && !closable) return null;

    return (
      <View style={styles.header}>
        {title && (
          <Text style={[styles.title, titleStyle]} numberOfLines={1}>
            {title}
          </Text>
        )}
        {closable && (
          <TouchableOpacity
            onPress={handleClose}
            style={styles.closeButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.closeIcon}>✕</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderFooter = () => {
    if (footer) {
      return <View style={styles.footer}>{footer}</View>;
    }

    if (operation) {
      return (
        <View style={styles.footer}>
          <TouchableOpacity
            onPress={handleCancel}
            style={[styles.button, styles.cancelButton]}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleOk}
            style={[styles.button, styles.okButton]}
          >
            <Text style={styles.okButtonText}>OK</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return null;
  };

  const getModalStyle = () => {
    if (popup) {
      return [
        styles.popupModal,
        {
          transform: [{ translateY: slideAnim }],
        },
        style,
      ];
    }

    return [
      styles.centerModal,
      {
        opacity: fadeAnim,
      },
      style,
    ];
  };

  const getMaskStyle = () => {
    return [
      styles.mask,
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
      <View style={styles.container}>
        <Animated.View style={getMaskStyle()}>
          <TouchableWithoutFeedback onPress={handleMaskPress}>
            <View style={styles.maskTouchable} />
          </TouchableWithoutFeedback>
        </Animated.View>

        <Animated.View style={getModalStyle()}>
          <View style={[styles.modal, bodyStyle]}>
            {renderHeader()}
            
            <View style={styles.content}>
              {children}
            </View>
            
            {renderFooter()}
          </View>
        </Animated.View>
      </View>
    </RNModal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mask: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  maskTouchable: {
    flex: 1,
  },
  centerModal: {
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  popupModal: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  modal: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    maxWidth: screenWidth - 32,
    maxHeight: screenHeight - 100,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e8e8e8',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    flex: 1,
  },
  closeButton: {
    marginLeft: 12,
    padding: 4,
  },
  closeIcon: {
    fontSize: 16,
    color: '#666666',
    fontWeight: 'bold',
  },
  content: {
    padding: 16,
    maxHeight: screenHeight - 200,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#e8e8e8',
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
    marginLeft: 8,
    minWidth: 64,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#d9d9d9',
  },
  cancelButtonText: {
    fontSize: 14,
    color: '#333333',
  },
  okButton: {
    backgroundColor: '#1890ff',
  },
  okButtonText: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '500',
  },
});

export default Modal;
