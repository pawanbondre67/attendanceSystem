
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

interface EmployeeDetails {
  CustomerCode: string;
  UserName: string;
  Password: string;
}

const SplashScreen = ({navigation} : any) => {
  // const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [isInitialized, setIsInitialized] = useState(false);
  const dispatch = useAppDispatch();
  const {getOneTimeLocation, isFetchingLocation} = useLocation();
  const {CheckInOutData: attendanceData} = useAppSelector(
    state => state.attendance,
  );

  const [employeeDetails, setEmployeeDetail] = useState<EmployeeDetails | null>(
    null,
  );
  const {data: latestStatusData, isLoading: isLatestStatusLoading} =
    useLatestStatusQuery();
  const [loginUser, loginResult] = useLazyLoginQuery();

  const getEmployeeDetailsFromLocal =
    async (): Promise<EmployeeDetails | null> => {
      try {
        const jsonValue = await AsyncStorage.getItem('employeeDetails');
        return jsonValue != null ? JSON.parse(jsonValue) : null;
      } catch (error) {
        console.error(
          'Failed to retrieve employee details from local storage',
          error,
        );
        return null;
      }
    };

  const checkUserLoggedIn = async (details: EmployeeDetails) => {
    try {
      const response = await loginUser(details, false).unwrap();
      dispatch(setEmployeeId(response?.data?.employeeId.toString()));
      dispatch(setEmployeeDetailsState(details));
      console.log('User logged in using local storage data');
    } catch (error) {
      console.error('Failed to check user logged in', error);
    }
  };

  useEffect(() => {
    const initialize = async () => {
      // Fetch employee details from local storage
      const details = await getEmployeeDetailsFromLocal();

      // Only update state if details are different
      if (
        details &&
        JSON.stringify(details) !== JSON.stringify(employeeDetails)
      ) {
        setEmployeeDetail(details);
      }

      // Check if user is logged in
      if (details) {
        await checkUserLoggedIn(details);
      }
     getOneTimeLocation();
      setIsInitialized(true);
    };

    initialize();
  }, []);

  useEffect(() => {
    if (
      latestStatusData?.data?.status &&
      !isLatestStatusLoading &&
      latestStatusData?.data?.status !== attendanceData.status // ✅ Avoid redundant updates
    ) {
      console.log('attendanceData after fetching', latestStatusData);
      dispatch(
        setAttendanceData({
          ...attendanceData,
          status: latestStatusData?.data?.status,
        }),
      );
    }
  }, [latestStatusData, dispatch, isLatestStatusLoading, attendanceData]);

  useEffect(() => {
    if (!isInitialized || isLatestStatusLoading) {
      return;
    }

    const currentRoute = navigation.getState().routes?.[0]?.name;

    if (employeeDetails && currentRoute !== 'mainTabNavigator') {
      console.log('Navigating to home');
      navigation.replace('mainTabNavigator');
    } else if (!employeeDetails && currentRoute !== 'loginScreen') {
      console.log('Navigating to login');
      navigation.replace('loginScreen');
    }
  }, [
    isInitialized,
    employeeDetails,
    isLatestStatusLoading,
    navigation,
    latestStatusData,
  ]);

  useEffect(() => {
    console.log('loginResult', loginResult);
    console.log('employeeDetails', employeeDetails);
    console.log('isInitialized', isInitialized);
    console.log('isLatestStatusLoading', isLatestStatusLoading);
    console.log('attendanceData', latestStatusData);
    console.log('isFetchingLocation', isFetchingLocation);
  }, [
    loginResult,
    employeeDetails,
    isInitialized,
    isLatestStatusLoading,
    latestStatusData,
    isFetchingLocation,
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
        <ActivityIndicator size="large" color="#0000ff" />
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
