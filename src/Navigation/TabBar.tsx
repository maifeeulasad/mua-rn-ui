import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';

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
  backgroundColor = '#fff',
  activeColor = '#007AFF',
  inactiveColor = '#666',
  showBadge = true,
  badgeColor = '#FF3B30',
  badgeTextColor = '#fff',
}) => {
  const renderBadge = (badge?: string | number) => {
    if (!showBadge || !badge) return null;

    return (
      <View style={[styles.badge, { backgroundColor: badgeColor }]}>
        <Text style={[styles.badgeText, { color: badgeTextColor }]}>
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
          styles.tab,
          { backgroundColor },
          tabStyle,
          isActive && activeTabStyle,
        ]}
        onPress={() => !isDisabled && onChange(item.key)}
        disabled={isDisabled}
        activeOpacity={0.7}
      >
        <View style={styles.tabContent}>
          {item.icon && (
            <View style={styles.iconContainer}>
              {item.icon}
              {renderBadge(item.badge)}
            </View>
          )}
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
          {!item.icon && renderBadge(item.badge)}
        </View>
        {isActive && (
          <View
            style={[
              styles.activeIndicator,
              { backgroundColor: activeColor },
            ]}
          />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor }, style]}>
      {items.map(renderTab)}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E0E0E0',
    paddingHorizontal: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  iconContainer: {
    marginBottom: 4,
    position: 'relative',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -6,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default TabBar;
