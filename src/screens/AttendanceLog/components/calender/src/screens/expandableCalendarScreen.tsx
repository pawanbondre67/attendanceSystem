import React, {useRef, useCallback, useState, useEffect, useMemo} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {
  ExpandableCalendar,
  AgendaList,
  CalendarProvider,
  WeekCalendar,
} from 'react-native-calendars';
import testIDs from '../testIDs';
// import { getMarkedDates} from '../mocks/agendaItems';
import AgendaItem from '../mocks/AgendaItem';
import {getTheme, themeColor, lightThemeColor} from '../mocks/theme';
import {useAppSelector} from '../../../../../../redux/hook/hook';
import {useHistoryOfAttendanceQuery} from '../../../../../../redux/services/attendance/attendanceApiSlice';
import Spinner from '../../../../../../components/Spinner';
const leftArrowIcon = require('../img/previous.png');
const rightArrowIcon = require('../img/next.png');

interface Props {
  weekView?: boolean;
}

const ExpandableCalendarScreen = (props: Props) => {
  const {employeeDetailsState, employeeId} = useAppSelector(
    state => state.employee,
  );
  const {status} = useAppSelector(state => state.attendance.CheckInOutData);

  const today = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(today);

  console.log('selectedDate', selectedDate);

  const {data, error, isLoading, refetch} = useHistoryOfAttendanceQuery({
    fromdate: selectedDate,
    todate: selectedDate,
    id: employeeId,
    CustomerCode: employeeDetailsState?.CustomerCode || '',
  });

  const [items, setItems] = useState<any[]>([]);

  // Refetch data when status or selectedDate changes
  useEffect(() => {
    refetch();
  }, [status, selectedDate, refetch]);

  useEffect(() => {
    console.log('data----->', data);
    console.log('items----->', items);
  }, [data]);

  const formatServerData = data => {
    const formattedData: any[] = [];

      // Reverse the data array
  const reversedData = [...data].reverse();

  reversedData.forEach((entry: {inDate: any; inTime: any; outTime: any}) => {
      const {inDate, inTime, outTime} = entry;

      // Find or create the day entry in the formattedData array
      let dayEntry = formattedData.find(item => item.title === inDate);
      if (!dayEntry) {
        dayEntry = {
          title: inDate,
          data: [],
        };
        formattedData.push(dayEntry);
      }

      // Add the inTime and outTime to the day's data
      dayEntry.data.push({
        inTime: inTime ? formatTime(inTime) : null,
        outTime: outTime ? formatTime(outTime) : null,
      });
    });

    return formattedData;
  };

  const formatTime = (timestamp: string): string | null => {
    if (!timestamp) {
      return null;
    }

    const [hours, minutes] = timestamp.split('.')[0].slice(0, 5).split(':');
    let hour = parseInt(hours, 10);
    const period = hour >= 12 ? 'PM' : 'AM';

    if (hour === 0) {
      hour = 12;
    } else if (hour > 12) {
      hour -= 12;
    }

    return `${hour}:${minutes} ${period}`;
  };

  const formattedData = useMemo(() => {
    if (data && Array.isArray(data.data)) {
      return formatServerData(data.data);
    }
    return [];
  }, [data, status]);

  useEffect(() => {
    setItems(formattedData);
  }, [formattedData]);

  const {weekView} = props;
  const theme = useRef(getTheme());
  const todayBtnTheme = useRef({
    todayButtonTextColor: themeColor,
  });

  const onDateChanged = useCallback((date, updateSource) => {
    if (updateSource === 'dayPress') {
      setSelectedDate(date);
      console.log('onDateChanged', date);
    }
    console.log('ExpandableCalendarScreen onDateChanged: ', date, updateSource);
  }, []);

  const renderItem = useCallback(({item}: any) => {
    console.log('item------>', item);
    if (!item) {
      return (
        <View style={styles.common}>
          <Text>No data available</Text>
        </View>
      );
    }
    return <AgendaItem item={item} />;
  }, []);

  const keyExtractor = useCallback((item, index) => {
    return item?.title ? item.title : index.toString();
  }, []);

  if (error) {
    return (
      <View style={styles.common}>
        <Text>Error loading data. Please try again later.</Text>
      </View>
    );
  }

  return (
    <CalendarProvider
      date={selectedDate}
      onDateChanged={onDateChanged}
      showTodayButton
      theme={todayBtnTheme.current}>
      {weekView ? (
        <WeekCalendar  testID={testIDs.weekCalendar.CONTAINER} maxDate={today} firstDay={1} />
      ) : (
        <ExpandableCalendar
        
          testID={testIDs.expandableCalendar.CONTAINER}
          theme={theme.current}
          maxDate={today}
          
          firstDay={1}
          leftArrowImageSource={leftArrowIcon}
          rightArrowImageSource={rightArrowIcon}
          animateScroll
        />
      )}
      {isLoading ? (
        <View style={styles.common}>
          <Spinner />
        </View>
      ) : items.length > 0 ? (
        <AgendaList
          sections={items}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          initialNumToRender={5}
          sectionStyle={styles.section}
        />
      ) : (
        <View style={styles.common}>
          <Text>No data available</Text>
        </View>
      )}
    </CalendarProvider>
  );
};

export default ExpandableCalendarScreen;

const styles = StyleSheet.create({
  calendar: {
    paddingLeft: 20,
    paddingRight: 20,
  },
  header: {
    backgroundColor: 'lightgrey',
  },
  section: {
    backgroundColor: lightThemeColor,
    color: 'grey',
    textTransform: 'capitalize',
  },
  common: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
});
