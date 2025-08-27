import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ViewStyle, 
  TextStyle
} from 'react-native';
import { useTheme, useColors } from '../themes';

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
  const theme = useTheme();
  const colors = useColors();
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
      blue: { 
        bg: colors.primary + '1A', // 10% opacity
        text: colors.primary, 
        border: colors.primary + '4D' // 30% opacity
      },
      green: { 
        bg: colors.success + '1A', 
        text: colors.success, 
        border: colors.success + '4D' 
      },
      red: { 
        bg: colors.error + '1A', 
        text: colors.error, 
        border: colors.error + '4D' 
      },
      orange: { 
        bg: colors.warning + '1A', 
        text: colors.warning, 
        border: colors.warning + '4D' 
      },
      yellow: { 
        bg: colors.warning + '1A', 
        text: colors.warning, 
        border: colors.warning + '4D' 
      },
      purple: { 
        bg: colors.secondary + '1A', 
        text: colors.secondary, 
        border: colors.secondary + '4D' 
      },
      cyan: { 
        bg: colors.info + '1A', 
        text: colors.info, 
        border: colors.info + '4D' 
      },
      gray: { 
        bg: colors.surface, 
        text: colors.textSecondary, 
        border: colors.border 
      },
    };

    if (color && presetColors[color]) {
      return presetColors[color];
    }

    if (color) {
      // Custom color
      return {
        bg: color + '1A', // Add transparency
        text: color,
        border: color + '4D',
      };
    }

    // Default colors
    if (selected) {
      return { 
        bg: colors.primary, 
        text: colors.background, // Use background color as contrasting text
        border: colors.primary 
      };
    }

    return { 
      bg: colors.surface, 
      text: colors.text, 
      border: colors.border 
    };
  };

  const colorStyles = getColorStyles();

  const getContainerStyle = (isSmall: boolean): ViewStyle => ({
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: isSmall ? theme.spacing.xs : theme.spacing.sm,
    paddingVertical: isSmall ? theme.spacing.xs / 2 : theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
    alignSelf: 'flex-start',
    backgroundColor: colorStyles.bg,
    borderColor: colorStyles.border,
    opacity: disabled ? 0.5 : 1,
  });

  const getTextStyle = (isSmall: boolean): TextStyle => ({
    fontSize: isSmall ? theme.typography.fontSize.xs : theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.normal,
    lineHeight: isSmall ? theme.typography.lineHeight.xs : theme.typography.lineHeight.sm,
    color: colorStyles.text,
  });

  const getCloseButtonStyle = (): ViewStyle => ({
    marginLeft: theme.spacing.xs,
    padding: theme.spacing.xs / 2,
  });

  const getCloseIconStyle = (): TextStyle => ({
    fontSize: 10,
    fontWeight: 'bold',
    lineHeight: 12,
    color: colorStyles.text,
  });

  if (!visible) {
    return null;
  }

  const renderCloseIcon = () => {
    if (!closable) return null;
    
    return (
      <TouchableOpacity
        onPress={handleClose}
        style={getCloseButtonStyle()}
        hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
      >
        <Text style={getCloseIconStyle()}>✕</Text>
      </TouchableOpacity>
    );
  };

  const containerStyle = [
    getContainerStyle(small),
    style,
  ];

  const textStyles = [
    getTextStyle(small),
    textStyle,
  ];

  const content = (
    <View style={containerStyle} testID={testID}>
      <Text style={textStyles}>{children}</Text>
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

export default Tag;
