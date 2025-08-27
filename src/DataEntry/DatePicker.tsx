import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import DatePickerView from './DatePickerView';

type DatePickerMode = 'date' | 'time' | 'datetime';

interface DatePickerProps {
  value?: Date;
  mode?: DatePickerMode;
  placeholder?: string;
  format?: string;
  onChange: (date: Date) => void;
  onCancel?: () => void;
  minimumDate?: Date;
  maximumDate?: Date;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  placeholderStyle?: TextStyle;
  modalStyle?: ViewStyle;
  confirmText?: string;
  cancelText?: string;
}

const DatePicker: React.FC<DatePickerProps> = ({
  value,
  mode = 'date',
  placeholder = 'Select date',
  format,
  onChange,
  onCancel,
  minimumDate,
  maximumDate,
  disabled = false,
  style,
  textStyle,
  placeholderStyle,
  modalStyle,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [tempDate, setTempDate] = useState(value || new Date());

  const formatDate = (date: Date): string => {
    if (format) {
      // Simple format implementation
      return format
        .replace('YYYY', date.getFullYear().toString())
        .replace('MM', (date.getMonth() + 1).toString().padStart(2, '0'))
        .replace('DD', date.getDate().toString().padStart(2, '0'))
        .replace('HH', date.getHours().toString().padStart(2, '0'))
        .replace('mm', date.getMinutes().toString().padStart(2, '0'));
    }

    switch (mode) {
      case 'date':
        return date.toLocaleDateString();
      case 'time':
        return date.toLocaleTimeString();
      case 'datetime':
        return date.toLocaleString();
      default:
        return date.toLocaleDateString();
    }
  };

  const handleOpen = () => {
    if (!disabled) {
      setIsVisible(true);
      setTempDate(value || new Date());
    }
  };

  const handleConfirm = () => {
    onChange(tempDate);
    setIsVisible(false);
  };

  const handleCancel = () => {
    setIsVisible(false);
    onCancel?.();
  };

  const handleDateChange = (date: Date) => {
    setTempDate(date);
  };

  return (
    <>
      <TouchableOpacity
        style={[styles.container, style]}
        onPress={handleOpen}
        disabled={disabled}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.text,
            value ? textStyle : [styles.placeholder, placeholderStyle],
            disabled && styles.disabled,
          ]}
        >
          {value ? formatDate(value) : placeholder}
        </Text>
        <Text style={[styles.arrow, disabled && styles.disabled]}>▼</Text>
      </TouchableOpacity>

      <Modal
        visible={isVisible}
        transparent
        animationType="slide"
        onRequestClose={handleCancel}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, modalStyle]}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={handleCancel}>
                <Text style={styles.cancelButton}>{cancelText}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleConfirm}>
                <Text style={styles.confirmButton}>{confirmText}</Text>
              </TouchableOpacity>
            </View>
            
            <DatePickerView
              value={tempDate}
              mode={mode}
              onChange={handleDateChange}
              minimumDate={minimumDate}
              maximumDate={maximumDate}
            />
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#D1D1D6',
    borderRadius: 8,
    backgroundColor: '#fff',
    minHeight: 48,
  },
  text: {
    fontSize: 16,
    color: '#000',
    flex: 1,
  },
  placeholder: {
    color: '#999',
  },
  disabled: {
    color: '#C7C7CC',
  },
  arrow: {
    fontSize: 12,
    color: '#666',
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E0E0E0',
  },
  cancelButton: {
    fontSize: 16,
    color: '#666',
  },
  confirmButton: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
});

export default DatePicker;
