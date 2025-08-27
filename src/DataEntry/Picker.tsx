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
          styles.item,
          itemStyle,
          isSelected && [styles.selectedItem, selectedItemStyle],
          isDisabled && styles.disabledItem,
        ]}
        onPress={() => handleItemPress(item, index)}
        disabled={isDisabled}
      >
        <Text
          style={[
            styles.itemText,
            itemTextStyle,
            isSelected && [styles.selectedItemText, selectedItemTextStyle],
            isDisabled && styles.disabledItemText,
          ]}
        >
          {item.label}
        </Text>
        {isSelected && (
          <Text style={styles.checkmark}>✓</Text>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <>
      <TouchableOpacity
        style={[
          styles.container,
          { opacity: disabled ? 0.6 : 1 },
          style,
        ]}
        onPress={handleOpen}
        disabled={disabled}
      >
        <Text
          style={[
            styles.text,
            selectedItem ? textStyle : [styles.placeholder, placeholderStyle],
          ]}
        >
          {selectedItem ? selectedItem.label : placeholder}
        </Text>
        <Text style={styles.arrow}>▼</Text>
      </TouchableOpacity>

      <Modal
        visible={isVisible}
        transparent
        animationType="slide"
        onRequestClose={showConfirmCancel ? handleCancel : () => setIsVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, modalStyle]}>
            {showConfirmCancel && (
              <View style={styles.modalHeader}>
                <TouchableOpacity onPress={handleCancel}>
                  <Text style={styles.cancelButton}>{cancelText}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleConfirm}>
                  <Text style={styles.confirmButton}>{confirmText}</Text>
                </TouchableOpacity>
              </View>
            )}
            
            <ScrollView style={styles.itemsContainer}>
              {items.map(renderItem)}
            </ScrollView>
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
    maxHeight: '70%',
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
  itemsContainer: {
    maxHeight: 300,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E0E0E0',
  },
  selectedItem: {
    backgroundColor: '#F0F8FF',
  },
  disabledItem: {
    opacity: 0.5,
  },
  itemText: {
    fontSize: 16,
    color: '#000',
    flex: 1,
  },
  selectedItemText: {
    color: '#007AFF',
    fontWeight: '500',
  },
  disabledItemText: {
    color: '#999',
  },
  checkmark: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: 'bold',
  },
});

export default Picker;
