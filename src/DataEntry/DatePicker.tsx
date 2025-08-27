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
import { useTheme, useColors } from '../themes';

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
  const theme = useTheme();
  const colors = useColors();
  
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

  // Define theme-aware styles
  const inputContainerStyle: ViewStyle = {
    borderWidth: 1,
    borderColor: colors?.border || '#E0E0E0',
    borderRadius: theme?.borderRadius?.md || 8,
    paddingHorizontal: theme?.spacing?.md || 12,
    paddingVertical: theme?.spacing?.md || 12,
    backgroundColor: colors?.surface || '#FFFFFF',
    minHeight: theme?.components?.input?.minHeight || 48,
  };

  const inputTextStyle: TextStyle = {
    fontSize: theme?.typography?.fontSize?.md || 16,
    color: colors?.text || '#000000',
  };

  const placeholderTextStyle: TextStyle = {
    fontSize: theme?.typography?.fontSize?.md || 16,
    color: colors?.textSecondary || '#999999',
  };

  const modalContainerStyle: ViewStyle = {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  };

  const modalContentStyle: ViewStyle = {
    backgroundColor: colors?.background || '#FFFFFF',
    borderRadius: theme?.borderRadius?.lg || 12,
    padding: theme?.spacing?.lg || 20,
    margin: theme?.spacing?.lg || 20,
    maxWidth: '90%',
    width: '100%',
  };

  const buttonContainerStyle: ViewStyle = {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme?.spacing?.lg || 20,
  };

  const buttonStyle: ViewStyle = {
    flex: 1,
    paddingVertical: theme?.spacing?.md || 12,
    paddingHorizontal: theme?.spacing?.lg || 16,
    borderRadius: theme?.borderRadius?.md || 8,
    alignItems: 'center',
    marginHorizontal: theme?.spacing?.xs || 4,
  };

  const cancelButtonStyle: ViewStyle = {
    ...buttonStyle,
    backgroundColor: colors?.border || '#E0E0E0',
  };

  const confirmButtonStyle: ViewStyle = {
    ...buttonStyle,
    backgroundColor: colors?.primary || '#007AFF',
  };

  const cancelButtonTextStyle: TextStyle = {
    fontSize: theme?.typography?.fontSize?.md || 16,
    color: colors?.text || '#000000',
    fontWeight: theme?.typography?.fontWeight?.medium || '500',
  };

  const confirmButtonTextStyle: TextStyle = {
    fontSize: theme?.typography?.fontSize?.md || 16,
    color: colors?.surface || '#FFFFFF',
    fontWeight: theme?.typography?.fontWeight?.medium || '500',
  };

  return (
    <>
      <TouchableOpacity
        style={[inputContainerStyle, { opacity: disabled ? 0.6 : 1 }, style]}
        onPress={handleOpen}
        disabled={disabled}
        activeOpacity={0.7}
      >
        <Text
          style={[
            value ? [inputTextStyle, textStyle] : [placeholderTextStyle, placeholderStyle],
          ]}
        >
          {value ? formatDate(value) : placeholder}
        </Text>
        <Text style={[{ fontSize: 12, color: colors?.textSecondary || '#999' }]}>▼</Text>
      </TouchableOpacity>

      <Modal
        visible={isVisible}
        transparent
        animationType="slide"
        onRequestClose={handleCancel}
      >
        <View style={modalContainerStyle}>
          <View style={[modalContentStyle, modalStyle]}>
            <View style={buttonContainerStyle}>
              <TouchableOpacity style={cancelButtonStyle} onPress={handleCancel}>
                <Text style={cancelButtonTextStyle}>{cancelText}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={confirmButtonStyle} onPress={handleConfirm}>
                <Text style={confirmButtonTextStyle}>{confirmText}</Text>
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

export default DatePicker;
