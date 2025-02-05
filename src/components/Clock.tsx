import React, {useEffect, useMemo, useState} from 'react';
import {Text, StyleSheet, View} from 'react-native';
import moment from 'moment';
import axios from 'axios';
const Clock = () => {
  const [currentTime, setCurrentTime] = useState<string>('');

  const getCurrentDate = (): string => {
    return moment().format('MMM DD, YYYY - dddd');
  };
  const currentDate = useMemo(() => {
    return getCurrentDate();
  }, []);

  useEffect(() => {

    const fetchTime = async () => {
      try {
        const response = await axios.get('https://timeapi.io/api/time/current/zone?timeZone=Asia%2FCalcutta');
        const { time  } = response.data;
        // setCurrentDate(date);
        setCurrentTime(time);
      } catch (error) {
        console.log('Error fetching time:', error);
      }
    };

    fetchTime();
    // const interval = setInterval(() => {
      // const timeString = getCurrentTimeIn12HourFormat();
      // setCurrentTime(timeString);
    // }, 1000);

    // return () => clearInterval(interval);

    const interval = setInterval(fetchTime, 60000); // Update  every minute

    return () => clearInterval(interval);
  }, []);

  // const getCurrentTimeIn12HourFormat = (): string => {
  //   return moment().format('hh:mm A');
  // };

  return <View style={styles.timeSection}>
  <Text style={styles.time}>{currentTime}</Text>
  <Text style={styles.date}>{currentDate}</Text>
</View>;
};

const styles = StyleSheet.create({
  timeSection: {
    alignItems: 'center',
    marginVertical: 20,
  },
  time: {
    fontSize: 48,
    fontWeight: 'thin',
  },
  date: {
    fontSize: 16,
    color: '#888',
  },
});

export default Clock;
