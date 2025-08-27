import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ViewStyle, 
  TextStyle,
  StyleSheet 
} from 'react-native';

export interface TagProps {
  children?: React.ReactNode;
  color?: string;
  selected?: boolean;
  disabled?: boolean;
  closable?: boolean;
  small?: boolean;
  onPress?: () => void;
  onClose?: () => void;
  afterClose?: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  testID?: string;
}

const Tag: React.FC<TagProps> = ({
  children,
  color,
  selected = false,
  disabled = false,
  closable = false,
  small = false,
  onPress,
  onClose,
  afterClose,
  style,
  textStyle,
  testID,
}) => {
  const [visible, setVisible] = useState(true);

  const handleClose = () => {
    setVisible(false);
    onClose?.();
    // Call afterClose after a brief delay to allow for animation
    setTimeout(() => {
      afterClose?.();
    }, 150);
  };

  const getColorStyles = () => {
    const presetColors: { [key: string]: { bg: string; text: string; border: string } } = {
      blue: { bg: '#e6f7ff', text: '#1890ff', border: '#91d5ff' },
      green: { bg: '#f6ffed', text: '#52c41a', border: '#b7eb8f' },
      red: { bg: '#fff2f0', text: '#ff4d4f', border: '#ffccc7' },
      orange: { bg: '#fff7e6', text: '#fa8c16', border: '#ffd591' },
      yellow: { bg: '#feffe6', text: '#fadb14', border: '#fffb8f' },
      purple: { bg: '#f9f0ff', text: '#722ed1', border: '#d3adf7' },
      cyan: { bg: '#e6fffb', text: '#13c2c2', border: '#87e8de' },
      gray: { bg: '#f5f5f5', text: '#666666', border: '#d9d9d9' },
    };

    if (color && presetColors[color]) {
      return presetColors[color];
    }

    if (color) {
      // Custom color
      return {
        bg: color + '20', // Add transparency
        text: color,
        border: color + '60',
      };
    }

    // Default colors
    if (selected) {
      return { bg: '#1890ff', text: '#ffffff', border: '#1890ff' };
    }

    return { bg: '#fafafa', text: '#666666', border: '#d9d9d9' };
  };

  const colorStyles = getColorStyles();

  const containerStyles: ViewStyle[] = [
    styles.container,
    ...(small ? [styles.smallContainer] : []),
    {
      backgroundColor: colorStyles.bg,
      borderColor: colorStyles.border,
    },
    ...(selected ? [styles.selected] : []),
    ...(disabled ? [styles.disabled] : []),
    ...(style ? [style] : []),
  ];

  const tagTextStyles: TextStyle[] = [
    styles.text,
    ...(small ? [styles.smallText] : []),
    {
      color: colorStyles.text,
    },
    ...(textStyle ? [textStyle] : []),
  ];

  if (!visible) {
    return null;
  }

  const renderCloseIcon = () => {
    if (!closable) return null;
    
    return (
      <TouchableOpacity
        onPress={handleClose}
        style={styles.closeButton}
        hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
      >
        <Text style={[styles.closeIcon, { color: colorStyles.text }]}>✕</Text>
      </TouchableOpacity>
    );
  };

  const content = (
    <View style={containerStyles} testID={testID}>
      <Text style={tagTextStyles}>{children}</Text>
      {renderCloseIcon()}
    </View>
  );

  if (onPress && !disabled) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.8}
        disabled={disabled}
      >
        {content}
      </TouchableOpacity>
    );
  }

  return content;
};

// Preset color helper components
export const BlueTag: React.FC<Omit<TagProps, 'color'>> = (props) => (
  <Tag {...props} color="blue" />
);

export const GreenTag: React.FC<Omit<TagProps, 'color'>> = (props) => (
  <Tag {...props} color="green" />
);

export const RedTag: React.FC<Omit<TagProps, 'color'>> = (props) => (
  <Tag {...props} color="red" />
);

export const OrangeTag: React.FC<Omit<TagProps, 'color'>> = (props) => (
  <Tag {...props} color="orange" />
);

export const YellowTag: React.FC<Omit<TagProps, 'color'>> = (props) => (
  <Tag {...props} color="yellow" />
);

export const PurpleTag: React.FC<Omit<TagProps, 'color'>> = (props) => (
  <Tag {...props} color="purple" />
);

export const CyanTag: React.FC<Omit<TagProps, 'color'>> = (props) => (
  <Tag {...props} color="cyan" />
);

export const GrayTag: React.FC<Omit<TagProps, 'color'>> = (props) => (
  <Tag {...props} color="gray" />
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  smallContainer: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
  },
  selected: {
    // Selected styles are handled by color logic
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
  },
  smallText: {
    fontSize: 11,
    lineHeight: 14,
  },
  closeButton: {
    marginLeft: 6,
    padding: 2,
  },
  closeIcon: {
    fontSize: 10,
    fontWeight: 'bold',
    lineHeight: 12,
  },
});

export default Tag;
