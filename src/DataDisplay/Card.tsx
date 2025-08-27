import React from 'react';
import { 
  View, 
  ViewStyle, 
  TextStyle, 
  TouchableOpacity, 
  Text,
  StyleSheet 
} from 'react-native';

export interface CardProps {
  children?: React.ReactNode;
  title?: string;
  extra?: React.ReactNode;
  headerStyle?: ViewStyle;
  titleStyle?: TextStyle;
  style?: ViewStyle;
  bodyStyle?: ViewStyle;
  bordered?: boolean;
  loading?: boolean;
  size?: 'default' | 'small';
  hoverable?: boolean;
  onPress?: () => void;
  disabled?: boolean;
  testID?: string;
}

const Card: React.FC<CardProps> = ({
  children,
  title,
  extra,
  headerStyle,
  titleStyle,
  style,
  bodyStyle,
  bordered = true,
  loading = false,
  size = 'default',
  hoverable = false,
  onPress,
  disabled = false,
  testID,
}) => {
  const cardStyles = [
    styles.card,
    size === 'small' && styles.smallCard,
    bordered && styles.bordered,
    disabled && styles.disabled,
    style,
  ];

  const headerStyles = [
    styles.header,
    size === 'small' && styles.smallHeader,
    headerStyle,
  ];

  const bodyStyles = [
    styles.body,
    size === 'small' && styles.smallBody,
    bodyStyle,
  ];

  const titleStyles = [
    styles.title,
    size === 'small' && styles.smallTitle,
    titleStyle,
  ];

  const hasHeader = title || extra;

  const renderContent = () => (
    <View style={cardStyles} testID={testID}>
      {hasHeader && (
        <View style={headerStyles}>
          {title && <Text style={titleStyles}>{title}</Text>}
          {extra && <View style={styles.extra}>{extra}</View>}
        </View>
      )}
      <View style={bodyStyles}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading...</Text>
          </View>
        ) : (
          children
        )}
      </View>
    </View>
  );

  if (onPress && !disabled) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={hoverable ? 0.8 : 1}
        disabled={disabled}
      >
        {renderContent()}
      </TouchableOpacity>
    );
  }

  return renderContent();
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    overflow: 'hidden',
  },
  bordered: {
    borderWidth: 1,
    borderColor: '#e8e8e8',
  },
  smallCard: {
    borderRadius: 4,
  },
  disabled: {
    opacity: 0.6,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e8e8e8',
  },
  smallHeader: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    flex: 1,
  },
  smallTitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  extra: {
    marginLeft: 12,
  },
  body: {
    padding: 16,
  },
  smallBody: {
    padding: 12,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
  },
  loadingText: {
    fontSize: 14,
    color: '#999999',
  },
});

export default Card;
