import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useTheme, useColors } from '../themes';

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
  const theme = useTheme();
  const colors = useColors();
  
  const isDisabled = disabled || option.disabled;

  // Define theme-aware colors with prop fallbacks
  const finalColor = color || colors?.primary || '#007AFF';
  const finalBackgroundColor = backgroundColor || colors?.background || '#fff';
  const finalBorderColor = borderColor || colors?.border || '#D1D1D6';
  const finalDisabledColor = disabledColor || colors?.textDisabled || '#C7C7CC';
  const finalTextColor = colors?.text || '#000';

  const radioStyles: ViewStyle = {
    width: size,
    height: size,
    borderWidth: 2,
    borderRadius: size / 2,
    borderColor: isDisabled ? finalDisabledColor : selected ? finalColor : finalBorderColor,
    backgroundColor: isDisabled ? finalDisabledColor : finalBackgroundColor,
    alignItems: 'center',
    justifyContent: 'center',
    ...radioStyle,
  };

  const optionContainerStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme?.spacing?.sm || 8,
    marginRight: theme?.spacing?.md || 16,
  };

  const dotStyle: ViewStyle = {
    position: 'absolute',
    width: size * 0.5,
    height: size * 0.5,
    borderRadius: (size * 0.5) / 2,
    backgroundColor: isDisabled ? colors?.surface || '#fff' : finalColor,
  };

  const labelTextStyle: TextStyle = {
    marginLeft: theme?.spacing?.sm || 8,
    fontSize: theme?.typography?.fontSize?.md || 16,
    flex: 1,
    color: isDisabled ? finalDisabledColor : finalTextColor,
  };

  const renderDot = () => {
    if (!selected) return null;
    
    return <View style={dotStyle} />;
  };

  return (
    <TouchableOpacity
      style={[optionContainerStyle, optionStyle]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
    >
      <View style={radioStyles}>
        {renderDot()}
      </View>
      <Text style={[labelTextStyle, labelStyle]}>
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
  color,
  backgroundColor,
  borderColor,
  disabledColor,
  style,
  optionStyle,
  labelStyle,
  radioStyle,
}) => {
  const theme = useTheme();
  const colors = useColors();

  // Define theme-aware colors with prop fallbacks
  const finalColor = color || colors?.primary || '#007AFF';
  const finalBackgroundColor = backgroundColor || colors?.background || '#fff';
  const finalBorderColor = borderColor || colors?.border || '#D1D1D6';
  const finalDisabledColor = disabledColor || colors?.textDisabled || '#C7C7CC';

  // Define theme-aware container styles
  const containerStyle: ViewStyle = {
    paddingVertical: theme?.spacing?.xs || 4,
  };

  const horizontalContainerStyle: ViewStyle = {
    flexDirection: 'row',
    flexWrap: 'wrap',
  };

  const handleValueChange = (value: any) => {
    if (!disabled) {
      onValueChange(value);
    }
  };

  return (
    <View
      style={[
        containerStyle,
        direction === 'horizontal' && horizontalContainerStyle,
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
          color={finalColor}
          backgroundColor={finalBackgroundColor}
          borderColor={finalBorderColor}
          disabledColor={finalDisabledColor}
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

export default Radio;
