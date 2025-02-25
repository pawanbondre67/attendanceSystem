import {
  View,
  Text,
  StyleSheet,

} from 'react-native';
import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {useSafeAreaInsets} from 'react-native-safe-area-context';
import ExpandableCalendarScreen from './components/calender/src/screens/expandableCalendarScreen';

const AttendanceLog = () => {
  const insets = useSafeAreaInsets();
  // const data = [
  //   {date: '12/01/2025', inTime: '09:00', outTime: '18:00'},
  //   {date: '13/01/2025', inTime: '09:00', outTime: '18:00'},
  //   {date: '14/01/2025', inTime: '09:00', outTime: '18:00'},
  //   {date: '15/01/2025', inTime: '09:00', outTime: '18:00'},
  // ];

  // const renderItem = ({item}) => (
  //   <CustomCard date={item.date} inTime={item.inTime} outTime={item.outTime} />
  // );

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        },
      ]}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Attendance History</Text>
        <MaterialCommunityIcons name="dots-vertical" size={28} color="white" />
      </View>
      {/* <CalendarScreen /> */}
      <ExpandableCalendarScreen />
      {/* <FlatList
        style={styles.scrollView}
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.date}
      /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    // alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    backgroundColor: '#578FCA',
    width: '100%',
    height: Platform.OS === 'ios' ? 90 : 70, // Adjust height for iOS
    paddingTop: Platform.OS === 'ios' ? 20 : 0, // Extra padding for iOS status bar
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
    marginHorizontal: 10,
  },
});

export default AttendanceLog;
