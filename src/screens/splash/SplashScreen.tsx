import {
  useNavigation,
  NavigationProp,
  CommonActions,
} from '@react-navigation/native';
import {RootStackParamList} from '../../types/types'; // Adjust the path as necessary
import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {useLatestStatusQuery} from '../../redux/services/attendance/attendanceApiSlice';
import {useLazyLoginQuery} from '../../redux/services/auth/login/LoginApiSlice';
import {useAppDispatch, useAppSelector} from '../../redux/hook/hook';
import {setCheckInOutData as setAttendanceData} from '../../redux/slices/Attendance';
import {setEmployeeId,setEmployeeDetails} from '../../redux/slices/Employee/index';

interface EmployeeDetails {
  CustomerCode: string;
  UserName: string;
  Password: string;
}

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

const SplashScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const dispatch = useAppDispatch();
  const {CheckInOutData: attendanceData} = useAppSelector(
    state => state.attendance,
  );

  const [employeeDetails, setEmployeeDetail] =
    useState<EmployeeDetails | null>(null);
  const {data: latestStatusData, isLoading: isLatestStatusLoading} =
    useLatestStatusQuery();
  const [loginUser, loginResult] = useLazyLoginQuery();

  useEffect(() => {
    const initialize = async () => {
      // Fetch employee details from local storage
      const details = await getEmployeeDetailsFromLocal();
      setEmployeeDetail(details);

      // Check if user is logged in
      if (details) {
        await checkUserLoggedIn(details);
      }
    };

    initialize();
  }, []);

  useEffect(() => {
    if (latestStatusData) {
      dispatch(
        setAttendanceData({
          ...attendanceData,
          status: latestStatusData?.data?.status,
        }),
      );
    }
  }, [latestStatusData, dispatch, attendanceData]);

  useEffect(() => {
    console.log(attendanceData); // Log after state update
  }, [attendanceData]);

  useEffect(() => {
    if (employeeDetails && !isLatestStatusLoading) {
      console.log('Navigating to home');
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'home'}],
        }),
      );
    } else if (!employeeDetails && !isLatestStatusLoading) {
      console.log('Navigating to login');
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'register'}],
        }),
      );
    }
  }, [employeeDetails, isLatestStatusLoading, navigation]);

  const checkUserLoggedIn = async (details: EmployeeDetails) => {
    try {
      if (loginResult.data === undefined) {
        const response = await loginUser(details, false).unwrap();
        dispatch(setEmployeeId(response?.data?.employeeId.toString()));
        dispatch(setEmployeeDetails(details));
        console.log('User logged in using local storage data');
      }
    } catch (error) {
      console.error('Failed to check user logged in', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Loading...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SplashScreen;
