import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView,
  ViewStyle, 
  TextStyle,
  StyleSheet 
} from 'react-native';

export interface ListItemProps {
  title: string;
  description?: string;
  extra?: React.ReactNode;
  thumb?: React.ReactNode;
  arrow?: 'horizontal' | 'down' | 'up' | 'empty' | false;
  onPress?: () => void;
  disabled?: boolean;
  style?: ViewStyle;
  titleStyle?: TextStyle;
  descriptionStyle?: TextStyle;
  testID?: string;
}

export interface ListProps {
  children?: React.ReactNode;
  header?: string | React.ReactNode;
  footer?: string | React.ReactNode;
  bordered?: boolean;
  split?: boolean;
  style?: ViewStyle;
  headerStyle?: ViewStyle;
  footerStyle?: ViewStyle;
  contentStyle?: ViewStyle;
  scrollable?: boolean;
  testID?: string;
}

const ListItem: React.FC<ListItemProps> = ({
  title,
  description,
  extra,
  thumb,
  arrow = 'horizontal',
  onPress,
  disabled = false,
  style,
  titleStyle,
  descriptionStyle,
  testID,
}) => {
  const itemStyles: ViewStyle[] = [
    styles.listItem,
    ...(disabled ? [styles.disabledItem] : []),
    ...(style ? [style] : []),
  ];

  const renderArrow = () => {
    if (arrow === false || arrow === 'empty') return null;
    
    const arrowMap = {
      horizontal: '→',
      down: '↓',
      up: '↑',
    };
    
    return (
      <Text style={styles.arrow}>
        {arrowMap[arrow] || '→'}
      </Text>
    );
  };

  const content = (
    <View style={itemStyles} testID={testID}>
      {thumb && <View style={styles.thumb}>{thumb}</View>}
      
      <View style={styles.content}>
        <Text style={[styles.title, titleStyle]} numberOfLines={1}>
          {title}
        </Text>
        {description && (
          <Text style={[styles.description, descriptionStyle]} numberOfLines={2}>
            {description}
          </Text>
        )}
      </View>
      
      {extra && <View style={styles.extra}>{extra}</View>}
      {renderArrow()}
    </View>
  );

  if (onPress && !disabled) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.7}
        disabled={disabled}
      >
        {content}
      </TouchableOpacity>
    );
  }

  return content;
};

const List: React.FC<ListProps> = ({
  children,
  header,
  footer,
  bordered = true,
  split = true,
  style,
  headerStyle,
  footerStyle,
  contentStyle,
  scrollable = false,
  testID,
}) => {
  const containerStyles: ViewStyle[] = [
    styles.container,
    ...(bordered ? [styles.bordered] : []),
    ...(style ? [style] : []),
  ];

  const renderHeader = () => {
    if (!header) return null;
    
    if (typeof header === 'string') {
      return (
        <View style={[styles.header, headerStyle]}>
          <Text style={styles.headerText}>{header}</Text>
        </View>
      );
    }
    
    return <View style={[styles.header, headerStyle]}>{header}</View>;
  };

  const renderFooter = () => {
    if (!footer) return null;
    
    if (typeof footer === 'string') {
      return (
        <View style={[styles.footer, footerStyle]}>
          <Text style={styles.footerText}>{footer}</Text>
        </View>
      );
    }
    
    return <View style={[styles.footer, footerStyle]}>{footer}</View>;
  };

  const renderContent = () => {
    const contentContainerStyle = [
      styles.listContent,
      contentStyle,
    ];

    const processedChildren = React.Children.map(children, (child, index) => {
      if (!React.isValidElement(child)) return child;
      
      const isLastItem = index === React.Children.count(children) - 1;
      const itemStyle = [
        child.props.style,
        split && !isLastItem && styles.splitItem,
      ];
      
      return React.cloneElement(child, {
        ...child.props,
        style: itemStyle,
      });
    });

    if (scrollable) {
      return (
        <ScrollView style={contentContainerStyle} showsVerticalScrollIndicator={false}>
          {processedChildren}
        </ScrollView>
      );
    }

    return (
      <View style={contentContainerStyle}>
        {processedChildren}
      </View>
    );
  };

  return (
    <View style={containerStyles} testID={testID}>
      {renderHeader()}
      {renderContent()}
      {renderFooter()}
    </View>
  );
};

// Export both components
export { ListItem };
export default List;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
  },
  bordered: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e8e8e8',
    overflow: 'hidden',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fafafa',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e8e8e8',
  },
  headerText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
  },
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fafafa',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#e8e8e8',
  },
  footerText: {
    fontSize: 12,
    color: '#666666',
  },
  listContent: {
    backgroundColor: '#ffffff',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
  },
  splitItem: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e8e8e8',
  },
  disabledItem: {
    opacity: 0.5,
  },
  thumb: {
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '400',
    color: '#333333',
    lineHeight: 22,
  },
  description: {
    fontSize: 12,
    color: '#666666',
    marginTop: 2,
    lineHeight: 18,
  },
  extra: {
    marginLeft: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrow: {
    fontSize: 16,
    color: '#cccccc',
    marginLeft: 8,
  },
});
