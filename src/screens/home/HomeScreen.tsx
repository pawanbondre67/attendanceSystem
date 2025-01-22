import {NavigationProp, useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {RootStackParamList} from '../../types/types';
import {SafeAreaView} from 'react-native-safe-area-context';
// import { useTheme } from '../../theme/ThemeProvider';
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const HomeScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  // const {Colors, dark} = useTheme();

  const [status, setStatus] = useState('Check IN');
  return (
    <SafeAreaView style={styles.maincontainer}>
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Image
            style={styles.userImage}
            source={{
              uri: 'https://avatar.iran.liara.run/public/boy?username=pawan',
            }} // Placeholder image
          />
          <View>
            <Text style={styles.userName}>HEY JHONE DOE</Text>
            <Text style={styles.userId}>MZ001234</Text>
          </View>
        </View>
        <Icon name="refresh" size={24} color="#000" />
      </View>

      <View style={styles.container}>
        {/* Time Display */}
        <View style={styles.timeSection}>
          <Text style={styles.time}>09:15 AM</Text>
          <Text style={styles.date}>Feb 01, 2024 - Thursday</Text>
        </View>

        {/* Punch In Button */}
        <View style={styles.container}>
          {status === 'Check IN' ? (
            <View style={styles.outerCircle}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('checkinout', {type: 'in'})}>
                <View style={styles.innerCircle}>
                  <Icon name="touch-app" size={40} color="#ff0000" />
                  <Text style={styles.label}>Check IN</Text>
                </View>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.outerCircle}>
              <TouchableOpacity
                style={styles.button}
                onPress={() =>
                  navigation.navigate('checkinout', {type: 'out'})
                }>
                <View style={styles.innerCircle}>
                  <Icon name="touch-app" size={40} color="green" />
                  <Text style={styles.label}>Check OUT</Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
        </View>
        {/* Punch Details Section */}

        <View style={styles.punchDetails}>
          <View style={styles.punchItem}>
            <Icon name="access-time" size={24} color="#ff0000" />
            <Text style={styles.punchText}>09:08 AM</Text>
            <Text style={styles.punchLabel}>Punch In</Text>
          </View>
          <View style={styles.punchItem}>
            <Icon name="access-time" size={24} color="#ff0000" />
            <Text style={styles.punchText}>06:05 PM</Text>
            <Text style={styles.punchLabel}>Punch Out</Text>
          </View>
          <View style={styles.punchItem}>
            <Icon name="timer" size={24} color="#ff0000" />
            <Text style={styles.punchText}>08:13</Text>
            <Text style={styles.punchLabel}>Total Hours</Text>
          </View>
        </View>
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Icon name="home" size={24} color="#fff" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Icon name="apps" size={24} color="#fff" />
          <Text style={styles.navText}>Apps</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Icon name="menu" size={24} color="#fff" />
          <Text style={styles.navText}>Menu</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  maincontainer: {
    flex: 1,
    // backgroundColor: 'red',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f7f7f7',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // padding: 20,
    // marginTop: 40,
    paddingHorizontal: 20,
    paddingVertical: 10,
    // backgroundColor: 'red',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  userName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  userId: {
    color: '#888',
  },
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
  outerCircle: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 180,
    height: 180,
    borderRadius: 90, // Should be half of width/height to maintain circle
    borderWidth: 1,
    borderColor: 'lightgrey',
    backgroundColor: 'lightgrey',
    shadowColor: 'green',
    shadowOffset: {width: 0, height: 4}, // Reduced height for a more subtle shadow
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4, // Lowered elevation for less aggressive shadow
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 155,
    height: 155,
    borderRadius: 77.5, // Should be half of width/height to maintain circle
    backgroundColor: '#fff',
    elevation: 5, // Keeping consistent with outer circle elevation
  },
  innerCircle: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#f7f7f7',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2}, // Softer shadow offset
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  label: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  punchDetails: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
    paddingVertical: 20,
    backgroundColor: '#fff',
    // borderTopWidth: 1,
    // borderBottomWidth: 1,
    // borderColor: '#ddd',
  },
  punchItem: {
    alignItems: 'center',
  },
  punchText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
  },
  punchLabel: {
    fontSize: 12,
    color: '#888',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    backgroundColor: '#e53935',
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    color: '#fff',
    marginTop: 5,
    fontSize: 12,
  },
});

export default HomeScreen;
