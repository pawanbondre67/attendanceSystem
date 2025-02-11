import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TouchableWithoutFeedback,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useAppSelector} from '../../redux/hook/hook';

import Clock from '../../components/Clock';
import useLocation from '../../helper/location';
import useLocalStorage from './useLocalStorage';
import {Button} from 'react-native';

import LogoutDialog from '../../components/Dialog';
// import { useTheme } from '../../theme/ThemeProvider';
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const HomeScreen = ({navigation}: any) => {
  // const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  // const {Colors, dark} = useTheme();

  const isHomeScreen = true;

  const {
    currentLatitude,
    currentLongitude,
    getOneTimeLocation,
    isFetchingLocation,
  } = useLocation({isHomeScreen});
  console.log('currentLatitude at home screen', currentLatitude);
  // const {status , checkInTime ,checkOutTime} = useAppSelector(state => state.attendance.CheckInOutData);
  const {employeeId} = useAppSelector(state => state.employee);
  // console.log('status returing from globsl state', status);

  const {employeeDetails, attendanceData} =
    useLocalStorage({
      navigation,
    });

  const [dialogVisible, setDialogVisible] = useState(false);

  const showDialog = () => setDialogVisible(true);
  const hideDialog = () => setDialogVisible(false);


  return (
    <SafeAreaView style={styles.maincontainer}>
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <TouchableWithoutFeedback
            onPress={() => navigation.navigate('profileTab')}>
            <Image
              style={styles.userImage}
              source={{
                uri: employeeDetails?.ProfilePic
                  ? employeeDetails?.ProfilePic
                  : 'https://avatar.iran.liara.run/public/boy?username=pawan',
              }} // Placeholder image
            />
          </TouchableWithoutFeedback>
          <View>
            <Text style={styles.userName}>{employeeDetails?.UserName}</Text>
            <Text style={styles.userId}>{employeeId}</Text>
          </View>
        </View>
        <Icon name="logout" onPress={showDialog} size={24} color="#fff" />
      </View>

      <View style={styles.container}>


        <LogoutDialog navigation={navigation} visible={dialogVisible} hideDialog={hideDialog} />


        <Clock />

        <View style={styles.location}>
          <Text>Latitude: {currentLatitude}</Text>
          <Text>Longitude: {currentLongitude}</Text>

          <Button title="Refresh Location" onPress={getOneTimeLocation} />
          {isFetchingLocation && <Text>Fetching location...</Text>}
        </View>

        {/* Punch In Button */}
        <View style={styles.container}>
          {attendanceData?.status === 'in' ? (
            <View style={styles.outerCircle}>
              <TouchableOpacity
                style={styles.button}
                onPress={() =>
                  navigation.navigate('checkinout', {type: 'checkout'})
                }>
                <View style={styles.innerCircle}>
                  <Icon name="touch-app" size={40} color="green" />
                  <Text style={styles.label}>Check Out</Text>
                </View>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.outerCircle}>
              <TouchableOpacity
                style={styles.button}
                onPress={() =>
                  navigation.navigate('checkinout', {type: 'checkin'})
                }>
                <View style={styles.innerCircle}>
                  <Icon name="touch-app" size={40} color="red" />
                  <Text style={styles.label}>Check In</Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
        </View>
        {/* Punch Details Section */}

        <View style={styles.punchDetails}>
          <View style={styles.punchItem}>
            <Icon name="access-time" size={24} color="#ff0000" />
            <Text style={styles.punchText}>
              {attendanceData?.checkInTime
                ? attendanceData?.checkInTime
                : '00:00'}
            </Text>
            <Text style={styles.punchLabel}>Punch In</Text>
          </View>
          <View style={styles.punchItem}>
            <Icon name="access-time" size={24} color="#ff0000" />
            <Text style={styles.punchText}>
              {attendanceData?.checkOutTime
                ? attendanceData?.checkOutTime
                : '00:00'}
            </Text>
            <Text style={styles.punchLabel}>Punch Out</Text>
          </View>
          <View style={styles.punchItem}>
            <Icon name="timer" size={24} color="#ff0000" />
            <Text style={styles.punchText}>08:13</Text>
            <Text style={styles.punchLabel}>Total Hours</Text>
          </View>
        </View>
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
  location: {
    flexDirection: 'column',
    gap: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // padding: 20,
    // marginTop: 40,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#578FCA',
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
    color: '#fff',
  },
  userId: {
    color: '#fff',
  },
  loaderText: {
    marginTop: 10,
    fontSize: 16,
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
    // shadowColor: 'green',
    // shadowOffset: {width: 0, height: 4}, // Reduced height for a more subtle shadow
    // shadowOpacity: 0.1,
    // shadowRadius: 8,
    // elevation: 2, // Lowered elevation for less aggressive shadow
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 155,
    height: 155,
    borderRadius: 77.5, // Should be half of width/height to maintain circle
    backgroundColor: '#fff',
    // elevation: 5, // Keeping consistent with outer circle elevation
  },
  innerCircle: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 140,
    height: 140,
    borderRadius: 90,
    backgroundColor: '#f7f7f7',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2}, // Softer shadow offset
    shadowOpacity: 0.1,
    shadowRadius: 6,
    // elevation: 3,
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
