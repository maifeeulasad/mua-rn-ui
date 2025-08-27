import React from 'react';
import { 
  View, 
  ViewStyle, 
  TouchableOpacity, 
  Text, 
  TextStyle,
  StyleSheet 
} from 'react-native';
import { useTheme, useColors } from '../themes';

export interface GridItemProps {
  text?: string;
  icon?: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
  testID?: string;
}

export interface GridProps {
  data: GridItemProps[];
  columns?: number;
  gap?: number;
  itemStyle?: ViewStyle;
  style?: ViewStyle;
  hasLine?: boolean;
  itemHeight?: number;
  renderItem?: (item: GridItemProps, index: number) => React.ReactNode;
  testID?: string;
}

const GridItem: React.FC<GridItemProps & { itemStyle?: ViewStyle; itemHeight?: number }> = ({
  text,
  icon,
  onPress,
  style,
  textStyle,
  disabled = false,
  testID,
  itemStyle,
  itemHeight,
}) => {
  const theme = useTheme();
  const colors = useColors();

  // Theme-aware styles
  const gridItemStyleThemed: ViewStyle = {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xs,
    backgroundColor: colors.background,
  };

  const disabledItemStyleThemed: ViewStyle = {
    opacity: 0.5,
  };

  const iconContainerStyleThemed: ViewStyle = {
    marginBottom: theme.spacing.xs,
    alignItems: 'center',
    justifyContent: 'center',
  };

  const itemTextStyleThemed: TextStyle = {
    fontSize: theme.typography.fontSize.xs,
    color: colors.text,
    textAlign: 'center',
    lineHeight: theme.typography.lineHeight.xs,
  };

  const touchableItemStyleThemed: ViewStyle = {
    flex: 1,
  };

  const itemStyles: ViewStyle[] = [
    gridItemStyleThemed,
    ...(itemStyle ? [itemStyle] : []),
    ...(itemHeight ? [{ height: itemHeight }] : []),
    ...(disabled ? [disabledItemStyleThemed] : []),
    ...(style ? [style] : []),
  ];

  const content = (
    <View style={itemStyles} testID={testID}>
      {icon && <View style={iconContainerStyleThemed}>{icon}</View>}
      {text && (
        <Text style={[itemTextStyleThemed, textStyle]} numberOfLines={2}>
          {text}
        </Text>
      )}
    </View>
  );

  if (onPress && !disabled) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.7}
        disabled={disabled}
        style={touchableItemStyleThemed}
      >
        {content}
      </TouchableOpacity>
    );
  }

  return content;
};

const Grid: React.FC<GridProps> = ({
  data,
  columns = 3,
  gap = 0,
  itemStyle,
  style,
  hasLine = true,
  itemHeight,
  renderItem,
  testID,
}) => {
  const theme = useTheme();
  const colors = useColors();

  // Theme-aware styles
  const containerStyleThemed: ViewStyle = {
    backgroundColor: colors.background,
  };

  const rowStyleThemed: ViewStyle = {
    flexDirection: 'row',
  };
  const renderGridItem = (item: GridItemProps, index: number) => {
    if (renderItem) {
      return renderItem(item, index);
    }

    return (
      <GridItem
        key={index}
        {...item}
        itemStyle={itemStyle}
        itemHeight={itemHeight}
      />
    );
  };

  const getItemStyle = (index: number): ViewStyle => {
    const isLastRow = Math.floor(index / columns) === Math.floor((data.length - 1) / columns);
    const isLastColumn = (index % columns) === (columns - 1);
    const isFirstColumn = (index % columns) === 0;

    return {
      flex: 1,
      marginRight: isLastColumn ? 0 : gap,
      borderRightWidth: hasLine && !isLastColumn ? StyleSheet.hairlineWidth : 0,
      borderBottomWidth: hasLine && !isLastRow ? StyleSheet.hairlineWidth : 0,
      borderColor: colors.divider,
      marginLeft: isFirstColumn ? 0 : 0,
    };
  };

  const renderRows = () => {
    const rows: React.ReactNode[] = [];
    
    for (let i = 0; i < data.length; i += columns) {
      const rowItems = data.slice(i, i + columns);
      
      rows.push(
        <View key={i} style={rowStyleThemed}>
          {rowItems.map((item, itemIndex) => {
            const globalIndex = i + itemIndex;
            return (
              <View key={globalIndex} style={getItemStyle(globalIndex)}>
                {renderGridItem(item, globalIndex)}
              </View>
            );
          })}
          {/* Fill remaining columns with empty views */}
          {rowItems.length < columns &&
            Array.from({ length: columns - rowItems.length }).map((_, emptyIndex) => (
              <View
                key={`empty-${i}-${emptyIndex}`}
                style={getItemStyle(i + rowItems.length + emptyIndex)}
              />
            ))}
        </View>
      );
    }
    
    return rows;
  };

  return (
    <View style={[containerStyleThemed, style]} testID={testID}>
      {renderRows()}
    </View>
  );
};

export default Grid;
