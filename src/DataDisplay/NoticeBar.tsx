import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Animated,
  ViewStyle, 
  TextStyle,
  StyleSheet 
} from 'react-native';
import { useTheme, useColors } from '../themes';

export interface NoticeBarProps {
  children?: React.ReactNode;
  mode?: 'closable' | 'link';
  type?: 'default' | 'alert' | 'error' | 'success';
  icon?: React.ReactNode;
  action?: React.ReactNode;
  onPress?: () => void;
  onClose?: () => void;
  marqueeProps?: {
    loop?: boolean;
    speed?: number;
  };
  style?: ViewStyle;
  textStyle?: TextStyle;
  wrap?: boolean;
  visible?: boolean;
  testID?: string;
}

const NoticeBar: React.FC<NoticeBarProps> = ({
  children,
  mode,
  type = 'default',
  icon,
  action,
  onPress,
  onClose,
  marqueeProps = { loop: true, speed: 50 },
  style,
  textStyle,
  wrap = false,
  visible = true,
  testID,
}) => {
  const theme = useTheme();
  const colors = useColors();
  
  const [isVisible, setIsVisible] = useState(visible);
  const scrollAnimation = useRef(new Animated.Value(0)).current;
  const fadeAnimation = useRef(new Animated.Value(visible ? 1 : 0)).current;

  useEffect(() => {
    if (visible !== isVisible) {
      Animated.timing(fadeAnimation, {
        toValue: visible ? 1 : 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        if (!visible) {
          setIsVisible(false);
        }
      });
      
      if (visible) {
        setIsVisible(true);
      }
    }
  }, [visible, isVisible, fadeAnimation]);

  useEffect(() => {
    if (isVisible && !wrap && marqueeProps.loop) {
      const startMarquee = () => {
        scrollAnimation.setValue(0);
        Animated.timing(scrollAnimation, {
          toValue: 1,
          duration: marqueeProps.speed ? marqueeProps.speed * 100 : 5000,
          useNativeDriver: true,
        }).start(() => {
          if (marqueeProps.loop) {
            startMarquee();
          }
        });
      };
      
      const timer = setTimeout(startMarquee, 1000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, wrap, marqueeProps, scrollAnimation]);

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  const handlePress = () => {
    if (mode === 'link' && onPress) {
      onPress();
    }
  };

  const getTypeStyles = () => {
    switch (type) {
      case 'alert':
        return {
          backgroundColor: colors.warning + '20', // Add transparency
          borderColor: colors.warning + '80',
          textColor: colors.warning,
        };
      case 'error':
        return {
          backgroundColor: colors.error + '20',
          borderColor: colors.error + '80',
          textColor: colors.error,
        };
      case 'success':
        return {
          backgroundColor: colors.success + '20',
          borderColor: colors.success + '80',
          textColor: colors.success,
        };
      default:
        return {
          backgroundColor: colors.info + '20' || colors.primary + '20',
          borderColor: colors.info + '80' || colors.primary + '80',
          textColor: colors.info || colors.primary,
        };
    }
  };

  // Theme-aware styles
  const containerStyleThemed: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderWidth: 1,
    borderRadius: theme.borderRadius.sm,
    marginVertical: 2,
  };

  const linkModeStyleThemed: ViewStyle = {
    // Add any link-specific styles
  };

  const iconContainerStyleThemed: ViewStyle = {
    marginRight: theme.spacing.xs,
    alignItems: 'center',
    justifyContent: 'center',
  };

  const contentContainerStyleThemed: ViewStyle = {
    flex: 1,
    overflow: 'hidden',
  };

  const marqueeContainerStyleThemed: ViewStyle = {
    flexDirection: 'row',
  };

  const textStyleThemed: TextStyle = {
    fontSize: theme.typography.fontSize.sm,
    lineHeight: theme.typography.lineHeight.sm,
  };

  const actionContainerStyleThemed: ViewStyle = {
    marginLeft: theme.spacing.xs,
  };

  const closeButtonStyleThemed: ViewStyle = {
    marginLeft: theme.spacing.xs,
    padding: theme.spacing.xs / 2,
  };

  const closeIconStyleThemed: TextStyle = {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.bold,
  };

  const typeStyles = getTypeStyles();

  const containerStyles: ViewStyle[] = [
    containerStyleThemed,
    {
      backgroundColor: typeStyles.backgroundColor,
      borderColor: typeStyles.borderColor,
    },
    ...(mode === 'link' ? [linkModeStyleThemed] : []),
    ...(style ? [style] : []),
  ];

  const contentTextStyles: TextStyle[] = [
    textStyleThemed,
    {
      color: typeStyles.textColor,
    },
    ...(textStyle ? [textStyle] : []),
  ];

  if (!isVisible) {
    return null;
  }

  const renderCloseButton = () => {
    if (mode !== 'closable') return null;
    
    return (
      <TouchableOpacity
        onPress={handleClose}
        style={closeButtonStyleThemed}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Text style={[closeIconStyleThemed, { color: typeStyles.textColor }]}>✕</Text>
      </TouchableOpacity>
    );
  };

  const renderContent = () => {
    if (typeof children === 'string') {
      if (wrap) {
        return (
          <Text style={contentTextStyles} numberOfLines={0}>
            {children}
          </Text>
        );
      } else {
        return (
          <Animated.View
            style={[
              marqueeContainerStyleThemed,
              {
                transform: [
                  {
                    translateX: scrollAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, -200], // Adjust based on content width
                    }),
                  },
                ],
              },
            ]}
          >
            <Text style={contentTextStyles} numberOfLines={1}>
              {children}
            </Text>
          </Animated.View>
        );
      }
    }
    
    return children;
  };

  const content = (
    <Animated.View
      style={[
        containerStyles,
        {
          opacity: fadeAnimation,
        },
      ]}
      testID={testID}
    >
      {icon && <View style={iconContainerStyleThemed}>{icon}</View>}
      
      <View style={contentContainerStyleThemed}>
        {renderContent()}
      </View>
      
      {action && <View style={actionContainerStyleThemed}>{action}</View>}
      {renderCloseButton()}
    </Animated.View>
  );

  if (mode === 'link' && onPress) {
    return (
      <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
};

export default NoticeBar;
