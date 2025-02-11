import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

type CardData = {
  date: string;
  inTime: string;
  outTime: string;
};
const CustomCard = ({date, inTime, outTime}: CardData) => {
  return (
    <View style={styles.cardContainer}>
      <View style={styles.dateContainer}>
        <MaterialCommunityIcons
          name="calendar-month-outline"
          size={28}
          color="#3674B5"
        />
        <Text style={styles.dateText}>{date}</Text>
      </View>
      <View style={styles.timeContainer}>
        <View style={styles.totalhrs}>
          <Text>Total Hours</Text>
          <Text style={styles.timeText}>08:00:00 hrs</Text>
        </View>
        <View style={styles.totalhrs}>
          <Text>Check In & Out </Text>
          <Text style={styles.timeText}>
            In: {inTime} Out: {outTime}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'column',
    padding: 10,
    gap: 10,
    margin: 10,
    // borderWidth: 1,
    // borderColor: 'lightgrey',
    borderRadius: 10,
    backgroundColor: 'white',
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 10,
    alignItems: 'center',
    // borderWidth: 1,
    // borderColor: 'lightgrey',
    paddingRight: 10,
  },
  dateText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  timeContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#F7F7F8',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'lightgrey',
    justifyContent: 'space-between',
    paddingLeft: 10,
  },
  timeText: {
    fontSize: 16,
    fontWeight: 500,
  },
  totalhrs: {
    flexDirection: 'column',
  },
});

export default CustomCard;
