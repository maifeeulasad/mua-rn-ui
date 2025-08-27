import React from 'react';
import { 
  View, 
  ViewStyle, 
  TouchableOpacity, 
  Text, 
  TextStyle,
  StyleSheet 
} from 'react-native';

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
  const itemStyles: ViewStyle[] = [
    styles.gridItem,
    ...(itemStyle ? [itemStyle] : []),
    ...(itemHeight ? [{ height: itemHeight }] : []),
    ...(disabled ? [styles.disabledItem] : []),
    ...(style ? [style] : []),
  ];

  const content = (
    <View style={itemStyles} testID={testID}>
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      {text && (
        <Text style={[styles.itemText, textStyle]} numberOfLines={2}>
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
        style={styles.touchableItem}
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
      borderColor: '#e8e8e8',
      marginLeft: isFirstColumn ? 0 : 0,
    };
  };

  const renderRows = () => {
    const rows: React.ReactNode[] = [];
    
    for (let i = 0; i < data.length; i += columns) {
      const rowItems = data.slice(i, i + columns);
      
      rows.push(
        <View key={i} style={styles.row}>
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
    <View style={[styles.container, style]} testID={testID}>
      {renderRows()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
  },
  row: {
    flexDirection: 'row',
  },
  touchableItem: {
    flex: 1,
  },
  gridItem: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 8,
    backgroundColor: '#ffffff',
  },
  disabledItem: {
    opacity: 0.5,
  },
  iconContainer: {
    marginBottom: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemText: {
    fontSize: 12,
    color: '#333333',
    textAlign: 'center',
    lineHeight: 16,
  },
});

export default Grid;
