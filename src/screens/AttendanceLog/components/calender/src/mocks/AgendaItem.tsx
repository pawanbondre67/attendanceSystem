import React, {useCallback} from 'react';
import {StyleSheet, View, Text} from 'react-native';

interface ItemProps {
  item: any;
}

const AgendaItem = (props: ItemProps) => {
  const {item} = props;

  if (!item.inTime || !item.outTime) {
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
          <View style={styles.totalhrs}>
            <Text>Total Hours</Text>
            <Text style={styles.timeText}>08:00:00 hrs</Text>
          </View>
          <View style={styles.totalhrs}>
            <Text>Check In & Out </Text>
            <Text style={styles.timeText}>
              In: {item.inTime} Out: {item.outTime}
            </Text>
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
