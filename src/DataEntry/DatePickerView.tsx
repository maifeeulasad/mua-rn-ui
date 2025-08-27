import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
  Dimensions,
} from 'react-native';
import { useTheme, useColors } from '../themes';

type DatePickerMode = 'date' | 'time' | 'datetime';

interface DatePickerViewProps {
  value?: Date;
  mode?: DatePickerMode;
  onChange: (date: Date) => void;
  minimumDate?: Date;
  maximumDate?: Date;
  style?: ViewStyle;
  textStyle?: TextStyle;
  selectedTextStyle?: TextStyle;
  itemHeight?: number;
  visibleItemCount?: number;
}

const { width: screenWidth } = Dimensions.get('window');

const DatePickerView: React.FC<DatePickerViewProps> = ({
  value = new Date(),
  mode = 'date',
  onChange,
  minimumDate,
  maximumDate,
  style,
  textStyle,
  selectedTextStyle,
  itemHeight = 40,
  visibleItemCount = 5,
}) => {
  const theme = useTheme();
  const colors = useColors();
  
  const [selectedDate, setSelectedDate] = useState(value);

  useEffect(() => {
    setSelectedDate(value);
  }, [value]);

  const handleDateChange = (newDate: Date) => {
    setSelectedDate(newDate);
    onChange(newDate);
  };

  // Define theme-aware styles
  const containerStyle: ViewStyle = {
    flex: 1,
    backgroundColor: colors?.background || '#FFFFFF',
  };

  const pickerContainerStyle: ViewStyle = {
    flexDirection: 'row',
    height: itemHeight * visibleItemCount,
    backgroundColor: colors?.surface || '#FFFFFF',
  };

  const columnStyle: ViewStyle = {
    flex: 1,
    alignItems: 'center',
  };

  const itemStyle: ViewStyle = {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme?.spacing?.sm || 8,
  };

  const itemTextStyle: TextStyle = {
    fontSize: theme?.typography?.fontSize?.md || 16,
    color: colors?.textSecondary || '#666',
    fontWeight: theme?.typography?.fontWeight?.normal || '400',
  };

  const selectedItemTextStyle: TextStyle = {
    color: colors?.primary || '#007AFF',
    fontWeight: theme?.typography?.fontWeight?.semibold || '600',
  };

  const renderDatePicker = () => {
    const currentYear = selectedDate.getFullYear();
    const currentMonth = selectedDate.getMonth();
    const currentDay = selectedDate.getDate();

    const years = Array.from({ length: 100 }, (_, i) => currentYear - 50 + i);
    const months = Array.from({ length: 12 }, (_, i) => i);
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    const renderColumn = (
      items: number[],
      selectedItem: number,
      onSelect: (item: number) => void,
      formatter?: (item: number) => string
    ) => (
      <View style={columnStyle}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          snapToInterval={itemHeight}
          decelerationRate="fast"
          contentContainerStyle={{ paddingVertical: itemHeight * 2 }}
        >
          {items.map((item, index) => {
            const isSelected = item === selectedItem;
            return (
              <TouchableOpacity
                key={index}
                style={[itemStyle, { height: itemHeight }]}
                onPress={() => onSelect(item)}
              >
                <Text
                  style={[
                    itemTextStyle,
                    textStyle,
                    isSelected && [selectedItemTextStyle, selectedTextStyle],
                  ]}
                >
                  {formatter ? formatter(item) : item.toString().padStart(2, '0')}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    );

    return (
      <View style={pickerContainerStyle}>
        {renderColumn(years, currentYear, (year) => {
          handleDateChange(new Date(year, currentMonth, currentDay));
        })}
        {renderColumn(months, currentMonth, (month) => {
          handleDateChange(new Date(currentYear, month, currentDay));
        }, (month) => new Date(0, month).toLocaleDateString('en', { month: 'short' }))}
        {renderColumn(days, currentDay, (day) => {
          handleDateChange(new Date(currentYear, currentMonth, day));
        }, (day) => day.toString().padStart(2, '0'))}
      </View>
    );
  };

  const renderTimePicker = () => {
    const currentHour = selectedDate.getHours();
    const currentMinute = selectedDate.getMinutes();

    const hours = Array.from({ length: 24 }, (_, i) => i);
    const minutes = Array.from({ length: 60 }, (_, i) => i);

    const renderColumn = (
      items: number[],
      selectedItem: number,
      onSelect: (item: number) => void,
      formatter?: (item: number) => string
    ) => (
      <View style={columnStyle}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          snapToInterval={itemHeight}
          decelerationRate="fast"
          contentContainerStyle={{ paddingVertical: itemHeight * 2 }}
        >
          {items.map((item, index) => {
            const isSelected = item === selectedItem;
            return (
              <TouchableOpacity
                key={index}
                style={[itemStyle, { height: itemHeight }]}
                onPress={() => onSelect(item)}
              >
                <Text
                  style={[
                    itemTextStyle,
                    textStyle,
                    isSelected && [selectedItemTextStyle, selectedTextStyle],
                  ]}
                >
                  {formatter ? formatter(item) : item}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    );

    return (
      <View style={pickerContainerStyle}>
        {renderColumn(hours, currentHour, (hour) => {
          const newDate = new Date(selectedDate);
          newDate.setHours(hour);
          handleDateChange(newDate);
        }, (hour) => hour.toString().padStart(2, '0'))}
        {renderColumn(minutes, currentMinute, (minute) => {
          const newDate = new Date(selectedDate);
          newDate.setMinutes(minute);
          handleDateChange(newDate);
        }, (minute) => minute.toString().padStart(2, '0'))}
      </View>
    );
  };

  return (
    <View style={[containerStyle, style]}>
      {(mode === 'date' || mode === 'datetime') && renderDatePicker()}
      {(mode === 'time' || mode === 'datetime') && renderTimePicker()}
    </View>
  );
};

export default DatePickerView;
