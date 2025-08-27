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
  const [selectedDate, setSelectedDate] = useState(value);

  useEffect(() => {
    setSelectedDate(value);
  }, [value]);

  const handleDateChange = (newDate: Date) => {
    setSelectedDate(newDate);
    onChange(newDate);
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
      items: (number | string)[],
      selectedItem: number,
      onSelect: (item: number) => void,
      formatter?: (item: number) => string
    ) => (
      <View style={styles.column}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          snapToInterval={itemHeight}
          decelerationRate="fast"
          contentContainerStyle={{ paddingVertical: itemHeight * 2 }}
        >
          {items.map((item, index) => {
            const numItem = typeof item === 'number' ? item : parseInt(item.toString());
            const isSelected = numItem === selectedItem;
            return (
              <TouchableOpacity
                key={index}
                style={[styles.item, { height: itemHeight }]}
                onPress={() => onSelect(numItem)}
              >
                <Text
                  style={[
                    styles.itemText,
                    textStyle,
                    isSelected && [styles.selectedText, selectedTextStyle],
                  ]}
                >
                  {formatter ? formatter(numItem) : numItem}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    );

    return (
      <View style={styles.pickerContainer}>
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
      <View style={styles.column}>
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
                style={[styles.item, { height: itemHeight }]}
                onPress={() => onSelect(item)}
              >
                <Text
                  style={[
                    styles.itemText,
                    textStyle,
                    isSelected && [styles.selectedText, selectedTextStyle],
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
      <View style={styles.pickerContainer}>
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
    <View style={[styles.container, style]}>
      {(mode === 'date' || mode === 'datetime') && renderDatePicker()}
      {(mode === 'time' || mode === 'datetime') && renderTimePicker()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
  pickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  column: {
    flex: 1,
    height: 200,
  },
  item: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemText: {
    fontSize: 16,
    color: '#666',
  },
  selectedText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#007AFF',
  },
});

export default DatePickerView;
