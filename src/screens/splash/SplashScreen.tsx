import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useLatestStatusQuery} from '../../redux/services/attendance/attendanceApiSlice';
import {useLazyLoginQuery} from '../../redux/services/auth/login/LoginApiSlice';
import {useAppDispatch, useAppSelector} from '../../redux/hook/hook';
import {setCheckInOutData as setAttendanceData} from '../../redux/slices/Attendance';
import {
  setEmployeeId,
  setEmployeeDetailsState,
} from '../../redux/slices/Employee/index';
import LottieView from 'lottie-react-native';
import useLocation from '../../helper/location';
import {ActivityIndicator} from 'react-native-paper';
import {setSnackMessage} from '../../redux/slices/snackbarSlice';
import { EmployeeDetails } from '../../types/types';
import useLocalStorage from '../home/useLocalStorage';

const SplashScreen = ({navigation}: any) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const dispatch = useAppDispatch();
  const {getOneTimeLocation, isFetchingLocation} = useLocation();
  const {CheckInOutData: attendanceData} = useAppSelector(
    state => state.attendance,
  );

  const {employeeDetails} = useLocalStorage({navigation});
  const {
    data: latestStatusData,
    isLoading: isLatestStatusLoading,
    error: latestStatusError,
  } = useLatestStatusQuery({CustomerCode: employeeDetails?.CustomerCode || ''});
  const [loginUser] = useLazyLoginQuery();


  const checkUserLoggedIn = async (details: EmployeeDetails) => {
    try {
      const response = await loginUser(details, false).unwrap();
      dispatch(setEmployeeId(response?.data?.employeeId.toString()));
      dispatch(setEmployeeDetailsState(details));
      if (response?.data?.isAppRegisterMandatory) {
        navigation.replace('cameraAuthScreen');
      }
    } catch (error) {
      dispatch(
        setSnackMessage({
          message: 'Login To get Started',
          severity: 'info',
        }),
      );
    }
  };

  // Initialize the app
  useEffect(() => {

    const initialize = async () => {

      if (employeeDetails) {
        console.log('logi----->' , employeeDetails);
        await checkUserLoggedIn(employeeDetails);
      }

      // Fetch location
      await getOneTimeLocation();
      setIsInitialized(true);
    };

    initialize();
  }, []);

  // Handle latest status data
  useEffect(() => {
    if (latestStatusError) {
      console.error('Error fetching latest status:', latestStatusError);
    }

    if (!isLatestStatusLoading && latestStatusData?.data?.status) {
      console.log('attendanceData after fetching', latestStatusData);
      dispatch(
        setAttendanceData({
          ...attendanceData,
          status: latestStatusData?.data?.status,
        }),
      );
    }
  }, [
    latestStatusData,
    isLatestStatusLoading,
    latestStatusError,
    dispatch,
    attendanceData,
  ]);

  useEffect(() => {
    
    if (isLatestStatusLoading || !isInitialized) {
      return;
    }

    const currentRoute = navigation.getState().routes?.[0]?.name;

    if (employeeDetails && currentRoute !== 'mainTabNavigator') {
      navigation.replace('mainTabNavigator');
    } else if (!employeeDetails && currentRoute !== 'loginScreen') {
      navigation.replace('loginScreen');
    }
  }, [
    isInitialized,
    employeeDetails,
    isLatestStatusLoading,
    navigation,
    latestStatusData,
  ]);

  return (
    <View style={styles.container}>
      <LottieView
        source={require('../../assets/timeLoader.json')} // Path to Lottie file
        autoPlay
        loop
        style={styles.lottie}
      />
      {isFetchingLocation ? (
        <ActivityIndicator size="small" color="#000" />
      ) : (
        <Text>Initializing...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lottie: {
    width: 300,
    height: 300,
  },
});

export default SplashScreen;
