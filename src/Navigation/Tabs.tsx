import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ViewStyle,
  TextStyle,
  Dimensions,
} from 'react-native';

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
  backgroundColor = '#fff',
  activeColor = '#007AFF',
  inactiveColor = '#666',
  scrollable = false,
  animated = true,
}) => {
  const [internalActiveKey, setInternalActiveKey] = useState(
    defaultActiveKey || items[0]?.key
  );

  const activeKey = controlledActiveKey !== undefined ? controlledActiveKey : internalActiveKey;

  const handleTabChange = (key: string) => {
    if (controlledActiveKey === undefined) {
      setInternalActiveKey(key);
    }
    onChange?.(key);
  };

  const renderTabBar = () => {
    const tabWidth = scrollable ? 'auto' : screenWidth / items.length;

    const renderTab = (item: TabItem, index: number) => {
      const isActive = item.key === activeKey;
      const isDisabled = item.disabled;

      return (
        <TouchableOpacity
          key={item.key}
          style={[
            styles.tab,
            !scrollable && { width: tabWidth },
            tabStyle,
            isActive && activeTabStyle,
          ]}
          onPress={() => !isDisabled && handleTabChange(item.key)}
          disabled={isDisabled}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.tabText,
              { color: isDisabled ? '#CCC' : isActive ? activeColor : inactiveColor },
              textStyle,
              isActive && activeTextStyle,
            ]}
            numberOfLines={1}
          >
            {item.title}
          </Text>
          {isActive && (
            <View
              style={[
                styles.indicator,
                { backgroundColor: activeColor },
                indicatorStyle,
              ]}
            />
          )}
        </TouchableOpacity>
      );
    };

    if (scrollable) {
      return (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={[styles.scrollableTabBar, { backgroundColor }, tabBarStyle]}
          contentContainerStyle={styles.scrollableTabBarContent}
        >
          {items.map(renderTab)}
        </ScrollView>
      );
    }

    return (
      <View style={[styles.tabBar, { backgroundColor }, tabBarStyle]}>
        {items.map(renderTab)}
      </View>
    );
  };

  const renderContent = () => {
    const activeItem = items.find(item => item.key === activeKey);
    
    return (
      <View style={[styles.content, contentStyle]}>
        {activeItem?.content}
      </View>
    );
  };

  return (
    <View style={[styles.container, style]}>
      {renderTabBar()}
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E0E0E0',
  },
  scrollableTabBar: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E0E0E0',
    maxHeight: 48,
  },
  scrollableTabBarContent: {
    paddingHorizontal: 16,
  },
  tab: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    minWidth: 80,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  indicator: {
    position: 'absolute',
    bottom: 0,
    left: 16,
    right: 16,
    height: 2,
    borderRadius: 1,
  },
  content: {
    flex: 1,
  },
});

export default Tabs;
