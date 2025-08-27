import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  Animated,
  Dimensions,
  ViewStyle, 
  TextStyle,
  StyleSheet 
} from 'react-native';

export interface ToastProps {
  content: string;
  type?: 'info' | 'success' | 'fail' | 'loading' | 'offline';
  duration?: number;
  position?: 'top' | 'center' | 'bottom';
  mask?: boolean;
  onClose?: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  testID?: string;
}

interface ToastManager {
  show: (props: ToastProps) => void;
  hide: () => void;
  info: (content: string, duration?: number, onClose?: () => void) => void;
  success: (content: string, duration?: number, onClose?: () => void) => void;
  fail: (content: string, duration?: number, onClose?: () => void) => void;
  loading: (content: string, duration?: number, onClose?: () => void) => void;
  offline: (content: string, duration?: number, onClose?: () => void) => void;
}

let toastRef: { current: ToastManager | null } = { current: null };

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const Toast: React.FC<ToastProps> = ({
  content,
  type = 'info',
  duration = 3000,
  position = 'center',
  mask = false,
  onClose,
  style,
  textStyle,
  testID,
}) => {
  const [visible, setVisible] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (visible) {
      show();
    } else {
      hide();
    }
  }, [visible]);

  const show = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    if (duration > 0) {
      timeoutRef.current = setTimeout(() => {
        setVisible(false);
      }, duration);
    }
  };

  const hide = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.8,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose?.();
    });
  };

  const getTypeIcon = () => {
    switch (type) {
      case 'success':
        return '✓';
      case 'fail':
        return '✕';
      case 'loading':
        return '⟳';
      case 'offline':
        return '⚠';
      default:
        return 'ℹ';
    }
  };

  const getTypeColor = () => {
    switch (type) {
      case 'success':
        return '#52c41a';
      case 'fail':
        return '#ff4d4f';
      case 'loading':
        return '#1890ff';
      case 'offline':
        return '#fa8c16';
      default:
        return '#1890ff';
    }
  };

  const getPositionStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      position: 'absolute',
      left: 0,
      right: 0,
      alignItems: 'center',
      zIndex: 9999,
    };

    switch (position) {
      case 'top':
        return {
          ...baseStyle,
          top: 100,
        };
      case 'bottom':
        return {
          ...baseStyle,
          bottom: 100,
        };
      default: // center
        return {
          ...baseStyle,
          top: screenHeight / 2 - 50,
        };
    }
  };

  const containerStyles: ViewStyle[] = [
    styles.container,
    getPositionStyle(),
    ...(style ? [style] : []),
  ];

  const toastStyles: ViewStyle[] = [
    styles.toast,
    {
      backgroundColor: mask ? 'rgba(0, 0, 0, 0.8)' : '#ffffff',
      borderColor: getTypeColor(),
    },
    ...(mask ? [styles.maskToast] : [styles.normalToast]),
  ];

  const iconStyles: TextStyle[] = [
    styles.icon,
    {
      color: mask ? '#ffffff' : getTypeColor(),
    },
  ];

  const contentTextStyles: TextStyle[] = [
    styles.content,
    {
      color: mask ? '#ffffff' : '#333333',
    },
    ...(textStyle ? [textStyle] : []),
  ];

  if (!visible) {
    return null;
  }

  return (
    <View style={containerStyles} testID={testID} pointerEvents="none">
      <Animated.View
        style={[
          toastStyles,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Text style={iconStyles}>{getTypeIcon()}</Text>
        <Text style={contentTextStyles} numberOfLines={3}>
          {content}
        </Text>
      </Animated.View>
    </View>
  );
};

// Toast Manager Component
const ToastContainer: React.FC = () => {
  const [toastProps, setToastProps] = useState<ToastProps | null>(null);

  const toastManager: ToastManager = {
    show: (props: ToastProps) => {
      setToastProps({ ...props });
    },
    hide: () => {
      setToastProps(null);
    },
    info: (content: string, duration = 3000, onClose?: () => void) => {
      toastManager.show({ content, type: 'info', duration, onClose });
    },
    success: (content: string, duration = 3000, onClose?: () => void) => {
      toastManager.show({ content, type: 'success', duration, onClose });
    },
    fail: (content: string, duration = 3000, onClose?: () => void) => {
      toastManager.show({ content, type: 'fail', duration, onClose });
    },
    loading: (content: string, duration = 0, onClose?: () => void) => {
      toastManager.show({ content, type: 'loading', duration, onClose });
    },
    offline: (content: string, duration = 3000, onClose?: () => void) => {
      toastManager.show({ content, type: 'offline', duration, onClose });
    },
  };

  useEffect(() => {
    toastRef.current = toastManager;
  }, []);

  if (!toastProps) {
    return null;
  }

  return (
    <Toast
      {...toastProps}
      onClose={() => {
        toastProps.onClose?.();
        setToastProps(null);
      }}
    />
  );
};

// Static methods for global usage
const ToastStatic: ToastManager = {
  show: (props: ToastProps) => {
    toastRef.current?.show(props);
  },
  hide: () => {
    toastRef.current?.hide();
  },
  info: (content: string, duration?: number, onClose?: () => void) => {
    toastRef.current?.info(content, duration, onClose);
  },
  success: (content: string, duration?: number, onClose?: () => void) => {
    toastRef.current?.success(content, duration, onClose);
  },
  fail: (content: string, duration?: number, onClose?: () => void) => {
    toastRef.current?.fail(content, duration, onClose);
  },
  loading: (content: string, duration?: number, onClose?: () => void) => {
    toastRef.current?.loading(content, duration, onClose);
  },
  offline: (content: string, duration?: number, onClose?: () => void) => {
    toastRef.current?.offline(content, duration, onClose);
  },
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    maxWidth: screenWidth - 40,
    minWidth: 120,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  normalToast: {
    borderWidth: 1,
  },
  maskToast: {
    borderWidth: 0,
  },
  icon: {
    fontSize: 16,
    marginRight: 8,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'left',
  },
});

// Export both the component and static methods
export { ToastContainer };
export default ToastStatic;
