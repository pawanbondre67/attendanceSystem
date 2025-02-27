import React from 'react';
import {StyleSheet, View, Text} from 'react-native';

interface ItemProps {
  item: any;
}

const AgendaItem = (props: ItemProps) => {
  const {item} = props;

  if (!item.inTime && !item.outTime) {
    return (
      <View style={styles.emptyItem}>
        <Text style={styles.emptyItemText}>No Data Available</Text>
      </View>
    );
  }

  return (
    <>
      <View style={styles.cardContainer}>
        <View style={styles.timeContainer}>
          <View>
            <Text>Total Hrs</Text>
            <Text> 08:00 hrs</Text>
          </View>
          <View style={styles.checkinout}>
            <View>
              <Text style={styles.checkText}>Check in</Text>
              <Text style={styles.timeText}>{item.inTime}</Text>
            </View>
            <View>
              <Text style={styles.checkText}>Check out</Text>
              <Text style={styles.timeText}>{item.outTime || '00:00 AM'}</Text>
            </View>
          </View>
        </View>
      </View>
    </>
  );
};

export default React.memo(AgendaItem);

const styles = StyleSheet.create({
  emptyItem: {
    paddingLeft: 20,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    // borderBottomWidth: 1,
    // borderBottomColor: 'lightgrey',
  },
  emptyItemText: {
    color: '#cdcdcd',
    fontSize: 14,
  },
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
    paddingHorizontal: 5,
    textAlign: 'center',
  },
  checkText: {
    paddingHorizontal: 10,
    textAlign: 'center',
  },
  checkinout: {
    flexDirection: 'row',
    gap: 20,
    justifyContent: 'space-between',
  },
});
