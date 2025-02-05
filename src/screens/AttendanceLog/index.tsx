import {View, Text, StyleSheet} from 'react-native';
import React from 'react';

const AttendanceLog = () => {
  return (
    <View style={styles.container}>
      <Text>AttendanceLog</Text>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
});
export default AttendanceLog;
