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
          backgroundColor: '#fff7e6',
          borderColor: '#ffd591',
          textColor: '#fa8c16',
        };
      case 'error':
        return {
          backgroundColor: '#fff2f0',
          borderColor: '#ffccc7',
          textColor: '#ff4d4f',
        };
      case 'success':
        return {
          backgroundColor: '#f6ffed',
          borderColor: '#b7eb8f',
          textColor: '#52c41a',
        };
      default:
        return {
          backgroundColor: '#e6f7ff',
          borderColor: '#91d5ff',
          textColor: '#1890ff',
        };
    }
  };

  const typeStyles = getTypeStyles();

  const containerStyles: ViewStyle[] = [
    styles.container,
    {
      backgroundColor: typeStyles.backgroundColor,
      borderColor: typeStyles.borderColor,
    },
    ...(mode === 'link' ? [styles.linkMode] : []),
    ...(style ? [style] : []),
  ];

  const contentTextStyles: TextStyle[] = [
    styles.text,
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
        style={styles.closeButton}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Text style={[styles.closeIcon, { color: typeStyles.textColor }]}>✕</Text>
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
              styles.marqueeContainer,
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
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      
      <View style={styles.contentContainer}>
        {renderContent()}
      </View>
      
      {action && <View style={styles.actionContainer}>{action}</View>}
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

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderRadius: 4,
    marginVertical: 2,
  },
  linkMode: {
    // Add any link-specific styles
  },
  iconContainer: {
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    flex: 1,
    overflow: 'hidden',
  },
  marqueeContainer: {
    flexDirection: 'row',
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
  },
  actionContainer: {
    marginLeft: 8,
  },
  closeButton: {
    marginLeft: 8,
    padding: 4,
  },
  closeIcon: {
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default NoticeBar;
