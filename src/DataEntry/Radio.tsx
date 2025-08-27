import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';

export interface RadioOption {
  label: string;
  value: any;
  disabled?: boolean;
}

interface RadioProps {
  options: RadioOption[];
  selectedValue?: any;
  onValueChange: (value: any) => void;
  disabled?: boolean;
  direction?: 'horizontal' | 'vertical';
  size?: number;
  color?: string;
  backgroundColor?: string;
  borderColor?: string;
  disabledColor?: string;
  style?: ViewStyle;
  optionStyle?: ViewStyle;
  labelStyle?: TextStyle;
  radioStyle?: ViewStyle;
}

interface RadioOptionProps {
  option: RadioOption;
  selected: boolean;
  onPress: () => void;
  disabled?: boolean;
  size: number;
  color: string;
  backgroundColor: string;
  borderColor: string;
  disabledColor: string;
  optionStyle?: ViewStyle;
  labelStyle?: TextStyle;
  radioStyle?: ViewStyle;
}

const RadioOption: React.FC<RadioOptionProps> = ({
  option,
  selected,
  onPress,
  disabled,
  size,
  color,
  backgroundColor,
  borderColor,
  disabledColor,
  optionStyle,
  labelStyle,
  radioStyle,
}) => {
  const isDisabled = disabled || option.disabled;

  const radioStyles: ViewStyle = {
    width: size,
    height: size,
    borderWidth: 2,
    borderRadius: size / 2,
    borderColor: isDisabled ? disabledColor : selected ? color : borderColor,
    backgroundColor: isDisabled ? disabledColor : backgroundColor,
    alignItems: 'center',
    justifyContent: 'center',
    ...radioStyle,
  };

  const renderDot = () => {
    if (!selected) return null;
    
    return (
      <View
        style={[
          styles.dot,
          {
            width: size * 0.5,
            height: size * 0.5,
            borderRadius: (size * 0.5) / 2,
            backgroundColor: isDisabled ? '#fff' : color,
          },
        ]}
      />
    );
  };

  return (
    <TouchableOpacity
      style={[styles.optionContainer, optionStyle]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
    >
      <View style={radioStyles}>
        {renderDot()}
      </View>
      <Text
        style={[
          styles.label,
          { color: isDisabled ? disabledColor : '#000' },
          labelStyle,
        ]}
      >
        {option.label}
      </Text>
    </TouchableOpacity>
  );
};

const Radio: React.FC<RadioProps> = ({
  options,
  selectedValue,
  onValueChange,
  disabled = false,
  direction = 'vertical',
  size = 20,
  color = '#007AFF',
  backgroundColor = '#fff',
  borderColor = '#D1D1D6',
  disabledColor = '#C7C7CC',
  style,
  optionStyle,
  labelStyle,
  radioStyle,
}) => {
  const handleValueChange = (value: any) => {
    if (!disabled) {
      onValueChange(value);
    }
  };

  return (
    <View
      style={[
        styles.container,
        direction === 'horizontal' && styles.horizontalContainer,
        style,
      ]}
    >
      {options.map((option, index) => (
        <RadioOption
          key={index}
          option={option}
          selected={option.value === selectedValue}
          onPress={() => handleValueChange(option.value)}
          disabled={disabled}
          size={size}
          color={color}
          backgroundColor={backgroundColor}
          borderColor={borderColor}
          disabledColor={disabledColor}
          optionStyle={optionStyle}
          labelStyle={labelStyle}
          radioStyle={radioStyle}
        />
      ))}
    </View>
  );
};

// Radio Group component for easier usage
interface RadioGroupProps extends Omit<RadioProps, 'options'> {
  children: React.ReactElement<RadioItemProps>[];
}

interface RadioItemProps {
  label: string;
  value: any;
  disabled?: boolean;
}

export const RadioItem: React.FC<RadioItemProps> = ({ label, value, disabled }) => {
  // This is a placeholder component that won't render anything
  // It's just used to provide a nicer API
  return null;
};

export const RadioGroup: React.FC<RadioGroupProps> = ({
  children,
  ...radioProps
}) => {
  const options: RadioOption[] = React.Children.map(children, (child) => {
    if (React.isValidElement(child) && child.props) {
      return {
        label: child.props.label,
        value: child.props.value,
        disabled: child.props.disabled,
      };
    }
    return { label: '', value: null };
  }).filter(option => option.label);

  return <Radio {...radioProps} options={options} />;
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 4,
  },
  horizontalContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    marginRight: 16,
  },
  dot: {
    position: 'absolute',
  },
  label: {
    marginLeft: 8,
    fontSize: 16,
    flex: 1,
  },
});

export default Radio;
