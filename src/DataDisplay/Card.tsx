import React from 'react';
import { 
  View, 
  ViewStyle, 
  TextStyle, 
  TouchableOpacity, 
  Text,
  StyleSheet 
} from 'react-native';
import { useTheme, useIsThemeProvided } from '../themes';

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
  const { colors, components, spacing, shadows } = useTheme();
  const isThemeProvided = useIsThemeProvided();

  const getCardStyles = () => {
    if (!isThemeProvided) {
      // Fallback styles
      return {
        card: {
          backgroundColor: '#ffffff',
          borderRadius: 8,
          overflow: 'hidden' as const,
          borderWidth: bordered ? 1 : 0,
          borderColor: '#e8e8e8',
        },
        smallCard: { borderRadius: 4 },
        disabled: { opacity: 0.6 },
        header: {
          flexDirection: 'row' as const,
          alignItems: 'center' as const,
          justifyContent: 'space-between' as const,
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderBottomWidth: 1,
          borderBottomColor: '#e8e8e8',
        },
        smallHeader: { paddingHorizontal: 12, paddingVertical: 8 },
        title: { fontSize: 16, fontWeight: '600' as const, color: '#333333', flex: 1 },
        smallTitle: { fontSize: 14, fontWeight: '500' as const },
        extra: { marginLeft: 12 },
        body: { padding: 16 },
        smallBody: { padding: 12 },
        loadingContainer: { alignItems: 'center' as const, justifyContent: 'center' as const, paddingVertical: 24 },
        loadingText: { fontSize: 14, color: '#999999' },
      };
    }

    // Theme-aware styles
    return {
      card: {
        backgroundColor: colors.card,
        borderRadius: components.card.borderRadius,
        overflow: 'hidden' as const,
        borderWidth: bordered ? 1 : 0,
        borderColor: colors.border,
        ...shadows.sm,
      },
      smallCard: { borderRadius: 4 },
      disabled: { opacity: 0.6 },
      header: {
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        justifyContent: 'space-between' as const,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: colors.divider,
      },
      smallHeader: { 
        paddingHorizontal: spacing.sm, 
        paddingVertical: spacing.xs 
      },
      title: { 
        fontSize: 16, 
        fontWeight: '600' as const, 
        color: colors.text, 
        flex: 1 
      },
      smallTitle: { 
        fontSize: 14, 
        fontWeight: '500' as const 
      },
      extra: { marginLeft: spacing.sm },
      body: { padding: components.card.padding },
      smallBody: { padding: spacing.sm },
      loadingContainer: { 
        alignItems: 'center' as const, 
        justifyContent: 'center' as const, 
        paddingVertical: spacing.xl 
      },
      loadingText: { 
        fontSize: 14, 
        color: colors.textSecondary 
      },
    };
  };

  const styles = getCardStyles();
  const cardStyles: ViewStyle[] = [
    styles.card,
    ...(size === 'small' ? [styles.smallCard] : []),
    ...(disabled ? [styles.disabled] : []),
    ...(style ? [style] : []),
  ];

  const headerStyles: ViewStyle[] = [
    styles.header,
    ...(size === 'small' ? [styles.smallHeader] : []),
    ...(headerStyle ? [headerStyle] : []),
  ];

  const bodyStyles: ViewStyle[] = [
    styles.body,
    ...(size === 'small' ? [styles.smallBody] : []),
    ...(bodyStyle ? [bodyStyle] : []),
  ];

  const titleStyles: TextStyle[] = [
    styles.title,
    ...(size === 'small' ? [styles.smallTitle] : []),
    ...(titleStyle ? [titleStyle] : []),
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

export default Card;
