import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useTheme, useColors } from '../themes';

export interface TabBarItem {
  key: string;
  title: string;
  icon?: React.ReactNode;
  badge?: string | number;
  disabled?: boolean;
}

interface TabBarProps {
  items: TabBarItem[];
  activeKey: string;
  onChange: (key: string) => void;
  style?: ViewStyle;
  tabStyle?: ViewStyle;
  activeTabStyle?: ViewStyle;
  textStyle?: TextStyle;
  activeTextStyle?: TextStyle;
  backgroundColor?: string;
  activeColor?: string;
  inactiveColor?: string;
  showBadge?: boolean;
  badgeColor?: string;
  badgeTextColor?: string;
}

const TabBar: React.FC<TabBarProps> = ({
  items,
  activeKey,
  onChange,
  style,
  tabStyle,
  activeTabStyle,
  textStyle,
  activeTextStyle,
  backgroundColor,
  activeColor,
  inactiveColor,
  showBadge = true,
  badgeColor,
  badgeTextColor,
}) => {
  const theme = useTheme();
  const colors = useColors();

  // Use theme colors with fallbacks
  const finalBackgroundColor = backgroundColor || colors?.surface || '#fff';
  const finalActiveColor = activeColor || colors?.primary || '#007AFF';
  const finalInactiveColor = inactiveColor || colors?.textSecondary || '#666';
  const finalBadgeColor = badgeColor || colors?.error || '#FF3B30';
  const finalBadgeTextColor = badgeTextColor || colors?.buttonText || '#fff';

  // Define styles using theme values
  const containerStyle: ViewStyle = {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors?.border || '#E0E0E0',
    paddingHorizontal: theme?.spacing?.xs || 4,
    backgroundColor: finalBackgroundColor,
  };

  const tabStyleBase: ViewStyle = {
    flex: 1,
    paddingVertical: theme?.spacing?.sm || 8,
    paddingHorizontal: theme?.spacing?.xs || 4,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  };

  const tabContentStyle: ViewStyle = {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  };

  const iconContainerStyle: ViewStyle = {
    marginBottom: theme?.spacing?.xs || 4,
    position: 'relative',
  };

  const tabTextStyle: TextStyle = {
    fontSize: theme?.typography?.fontSize?.xs || 12,
    fontWeight: theme?.typography?.fontWeight?.medium || '500',
    textAlign: 'center',
  };

  const activeIndicatorStyle: ViewStyle = {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: finalActiveColor,
  };

  const badgeStyle: ViewStyle = {
    position: 'absolute',
    top: -6,
    right: -6,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme?.spacing?.xs || 4,
    backgroundColor: finalBadgeColor,
  };

  const badgeTextStyle: TextStyle = {
    fontSize: theme?.typography?.fontSize?.xs || 10,
    fontWeight: theme?.typography?.fontWeight?.bold || 'bold',
    color: finalBadgeTextColor,
  };
  const renderBadge = (badge?: string | number) => {
    if (!showBadge || !badge) return null;

    return (
      <View style={badgeStyle}>
        <Text style={badgeTextStyle}>
          {typeof badge === 'number' && badge > 99 ? '99+' : badge}
        </Text>
      </View>
    );
  };

  const renderTab = (item: TabBarItem) => {
    const isActive = item.key === activeKey;
    const isDisabled = item.disabled;

    return (
      <TouchableOpacity
        key={item.key}
        style={[
          tabStyleBase,
          tabStyle,
          isActive && activeTabStyle,
        ]}
        onPress={() => !isDisabled && onChange(item.key)}
        disabled={isDisabled}
        activeOpacity={0.7}
      >
        <View style={tabContentStyle}>
          {item.icon && (
            <View style={iconContainerStyle}>
              {item.icon}
              {renderBadge(item.badge)}
            </View>
          )}
          <Text
            style={[
              tabTextStyle,
              { color: isDisabled ? (colors?.textDisabled || '#CCC') : isActive ? finalActiveColor : finalInactiveColor },
              textStyle,
              isActive && activeTextStyle,
            ]}
            numberOfLines={1}
          >
            {item.title}
          </Text>
          {!item.icon && renderBadge(item.badge)}
        </View>
        {isActive && <View style={activeIndicatorStyle} />}
      </TouchableOpacity>
    );
  };

  return (
    <View style={[containerStyle, style]}>
      {items.map(renderTab)}
    </View>
  );
};

export default TabBar;
