import React from 'react';
import { 
  View, 
  Text, 
  ViewStyle, 
  TextStyle, 
  TouchableOpacity,
  StyleSheet 
} from 'react-native';
import { useTheme, useColors } from '../themes';

export interface IconProps {
  name: string;
  size?: number;
  color?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
  onPress?: () => void;
  disabled?: boolean;
  testID?: string;
  family?: 'material' | 'ionicons' | 'fontawesome' | 'antdesign' | 'feather' | 'entypo';
}

// Common icon mappings for different icon families
const iconMappings = {
  material: {
    home: '🏠',
    search: '🔍',
    star: '⭐',
    heart: '❤️',
    user: '👤',
    settings: '⚙️',
    menu: '☰',
    close: '✕',
    check: '✓',
    arrow_back: '←',
    arrow_forward: '→',
    arrow_up: '↑',
    arrow_down: '↓',
    add: '+',
    remove: '-',
    edit: '✏️',
    delete: '🗑️',
    share: '📤',
    download: '⬇️',
    upload: '⬆️',
    refresh: '🔄',
    info: 'ℹ️',
    warning: '⚠️',
    error: '❌',
    success: '✅',
  },
  ionicons: {
    home: '🏠',
    search: '🔍',
    star: '⭐',
    heart: '❤️',
    person: '👤',
    settings: '⚙️',
    menu: '☰',
    close: '✕',
    checkmark: '✓',
    'arrow-back': '←',
    'arrow-forward': '→',
    'arrow-up': '↑',
    'arrow-down': '↓',
    add: '+',
    remove: '-',
    create: '✏️',
    trash: '🗑️',
    share: '📤',
    download: '⬇️',
    refresh: '🔄',
    'information-circle': 'ℹ️',
    warning: '⚠️',
    'close-circle': '❌',
    'checkmark-circle': '✅',
  },
};

const Icon: React.FC<IconProps> = ({
  name,
  size = 24,
  color,
  style,
  textStyle,
  onPress,
  disabled = false,
  testID,
  family = 'material',
}) => {
  const theme = useTheme();
  const colors = useColors();

  // Use theme color if no color is provided
  const iconColor = color || colors.text;
  const getIconContent = () => {
    const familyIcons = iconMappings[family as keyof typeof iconMappings] || iconMappings.material;
    const iconChar = familyIcons[name as keyof typeof familyIcons];
    
    if (iconChar) {
      return iconChar;
    }
    
    // Fallback to first character of name if no mapping found
    return name.charAt(0).toUpperCase();
  };

  // Theme-aware styles
  const containerStyleThemed: ViewStyle = {
    justifyContent: 'center',
    alignItems: 'center',
  };

  const touchableStyleThemed: ViewStyle = {
    borderRadius: theme.borderRadius.sm,
  };

  const iconStyleThemed: TextStyle = {
    textAlign: 'center',
    includeFontPadding: false,
    textAlignVertical: 'center',
  };

  const disabledStyleThemed: ViewStyle = {
    opacity: 0.5,
  };

  const iconStyles: TextStyle[] = [
    iconStyleThemed,
    {
      fontSize: size,
      color: iconColor,
    },
    ...(textStyle ? [textStyle] : []),
  ];

  const containerStyles: ViewStyle[] = [
    containerStyleThemed,
    {
      width: size + theme.spacing.xs,
      height: size + theme.spacing.xs,
    },
    ...(disabled ? [disabledStyleThemed] : []),
    ...(style ? [style] : []),
  ];

  const renderIcon = () => (
    <View style={containerStyles} testID={testID}>
      <Text style={iconStyles} allowFontScaling={false}>
        {getIconContent()}
      </Text>
    </View>
  );

  if (onPress && !disabled) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.7}
        disabled={disabled}
        style={touchableStyleThemed}
      >
        {renderIcon()}
      </TouchableOpacity>
    );
  }

  return renderIcon();
};

// Additional helper components for common icons
export const HomeIcon: React.FC<Omit<IconProps, 'name'>> = (props) => (
  <Icon {...props} name="home" />
);

export const SearchIcon: React.FC<Omit<IconProps, 'name'>> = (props) => (
  <Icon {...props} name="search" />
);

export const StarIcon: React.FC<Omit<IconProps, 'name'>> = (props) => (
  <Icon {...props} name="star" />
);

export const HeartIcon: React.FC<Omit<IconProps, 'name'>> = (props) => (
  <Icon {...props} name="heart" />
);

export const UserIcon: React.FC<Omit<IconProps, 'name'>> = (props) => (
  <Icon {...props} name="user" />
);

export const SettingsIcon: React.FC<Omit<IconProps, 'name'>> = (props) => (
  <Icon {...props} name="settings" />
);

export const MenuIcon: React.FC<Omit<IconProps, 'name'>> = (props) => (
  <Icon {...props} name="menu" />
);

export const CloseIcon: React.FC<Omit<IconProps, 'name'>> = (props) => (
  <Icon {...props} name="close" />
);

export const CheckIcon: React.FC<Omit<IconProps, 'name'>> = (props) => (
  <Icon {...props} name="check" />
);

export const ArrowBackIcon: React.FC<Omit<IconProps, 'name'>> = (props) => (
  <Icon {...props} name="arrow_back" />
);

export default Icon;
