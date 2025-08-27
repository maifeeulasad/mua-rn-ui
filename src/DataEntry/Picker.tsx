import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useTheme, useColors } from '../themes';

export interface PickerItem {
  label: string;
  value: any;
  disabled?: boolean;
}

interface PickerProps {
  items: PickerItem[];
  selectedValue?: any;
  onValueChange: (value: any, index: number) => void;
  placeholder?: string;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  placeholderStyle?: TextStyle;
  modalStyle?: ViewStyle;
  itemStyle?: ViewStyle;
  selectedItemStyle?: ViewStyle;
  itemTextStyle?: TextStyle;
  selectedItemTextStyle?: TextStyle;
  confirmText?: string;
  cancelText?: string;
  showConfirmCancel?: boolean;
}

const Picker: React.FC<PickerProps> = ({
  items,
  selectedValue,
  onValueChange,
  placeholder = 'Select an option',
  disabled = false,
  style,
  textStyle,
  placeholderStyle,
  modalStyle,
  itemStyle,
  selectedItemStyle,
  itemTextStyle,
  selectedItemTextStyle,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  showConfirmCancel = true,
}) => {
  const theme = useTheme();
  const colors = useColors();
  
  const [isVisible, setIsVisible] = useState(false);
  const [tempSelectedValue, setTempSelectedValue] = useState(selectedValue);

  const selectedItem = items.find(item => item.value === selectedValue);

  const handleOpen = () => {
    if (!disabled) {
      setTempSelectedValue(selectedValue);
      setIsVisible(true);
    }
  };

  const handleItemPress = (item: PickerItem, index: number) => {
    if (item.disabled) return;

    if (showConfirmCancel) {
      setTempSelectedValue(item.value);
    } else {
      onValueChange(item.value, index);
      setIsVisible(false);
    }
  };

  const handleConfirm = () => {
    const index = items.findIndex(item => item.value === tempSelectedValue);
    if (index !== -1) {
      onValueChange(tempSelectedValue, index);
    }
    setIsVisible(false);
  };

  const handleCancel = () => {
    setTempSelectedValue(selectedValue);
    setIsVisible(false);
  };

  const renderItem = (item: PickerItem, index: number) => {
    const isSelected = showConfirmCancel 
      ? item.value === tempSelectedValue 
      : item.value === selectedValue;
    const isDisabled = item.disabled;

    return (
      <TouchableOpacity
        key={index}
        style={[
          itemStyleThemed,
          itemStyle,
          isSelected && [selectedItemStyleThemed, selectedItemStyle],
          isDisabled && disabledItemStyleThemed,
        ]}
        onPress={() => handleItemPress(item, index)}
        disabled={isDisabled}
      >
        <Text
          style={[
            itemTextStyleThemed,
            itemTextStyle,
            isSelected && [selectedItemTextStyleThemed, selectedItemTextStyle],
            isDisabled && disabledItemTextStyleThemed,
          ]}
        >
          {item.label}
        </Text>
        {isSelected && (
          <Text style={checkmarkStyleThemed}>✓</Text>
        )}
      </TouchableOpacity>
    );
  };

  // Theme-aware styles
  const containerStyleThemed: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.sm,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: theme.borderRadius.md,
    backgroundColor: colors.inputBackground,
    minHeight: 48,
    opacity: disabled ? 0.6 : 1,
    ...style,
  };

  const textStyleThemed: TextStyle = {
    fontSize: theme.typography.fontSize.md,
    color: colors.text,
    flex: 1,
    ...textStyle,
  };

  const placeholderStyleThemed: TextStyle = {
    color: colors.inputPlaceholder,
    ...placeholderStyle,
  };

  const arrowStyleThemed: TextStyle = {
    fontSize: theme.typography.fontSize.sm,
    color: colors.textSecondary,
    marginLeft: theme.spacing.xs,
  };

  const modalOverlayStyleThemed: ViewStyle = {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'flex-end',
  };

  const modalContentStyleThemed: ViewStyle = {
    backgroundColor: colors.surface,
    borderTopLeftRadius: theme.borderRadius.lg,
    borderTopRightRadius: theme.borderRadius.lg,
    maxHeight: '70%',
    ...modalStyle,
  };

  const modalHeaderStyleThemed: ViewStyle = {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.divider,
  };

  const cancelButtonStyleThemed: TextStyle = {
    fontSize: theme.typography.fontSize.md,
    color: colors.textSecondary,
  };

  const confirmButtonStyleThemed: TextStyle = {
    fontSize: theme.typography.fontSize.md,
    color: colors.primary,
    fontWeight: theme.typography.fontWeight.semibold,
  };

  const itemsContainerStyleThemed: ViewStyle = {
    maxHeight: 300,
  };

  const itemStyleThemed: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.divider,
  };

  const selectedItemStyleThemed: ViewStyle = {
    backgroundColor: colors.primaryLight + '20', // Add transparency
  };

  const disabledItemStyleThemed: ViewStyle = {
    opacity: 0.5,
  };

  const itemTextStyleThemed: TextStyle = {
    fontSize: theme.typography.fontSize.md,
    color: colors.text,
    flex: 1,
  };

  const selectedItemTextStyleThemed: TextStyle = {
    color: colors.primary,
    fontWeight: theme.typography.fontWeight.medium,
  };

  const disabledItemTextStyleThemed: TextStyle = {
    color: colors.textDisabled,
  };

  const checkmarkStyleThemed: TextStyle = {
    fontSize: theme.typography.fontSize.md,
    color: colors.primary,
    fontWeight: theme.typography.fontWeight.bold,
  };

  return (
    <>
      <TouchableOpacity
        style={containerStyleThemed}
        onPress={handleOpen}
        disabled={disabled}
      >
        <Text
          style={[
            textStyleThemed,
            selectedItem ? {} : placeholderStyleThemed,
          ]}
        >
          {selectedItem ? selectedItem.label : placeholder}
        </Text>
        <Text style={arrowStyleThemed}>▼</Text>
      </TouchableOpacity>

      <Modal
        visible={isVisible}
        transparent
        animationType="slide"
        onRequestClose={showConfirmCancel ? handleCancel : () => setIsVisible(false)}
      >
        <View style={modalOverlayStyleThemed}>
          <View style={modalContentStyleThemed}>
            {showConfirmCancel && (
              <View style={modalHeaderStyleThemed}>
                <TouchableOpacity onPress={handleCancel}>
                  <Text style={cancelButtonStyleThemed}>{cancelText}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleConfirm}>
                  <Text style={confirmButtonStyleThemed}>{confirmText}</Text>
                </TouchableOpacity>
              </View>
            )}
            
            <ScrollView style={itemsContainerStyleThemed}>
              {items.map(renderItem)}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default Picker;
