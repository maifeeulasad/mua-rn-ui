import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useTheme, useColors } from '../themes';

interface PaginationProps {
  current: number;
  total: number;
  pageSize?: number;
  onChange: (page: number) => void;
  showQuickJumper?: boolean;
  showSizeChanger?: boolean;
  simple?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  activeColor?: string;
  inactiveColor?: string;
  textColor?: string;
  disabledColor?: string;
}

const Pagination: React.FC<PaginationProps> = ({
  current = 1,
  total,
  pageSize = 10,
  onChange,
  simple = false,
  disabled = false,
  style,
  activeColor,
  inactiveColor,
  textColor,
  disabledColor,
}) => {
  const theme = useTheme();
  const colors = useColors();
  
  const totalPages = Math.ceil(total / pageSize);

  // Use theme colors with fallbacks
  const finalActiveColor = activeColor || colors?.primary || '#007AFF';
  const finalInactiveColor = inactiveColor || colors?.surface || '#F0F0F0';
  const finalTextColor = textColor || colors?.text || '#333';
  const finalDisabledColor = disabledColor || colors?.buttonDisabled || '#CCC';

  const handlePageChange = (page: number) => {
    if (disabled || page < 1 || page > totalPages || page === current) {
      return;
    }
    onChange(page);
  };

  // Define styles using theme values
  const containerStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme?.spacing?.sm || 8,
  };

  const buttonStyle: ViewStyle = {
    width: 36,
    height: 36,
    borderRadius: theme?.borderRadius?.sm || 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 2,
  };

  const buttonTextStyle: TextStyle = {
    fontSize: theme?.typography?.fontSize?.md || 16,
    fontWeight: theme?.typography?.fontWeight?.semibold || '600',
  };

  const pageButtonStyle: ViewStyle = {
    width: 36,
    height: 36,
    borderRadius: theme?.borderRadius?.sm || 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 2,
  };

  const pageButtonTextStyle: TextStyle = {
    fontSize: theme?.typography?.fontSize?.sm || 14,
    fontWeight: theme?.typography?.fontWeight?.medium || '500',
  };

  const pageInfoStyle: ViewStyle = {
    paddingHorizontal: theme?.spacing?.md || 12,
  };

  const pageTextStyle: TextStyle = {
    fontSize: theme?.typography?.fontSize?.sm || 14,
    fontWeight: theme?.typography?.fontWeight?.medium || '500',
  };

  const renderSimplePagination = () => (
    <View style={[containerStyle, style]}>
      <TouchableOpacity
        style={[
          buttonStyle,
          { backgroundColor: current === 1 || disabled ? finalDisabledColor : finalInactiveColor },
        ]}
        onPress={() => handlePageChange(current - 1)}
        disabled={current === 1 || disabled}
      >
        <Text style={[buttonTextStyle, { color: finalTextColor }]}>‹</Text>
      </TouchableOpacity>

      <View style={pageInfoStyle}>
        <Text style={[pageTextStyle, { color: finalTextColor }]}>
          {current} / {totalPages}
        </Text>
      </View>

      <TouchableOpacity
        style={[
          buttonStyle,
          { backgroundColor: current === totalPages || disabled ? finalDisabledColor : finalInactiveColor },
        ]}
        onPress={() => handlePageChange(current + 1)}
        disabled={current === totalPages || disabled}
      >
        <Text style={[buttonTextStyle, { color: finalTextColor }]}>›</Text>
      </TouchableOpacity>
    </View>
  );

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let startPage = Math.max(1, current - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);

    if (endPage - startPage + 1 < maxVisible) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <TouchableOpacity
          key={i}
          style={[
            pageButtonStyle,
            {
              backgroundColor: i === current ? finalActiveColor : finalInactiveColor,
            },
            disabled && { backgroundColor: finalDisabledColor },
          ]}
          onPress={() => handlePageChange(i)}
          disabled={disabled}
        >
          <Text
            style={[
              pageButtonTextStyle,
              {
                color: i === current ? (colors?.buttonText || '#fff') : finalTextColor,
              },
            ]}
          >
            {i}
          </Text>
        </TouchableOpacity>
      );
    }

    return pages;
  };

  const renderFullPagination = () => (
    <View style={[containerStyle, style]}>
      <TouchableOpacity
        style={[
          buttonStyle,
          { backgroundColor: current === 1 || disabled ? finalDisabledColor : finalInactiveColor },
        ]}
        onPress={() => handlePageChange(current - 1)}
        disabled={current === 1 || disabled}
      >
        <Text style={[buttonTextStyle, { color: finalTextColor }]}>‹</Text>
      </TouchableOpacity>

      {renderPageNumbers()}

      <TouchableOpacity
        style={[
          buttonStyle,
          { backgroundColor: current === totalPages || disabled ? finalDisabledColor : finalInactiveColor },
        ]}
        onPress={() => handlePageChange(current + 1)}
        disabled={current === totalPages || disabled}
      >
        <Text style={[buttonTextStyle, { color: finalTextColor }]}>›</Text>
      </TouchableOpacity>
    </View>
  );

  if (totalPages <= 1) {
    return null;
  }

  return simple ? renderSimplePagination() : renderFullPagination();
};

export default Pagination;
