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
import { useTheme, useColors } from '../themes';

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
  const theme = useTheme();
  const colors = useColors();

  // Theme-aware styles
  const listItemStyleThemed: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: colors.background,
  };

  const disabledItemStyleThemed: ViewStyle = {
    opacity: 0.5,
  };

  const thumbStyleThemed: ViewStyle = {
    marginRight: theme.spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  };

  const contentStyleThemed: ViewStyle = {
    flex: 1,
    justifyContent: 'center',
  };

  const titleStyleThemed: TextStyle = {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.normal,
    color: colors.text,
    lineHeight: theme.typography.lineHeight.md,
  };

  const descriptionStyleThemed: TextStyle = {
    fontSize: theme.typography.fontSize.xs,
    color: colors.textSecondary,
    marginTop: 2,
    lineHeight: theme.typography.lineHeight.xs,
  };

  const extraStyleThemed: ViewStyle = {
    marginLeft: theme.spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  };

  const arrowStyleThemed: TextStyle = {
    fontSize: theme.typography.fontSize.md,
    color: colors.textDisabled,
    marginLeft: theme.spacing.xs,
  };

  const itemStyles: ViewStyle[] = [
    listItemStyleThemed,
    ...(disabled ? [disabledItemStyleThemed] : []),
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
      <Text style={arrowStyleThemed}>
        {arrowMap[arrow] || '→'}
      </Text>
    );
  };

  const content = (
    <View style={itemStyles} testID={testID}>
      {thumb && <View style={thumbStyleThemed}>{thumb}</View>}
      
      <View style={contentStyleThemed}>
        <Text style={[titleStyleThemed, titleStyle]} numberOfLines={1}>
          {title}
        </Text>
        {description && (
          <Text style={[descriptionStyleThemed, descriptionStyle]} numberOfLines={2}>
            {description}
          </Text>
        )}
      </View>
      
      {extra && <View style={extraStyleThemed}>{extra}</View>}
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
  const theme = useTheme();
  const colors = useColors();

  // Theme-aware styles
  const containerStyleThemed: ViewStyle = {
    backgroundColor: colors.background,
  };

  const borderedStyleThemed: ViewStyle = {
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  };

  const headerStyleThemed: ViewStyle = {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: colors.surface,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.divider,
  };

  const headerTextStyleThemed: TextStyle = {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
    color: colors.text,
  };

  const footerStyleThemed: ViewStyle = {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: colors.surface,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.divider,
  };

  const footerTextStyleThemed: TextStyle = {
    fontSize: theme.typography.fontSize.xs,
    color: colors.textSecondary,
  };

  const listContentStyleThemed: ViewStyle = {
    backgroundColor: colors.background,
  };

  const containerStyles: ViewStyle[] = [
    containerStyleThemed,
    ...(bordered ? [borderedStyleThemed] : []),
    ...(style ? [style] : []),
  ];

  const renderHeader = () => {
    if (!header) return null;
    
    if (typeof header === 'string') {
      return (
        <View style={[headerStyleThemed, headerStyle]}>
          <Text style={headerTextStyleThemed}>{header}</Text>
        </View>
      );
    }
    
    return <View style={[headerStyleThemed, headerStyle]}>{header}</View>;
  };

  const renderFooter = () => {
    if (!footer) return null;
    
    if (typeof footer === 'string') {
      return (
        <View style={[footerStyleThemed, footerStyle]}>
          <Text style={footerTextStyleThemed}>{footer}</Text>
        </View>
      );
    }
    
    return <View style={[footerStyleThemed, footerStyle]}>{footer}</View>;
  };

  // Add split item style
  const splitItemStyleThemed: ViewStyle = {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.divider,
  };

  const renderContent = () => {
    const contentContainerStyle = [
      listContentStyleThemed,
      contentStyle,
    ];

    const processedChildren = React.Children.map(children, (child, index) => {
      if (!React.isValidElement(child)) return child;
      
      const isLastItem = index === React.Children.count(children) - 1;
      const itemStyle = [
        child.props.style,
        split && !isLastItem && splitItemStyleThemed,
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
