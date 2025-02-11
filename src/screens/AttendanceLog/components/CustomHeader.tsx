import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';

const CustomCalendarHeader = ({ currentMonth, onPressLeftArrow, onPressRightArrow }) => {
  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity onPress={onPressLeftArrow}>
        <Text style={styles.arrow}>{'<'}</Text>
      </TouchableOpacity>
      <Text style={styles.monthYearText}>
        {currentMonth}
      </Text>
      <TouchableOpacity onPress={onPressRightArrow}>
        <Text style={styles.arrow}>{'>'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const App = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const onMonthChange = (date) => {
    setCurrentDate(new Date(date.dateString));
  };

  const onPressLeftArrow = () => {
    const previousMonth = new Date(currentDate);
    previousMonth.setMonth(previousMonth.getMonth() - 1);
    setCurrentDate(previousMonth);
  };

  const onPressRightArrow = () => {
    const nextMonth = new Date(currentDate);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    setCurrentDate(nextMonth);
  };

  const getMonthYearString = (date) => {
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    return `${month} ${year}`;
  };

  return (
    <View style={styles.container}>
      <Calendar
        current={currentDate.toISOString().split('T')[0]}
        onMonthChange={onMonthChange}
        renderHeader={(date) => (
          <CustomCalendarHeader
            currentMonth={getMonthYearString(new Date(date))}
            onPressLeftArrow={onPressLeftArrow}
            onPressRightArrow={onPressRightArrow}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 5,
  },
  arrow: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6200ee',
  },
  monthYearText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default App;