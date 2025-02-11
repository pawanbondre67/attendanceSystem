// import React, {useState, Fragment, useCallback, useMemo, useRef} from 'react';
// import {
//   StyleSheet,
//   View,
//   ScrollView,
//   Text,
//   TouchableOpacity,
// } from 'react-native';
// import {Calendar, CalendarUtils} from 'react-native-calendars';
// import testIDs from '../../screens/AttendanceLog/components/calender/src/testIDs';
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// const INITIAL_DATE = new Date().toISOString().split('T')[0];
// const CalendarScreen = () => {
//   const [selected, setSelected] = useState(INITIAL_DATE);
//   const [currentMonth, setCurrentMonth] = useState(INITIAL_DATE);

//   const getDate = (count: number) => {
//     const date = new Date(INITIAL_DATE);
//     const newDate = date.setDate(date.getDate() + count);
//     return CalendarUtils.getCalendarDateString(newDate);
//   };

//   const onDayPress = useCallback(day => {
//     setSelected(day.dateString);
//   }, []);

//   const marked = useMemo(() => {
//     return {
//       [getDate(-1)]: {
//         dotColor: 'red',
//         marked: true,
//       },
//       [selected]: {
//         selected: true,
//         disableTouchEvent: true,
//         selectedColor: 'orange',
//         selectedTextColor: 'red',
//       },
//     };
//   }, [selected]);

//   const customHeaderProps: any = useRef();

//   const setCustomHeaderNewMonth = (next = false) => {
//     const add = next ? 1 : -1;
//     const month = new Date(customHeaderProps?.current?.month);
//     const newMonth = new Date(month.setMonth(month.getMonth() + add));
//     customHeaderProps?.current?.addMonth(add);
//     // Extract the long name of the month

//     const monthName = newMonth.toLocaleString('default', {month: 'long'});
//     const year = newMonth.getFullYear();

//     // Update the state with the formatted date
//     setCurrentMonth(`${monthName} ${year}`);
//   };
//   const moveNext = () => {
//     setCustomHeaderNewMonth(true);
//   };
//   const movePrevious = () => {
//     setCustomHeaderNewMonth(false);
//   };

//   // eslint-disable-next-line react/no-unstable-nested-components
//   const CustomHeader = React.forwardRef((props, ref) => {
//     customHeaderProps.current = props;
//     const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
//     return (
//       // @ts-expect-error
//       <View ref={ref} {...props}>
//         <View style={styles.customHeader}>
//           <Text>{currentMonth}</Text>
//           <TouchableOpacity onPress={movePrevious}>
//             <MaterialCommunityIcons
//               name={'chevron-left'}
//               size={24}
//               color="black"
//             />
//           </TouchableOpacity>
//           <TouchableOpacity onPress={moveNext}>
//             <MaterialCommunityIcons
//               name={'chevron-right'}
//               size={24}
//               color="black"
//             />
//           </TouchableOpacity>
//         </View>
// {/* 
//         <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
//           {dayNames.map((day, index) => (
//             <Text
//               key={index}
//               style={{width: 32, textAlign: 'center', color: '#A6AEBF'}}>
//               {day}
//             </Text>
//           ))}
//         </View> */}
//       </View>
//     );
//   });

//   return (
//     <Calendar
//       initialDate={INITIAL_DATE}
//       enableSwipeMonths={true}
//       onDayPress={onDayPress}
//       markedDates={marked}
//       testID={testIDs.calendars.LAST}
//       style={[styles.calendar, styles.customCalendar]}
//       customHeader={CustomHeader}
//     />
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: 'white',
//   },
//    customHeader: {
//     // backgroundColor: '#FCC',
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     marginHorizontal: -4,
//     padding: 8,
//   },
//   customHeaderContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 10,
//   },
//   customHeaderText: {
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   dayNamesContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     paddingHorizontal: 10,
//   },
//   dayNameText: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     width: 32,
//     textAlign: 'center',
//   },
//   text: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     margin: 10,
//   },
//   calendar: {
//     marginBottom: 10,
//   },
//   customCalendar: {
//     borderWidth: 1,
//     borderColor: 'gray',
//   },
// });

// export default CalendarScreen;
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const INITIAL_DATE = new Date().toISOString().split('T')[0];

const CalendarScreen = () => {
  const [selected, setSelected] = useState(INITIAL_DATE);
  const [currentMonthYear, setCurrentMonthYear] = useState('');

  useEffect(() => {
    const today = new Date();
    const monthYear = today.toLocaleString('default', { month: 'long', year: 'numeric' });
    setCurrentMonthYear(monthYear);
  }, []);

  const handleMonthChange = (add) => {
    const newMonth = new Date(selected);
    newMonth.setMonth(newMonth.getMonth() + add);
    const monthYear = newMonth.toLocaleString('default', { month: 'long', year: 'numeric' });
    setCurrentMonthYear(monthYear);
    setSelected(newMonth.toISOString().split('T')[0]);
  };
  const onMonthChange = (date) => {
    const newMonth = new Date(date.dateString);
    const monthYear = newMonth.toLocaleString('default', { month: 'long', year: 'numeric' });
    setCurrentMonthYear(monthYear);
    setSelected(newMonth.toISOString().split('T')[0]);
  };
  // eslint-disable-next-line react/no-unstable-nested-components
  const CustomHeader = ({ date, onPressArrowLeft, onPressArrowRight }) => {

    return (
      <View>
        <View style={styles.customHeaderContainer}>
          {/* <TouchableOpacity onPress={onPressArrowLeft}>
            <MaterialCommunityIcons name="chevron-left" size={28} color="black" />
          </TouchableOpacity> */}
          <Text style={styles.customHeaderText}>{currentMonthYear}</Text>
          {/* <TouchableOpacity onPress={onPressArrowRight}>
            <MaterialCommunityIcons name="chevron-right" size={28} color="black" />
          </TouchableOpacity> */}
        </View>

      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Calendar
        initialDate={INITIAL_DATE}
        enableSwipeMonths={true}
        style={[styles.calendar, styles.customCalendar]}
        current={selected}
        onDayPress={(day) => setSelected(day.dateString)}
        renderHeader={(date) => (
          <CustomHeader
            date={date}
            onPressArrowLeft={() => handleMonthChange(-1)}
            onPressArrowRight={() => handleMonthChange(1)}
          />
        )}
        onMonthChange={onMonthChange}
        renderArrow={(direction) => (
          <MaterialCommunityIcons
            name={direction === 'left' ? 'chevron-left' : 'chevron-right'}
            size={28}
            color="black"
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    marginBottom: 120,

  },
  calendar: {
    margin: 10,
    borderRadius: 10,
  },
  customHeaderText:{
    fontSize: 18,
    fontWeight: 'bold',
  },
  customCalendar: {
    // height: 250,
    borderWidth: 1,
    margin: 10,
    borderColor: 'lightgrey',
  },
  dayNamesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  dayNameText: {
    fontSize: 16,
    fontWeight: 'bold',
    width: 32,
    textAlign: 'center',
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    margin: 10,
  },
});

export default CalendarScreen;