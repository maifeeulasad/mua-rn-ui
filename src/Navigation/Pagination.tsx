import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';

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
  activeColor = '#007AFF',
  inactiveColor = '#F0F0F0',
  textColor = '#333',
  disabledColor = '#CCC',
}) => {
  const totalPages = Math.ceil(total / pageSize);

  const handlePageChange = (page: number) => {
    if (disabled || page < 1 || page > totalPages || page === current) {
      return;
    }
    onChange(page);
  };

  const renderSimplePagination = () => (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: current === 1 || disabled ? disabledColor : inactiveColor },
        ]}
        onPress={() => handlePageChange(current - 1)}
        disabled={current === 1 || disabled}
      >
        <Text style={[styles.buttonText, { color: textColor }]}>‹</Text>
      </TouchableOpacity>

      <View style={styles.pageInfo}>
        <Text style={[styles.pageText, { color: textColor }]}>
          {current} / {totalPages}
        </Text>
      </View>

      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: current === totalPages || disabled ? disabledColor : inactiveColor },
        ]}
        onPress={() => handlePageChange(current + 1)}
        disabled={current === totalPages || disabled}
      >
        <Text style={[styles.buttonText, { color: textColor }]}>›</Text>
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
            styles.pageButton,
            {
              backgroundColor: i === current ? activeColor : inactiveColor,
            },
            disabled && { backgroundColor: disabledColor },
          ]}
          onPress={() => handlePageChange(i)}
          disabled={disabled}
        >
          <Text
            style={[
              styles.pageButtonText,
              {
                color: i === current ? '#fff' : textColor,
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
    <View style={[styles.container, style]}>
      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: current === 1 || disabled ? disabledColor : inactiveColor },
        ]}
        onPress={() => handlePageChange(current - 1)}
        disabled={current === 1 || disabled}
      >
        <Text style={[styles.buttonText, { color: textColor }]}>‹</Text>
      </TouchableOpacity>

      {renderPageNumbers()}

      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: current === totalPages || disabled ? disabledColor : inactiveColor },
        ]}
        onPress={() => handlePageChange(current + 1)}
        disabled={current === totalPages || disabled}
      >
        <Text style={[styles.buttonText, { color: textColor }]}>›</Text>
      </TouchableOpacity>
    </View>
  );

  if (totalPages <= 1) {
    return null;
  }

  return simple ? renderSimplePagination() : renderFullPagination();
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  button: {
    width: 36,
    height: 36,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 2,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  pageButton: {
    width: 36,
    height: 36,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 2,
  },
  pageButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  pageInfo: {
    paddingHorizontal: 12,
  },
  pageText: {
    fontSize: 14,
    fontWeight: '500',
  },
});

export default Pagination;
