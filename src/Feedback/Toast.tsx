import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  Animated,
  Dimensions,
  ViewStyle, 
  TextStyle,
} from 'react-native';
import { useTheme, useColors } from '../themes';

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
  const theme = useTheme();
  const colors = useColors();
  
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
    // Use theme colors with fallbacks
    switch (type) {
      case 'success':
        return colors?.success || '#52c41a';
      case 'fail':
        return colors?.error || '#ff4d4f';
      case 'loading':
        return colors?.primary || '#1890ff';
      case 'offline':
        return colors?.warning || '#fa8c16';
      default:
        return colors?.info || '#1890ff';
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

  // Define styles using theme values
  const containerStyle: ViewStyle = {
    paddingHorizontal: theme?.spacing?.lg || 20,
  };

  const toastStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme?.spacing?.md || 16,
    paddingVertical: theme?.spacing?.md || 12,
    borderRadius: theme?.borderRadius?.md || 8,
    maxWidth: screenWidth - 40,
    minWidth: 120,
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

  const normalToastStyle: ViewStyle = {
    borderWidth: 1,
  };

  const maskToastStyle: ViewStyle = {
    borderWidth: 0,
  };

  const iconStyle: TextStyle = {
    fontSize: theme?.typography?.fontSize?.md || 16,
    marginRight: theme?.spacing?.sm || 8,
    fontWeight: theme?.typography?.fontWeight?.bold || 'bold',
  };

  const contentStyle: TextStyle = {
    flex: 1,
    fontSize: theme?.typography?.fontSize?.sm || 14,
    lineHeight: theme?.typography?.lineHeight?.sm || 20,
    textAlign: 'left',
  };

  const containerStyles: ViewStyle[] = [
    containerStyle,
    getPositionStyle(),
    ...(style ? [style] : []),
  ];

  const toastStyles: ViewStyle[] = [
    toastStyle,
    {
      backgroundColor: mask ? (colors?.overlay || 'rgba(0, 0, 0, 0.8)') : (colors?.surface || '#ffffff'),
      borderColor: getTypeColor(),
    },
    ...(mask ? [maskToastStyle] : [normalToastStyle]),
  ];

  const iconStyles: TextStyle[] = [
    iconStyle,
    {
      color: mask ? (colors?.buttonText || '#ffffff') : getTypeColor(),
    },
  ];

  const contentTextStyles: TextStyle[] = [
    contentStyle,
    {
      color: mask ? (colors?.buttonText || '#ffffff') : (colors?.text || '#333333'),
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

// Export both the component and static methods
export { ToastContainer };
export default ToastStatic;
