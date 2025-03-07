import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TouchableWithoutFeedback,
  ScrollView,
  Dimensions,
  // RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useAppSelector} from '../../redux/hook/hook';
import Clock from '../../components/Clock';
import useLocalStorage from './useLocalStorage';
import LogoutDialog from '../../components/Dialog';
import {isIos} from '../../helper/utility';
import {useLatestStatusQuery} from '../../redux/services/attendance/attendanceApiSlice';
import {useLazyLoginQuery} from '../../redux/services/auth/login/LoginApiSlice';
import useHistoryData from './useHistoryData';

const {width, height} = Dimensions.get('window');

const HomeScreen = ({navigation}: any) => {
  const {inTime, outTime, refetch} = useHistoryData();
  const {employeeDetails} = useLocalStorage({navigation});
  const {status} = useAppSelector(state => state.attendance.CheckInOutData);
  const {employeeDetailsState} = useAppSelector(state => state.employee);

  const getGreeting = () => {
    const hour = new Date().getHours(); // Get the current hour (0-23)

    if (hour >= 5 && hour < 12) {
      return 'Good Morning';
    } else if (hour >= 12 && hour < 17) {
      return 'Good Afternoon';
    } else if (hour >= 17 && hour < 21) {
      return 'Good Evening';
    } else {
      return 'Good Night';
    }
  };

  // Fetch latest status
  const {error: latestStatusDataError} = useLatestStatusQuery({
    CustomerCode: employeeDetailsState?.CustomerCode || '',
  });
  const [loginUser] = useLazyLoginQuery();

  useEffect(() => {
    if (latestStatusDataError) {
      // console.log('error', latestStatusDataError);
      console.log('Logging in user...' , employeeDetailsState);
      loginUser(employeeDetailsState, false);
    }
  }, [latestStatusDataError]);

  const [dialogVisible, setDialogVisible] = useState(false);
  // const [refreshing, setRefreshing] = useState(false); // State for refresh control
  const showDialog = () => setDialogVisible(true);
  const hideDialog = () => setDialogVisible(false);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    refetch();
  }, [status, refetch]);

  // // Function to handle refresh
  // const handleRefresh = async () => {
  //   setRefreshing(true); // Start refreshing
  //   console.log('Refreshing...');
  //   await refetch(); // Refetch data
  //   setRefreshing(false); // Stop refreshing
  // };

  return (
    <>
      <View style={[styles.header, {paddingTop: isIos ? insets.top : 40}]}>
        <View style={styles.userInfo}>
          <TouchableWithoutFeedback
            onPress={() => navigation.navigate('profileTab')}>
            <Image
              style={styles.userImage}
              source={{
                uri: employeeDetails?.ProfilePic
                  ? employeeDetails?.ProfilePic
                  : 'https://avatar.iran.liara.run/public/boy?username=pawan',
              }}
            />
          </TouchableWithoutFeedback>
          <View>
            <Text style={styles.userName}>
              <Text style={{fontWeight: '300'}}>{getGreeting()}</Text>
            </Text>
            <Text style={styles.userId}> {employeeDetails?.UserName}</Text>
          </View>
        </View>
        <Icon name="logout" onPress={showDialog} size={24} color="#fff" />
      </View>

      {/* ScrollView with RefreshControl */}
      <ScrollView
        style={[styles.maincontainer]}
        contentContainerStyle={styles.scrollContainer}
        // refreshControl={
        //   <RefreshControl
        //     refreshing={refreshing} // Set refreshing state
        //     onRefresh={handleRefresh} // Callback when user pulls to refresh
        //   />
        // }
        >
        <View style={styles.container}>
          <LogoutDialog
            navigation={navigation}
            visible={dialogVisible}
            hideDialog={hideDialog}
          />
          <Clock />

          {/* Punch In Button */}
          <View style={styles.btncontainer}>
            {status === 'in' ? (
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
              <Text style={styles.punchText}>{inTime || '00:00'}</Text>
              <Text style={styles.punchLabel}>Check In</Text>
            </View>
            <View style={styles.punchItem}>
              <Icon name="access-time" size={24} color="#ff0000" />
              <Text style={styles.punchText}>{outTime || '00:00'}</Text>
              <Text style={styles.punchLabel}>Check Out</Text>
            </View>
            <View style={styles.punchItem}>
              <Icon name="timer" size={24} color="#ff0000" />
              <Text style={styles.punchText}>00:00</Text>
              <Text style={styles.punchLabel}>Total Hours</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  maincontainer: {
    flex: 1,
    backgroundColor: isIos ? '#f7f7f7' : '',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f7f7f7',
  },
  btncontainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: height * 0.02,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.02,
    backgroundColor: '#578FCA',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userImage: {
    width: width * 0.12,
    height: width * 0.12,
    borderRadius: width * 0.06,
    marginRight: width * 0.03,
  },
  userName: {
    fontWeight: 'bold',
    fontSize: width * 0.045,
    color: '#fff',
  },
  userId: {
    color: '#fff',
    fontSize: width * 0.035,
  },
  outerCircle: {
    justifyContent: 'center',
    alignItems: 'center',
    width: width * 0.45,
    height: width * 0.45,
    borderRadius: width * 0.225,
    borderWidth: 1,
    borderColor: 'lightgrey',
    backgroundColor: 'lightgrey',
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    width: width * 0.4,
    height: width * 0.4,
    borderRadius: width * 0.2,
    backgroundColor: '#fff',
  },
  innerCircle: {
    justifyContent: 'center',
    alignItems: 'center',
    width: width * 0.35,
    height: width * 0.35,
    borderRadius: width * 0.175,
    backgroundColor: '#f7f7f7',
  },
  label: {
    marginTop: height * 0.01,
    fontSize: width * 0.04,
    fontWeight: 'bold',
    color: '#000',
  },
  punchDetails: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
    paddingVertical: height * 0.02,
    backgroundColor: '#fff',
  },
  punchItem: {
    alignItems: 'center',
  },
  punchText: {
    fontSize: width * 0.04,
    fontWeight: 'bold',
    marginTop: height * 0.005,
  },
  punchLabel: {
    fontSize: width * 0.03,
    color: '#888',
  },
});

export default HomeScreen;