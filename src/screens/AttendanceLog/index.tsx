import {View, Text, StyleSheet, ScrollView} from 'react-native';
import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import CalendarScreen from './CustomHeader';
import CustomCard from './CustomCard';
// import CalendarScreen from './components/calender/src/screens/calendarScreen';

const AttendanceLog = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Attendance History</Text>
        <MaterialCommunityIcons name="dots-vertical" size={28} color="white" />
      </View>
      <CalendarScreen />
      <ScrollView style={{flex: 1 , marginHorizontal:10}}>
        {' '}
        <CustomCard date="12/01/2025" inTime="09:00" outTime="18:00" />
        <CustomCard date="13/01/2025" inTime="09:00" outTime="18:00" />
        <CustomCard date="14/01/2025" inTime="09:00" outTime="18:00" />
        <CustomCard date="15/01/2025" inTime="09:00" outTime="18:00" />
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    backgroundColor: '#578FCA',
    width: '100%',
    height: 70,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
export default AttendanceLog;
