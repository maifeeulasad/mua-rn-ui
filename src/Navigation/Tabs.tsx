import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ViewStyle,
  TextStyle,
  Dimensions,
} from 'react-native';
import { useTheme, useColors } from '../themes';

export interface TabItem {
  key: string;
  title: string;
  content: React.ReactNode;
  disabled?: boolean;
}

interface TabsProps {
  items: TabItem[];
  defaultActiveKey?: string;
  activeKey?: string;
  onChange?: (key: string) => void;
  style?: ViewStyle;
  tabBarStyle?: ViewStyle;
  contentStyle?: ViewStyle;
  tabStyle?: ViewStyle;
  activeTabStyle?: ViewStyle;
  textStyle?: TextStyle;
  activeTextStyle?: TextStyle;
  indicatorStyle?: ViewStyle;
  backgroundColor?: string;
  activeColor?: string;
  inactiveColor?: string;
  scrollable?: boolean;
  animated?: boolean;
}

const { width: screenWidth } = Dimensions.get('window');

const Tabs: React.FC<TabsProps> = ({
  items,
  defaultActiveKey,
  activeKey: controlledActiveKey,
  onChange,
  style,
  tabBarStyle,
  contentStyle,
  tabStyle,
  activeTabStyle,
  textStyle,
  activeTextStyle,
  indicatorStyle,
  backgroundColor,
  activeColor,
  inactiveColor,
  scrollable = false,
  animated = true,
}) => {
  const theme = useTheme();
  const colors = useColors();
  
  const [internalActiveKey, setInternalActiveKey] = useState(
    defaultActiveKey || items[0]?.key
  );

  const activeKey = controlledActiveKey !== undefined ? controlledActiveKey : internalActiveKey;

  // Use theme colors with fallbacks
  const finalBackgroundColor = backgroundColor || colors?.surface || '#fff';
  const finalActiveColor = activeColor || colors?.primary || '#007AFF';
  const finalInactiveColor = inactiveColor || colors?.textSecondary || '#666';

  const handleTabChange = (key: string) => {
    if (controlledActiveKey === undefined) {
      setInternalActiveKey(key);
    }
    onChange?.(key);
  };

  // Define styles using theme values
  const containerStyle: ViewStyle = {
    flex: 1,
  };

  const themeAwareTabBarStyle: ViewStyle = {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors?.border || '#E0E0E0',
    backgroundColor: finalBackgroundColor,
  };

  const scrollableTabBarStyleBase: ViewStyle = {
    borderBottomWidth: 1,
    borderBottomColor: colors?.border || '#E0E0E0',
    maxHeight: 48,
    backgroundColor: finalBackgroundColor,
  };

  const scrollableTabBarContentStyleBase: ViewStyle = {
    paddingHorizontal: theme?.spacing?.md || 16,
  };

  const tabStyleBase: ViewStyle = {
    paddingVertical: theme?.spacing?.md || 12,
    paddingHorizontal: theme?.spacing?.md || 16,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    minWidth: 80,
  };

  const tabTextStyleBase: TextStyle = {
    fontSize: theme?.typography?.fontSize?.sm || 14,
    fontWeight: theme?.typography?.fontWeight?.medium || '500',
    textAlign: 'center',
  };

  const indicatorStyleBase: ViewStyle = {
    position: 'absolute',
    bottom: 0,
    left: theme?.spacing?.md || 16,
    right: theme?.spacing?.md || 16,
    height: 2,
    borderRadius: 1,
    backgroundColor: finalActiveColor,
  };

  const contentStyleBase: ViewStyle = {
    flex: 1,
  };

  const renderTabBar = () => {
    const tabWidth = scrollable ? 'auto' : screenWidth / items.length;

    const renderTab = (item: TabItem, index: number) => {
      const isActive = item.key === activeKey;
      const isDisabled = item.disabled;

      const finalTabStyle: ViewStyle = {
        ...tabStyleBase,
        ...(!scrollable && { width: tabWidth }),
        ...tabStyle,
        ...(isActive && activeTabStyle),
      };

      const finalTabTextStyle: TextStyle = {
        ...tabTextStyleBase,
        color: isDisabled ? colors?.textDisabled || '#CCC' : isActive ? finalActiveColor : finalInactiveColor,
        ...textStyle,
        ...(isActive && activeTextStyle),
      };

      const finalIndicatorStyle: ViewStyle = {
        ...indicatorStyleBase,
        ...indicatorStyle,
      };

      return (
        <TouchableOpacity
          key={item.key}
          style={finalTabStyle}
          onPress={() => !isDisabled && handleTabChange(item.key)}
          disabled={isDisabled}
          activeOpacity={0.7}
        >
          <Text
            style={finalTabTextStyle}
            numberOfLines={1}
          >
            {item.title}
          </Text>
          {isActive && (
            <View style={finalIndicatorStyle} />
          )}
        </TouchableOpacity>
      );
    };

    if (scrollable) {
      return (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={[scrollableTabBarStyleBase, tabBarStyle]}
          contentContainerStyle={[scrollableTabBarContentStyleBase]}
        >
          {items.map(renderTab)}
        </ScrollView>
      );
    }

    return (
      <View style={[themeAwareTabBarStyle, tabBarStyle]}>
        {items.map(renderTab)}
      </View>
    );
  };

  const renderContent = () => {
    const activeItem = items.find(item => item.key === activeKey);
    
    return (
      <View style={[contentStyleBase, contentStyle]}>
        {activeItem?.content}
      </View>
    );
  };

  return (
    <View style={[containerStyle, style]}>
      {renderTabBar()}
      {renderContent()}
    </View>
  );
};

export default Tabs;
