import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  size?: number;
  color?: string;
  backgroundColor?: string;
  borderColor?: string;
  disabledColor?: string;
  style?: ViewStyle;
  labelStyle?: TextStyle;
  checkboxStyle?: ViewStyle;
}

const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onChange,
  label,
  disabled = false,
  size = 20,
  color = '#007AFF',
  backgroundColor = '#fff',
  borderColor = '#D1D1D6',
  disabledColor = '#C7C7CC',
  style,
  labelStyle,
  checkboxStyle,
}) => {
  const handlePress = () => {
    if (!disabled) {
      onChange(!checked);
    }
  };

  const checkboxStyles: ViewStyle = {
    width: size,
    height: size,
    borderWidth: 2,
    borderRadius: 4,
    borderColor: disabled ? disabledColor : checked ? color : borderColor,
    backgroundColor: disabled ? disabledColor : checked ? color : backgroundColor,
    alignItems: 'center',
    justifyContent: 'center',
    ...checkboxStyle,
  };

  const renderCheckmark = () => {
    if (!checked) return null;
    
    return (
      <View style={styles.checkmark}>
        <Text style={[styles.checkmarkText, { fontSize: size * 0.6, color: '#fff' }]}>
          ✓
        </Text>
      </View>
    );
  };

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <View style={checkboxStyles}>
        {renderCheckmark()}
      </View>
      {label && (
        <Text
          style={[
            styles.label,
            { color: disabled ? disabledColor : '#000' },
            labelStyle,
          ]}
        >
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  checkmark: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkText: {
    fontWeight: 'bold',
  },
  label: {
    marginLeft: 8,
    fontSize: 16,
    flex: 1,
  },
});

export default Checkbox;
