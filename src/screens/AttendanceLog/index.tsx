import React from 'react';
import {View, Text, StyleSheet, Platform, Dimensions} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import ExpandableCalendarScreen from './components/calender/src/screens/expandableCalendarScreen';

const {width, height} = Dimensions.get('window');

const AttendanceLog = () => {
  const insets = useSafeAreaInsets();

  return (
    <>
      <View
        style={[
          styles.header,
          {paddingTop: Platform.OS === 'ios' ? insets.top : 0},
        ]}>
        <Text style={styles.headerText}>Attendance History</Text>
        <MaterialCommunityIcons name="dots-vertical" size={28} color="white" />
      </View>
      <View style={[styles.container]}>
        {/* Expandable Calendar */}
        <View style={styles.calendarContainer}>
          <ExpandableCalendarScreen />
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    backgroundColor: '#578FCA',
    width: '100%',
    height: Platform.OS === 'ios' ? height * 0.12 : height * 0.1, // Dynamic height based on screen size
    // paddingTop: Platform.OS === 'ios' ? height * 0.03 : 0, // Extra padding for iOS status bar
    paddingHorizontal: width * 0.05, // 5% of screen width
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    color: 'white',
    fontSize: width * 0.045, // Responsive font size
    fontWeight: 'bold',
  },
  calendarContainer: {
    flex: 1, // Takes up remaining space
    // marginTop: height * 0.02, // Adds a small margin below the header
  },
});

export default AttendanceLog;
