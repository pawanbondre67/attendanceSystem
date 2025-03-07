import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLatestStatusQuery } from '../../redux/services/attendance/attendanceApiSlice';
import { useLazyLoginQuery } from '../../redux/services/auth/login/LoginApiSlice';
import { useAppDispatch, useAppSelector } from '../../redux/hook/hook';
import { setCheckInOutData as setAttendanceData } from '../../redux/slices/Attendance';
import { setEmployeeId, setEmployeeDetailsState } from '../../redux/slices/Employee';
import LottieView from 'lottie-react-native';
// import useLocation from '../../helper/location';
// import { ActivityIndicator } from 'react-native-paper';
import { setSnackMessage } from '../../redux/slices/snackbarSlice';

interface EmployeeDetails {
  CustomerCode: string;
  UserName: string;
  Password: string;
}

const SplashScreen = ({ navigation }: any) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [employeeDetails, setEmployeeDetail] = useState<EmployeeDetails | null>(null);

  const dispatch = useAppDispatch();

  const attendanceData = useAppSelector((state) => state.attendance.CheckInOutData);

  const { data: latestStatusData, isLoading: isLatestStatusLoading, error: latestStatusError } =
    useLatestStatusQuery({ CustomerCode: employeeDetails?.CustomerCode || '' });

  const [loginUser] = useLazyLoginQuery();
  
  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      try {
        const storedData = await AsyncStorage.getItem('employeeDetails');
        if (storedData) {
          const details = JSON.parse(storedData);
          setEmployeeDetail(details);
          await checkUserLoggedIn(details);
        }
      } catch (error) {
        console.error('Error fetching employee details:', error);
      }
      setIsInitialized(true); // Ensure this runs no matter what
    };
  
    fetchEmployeeDetails();
  }, []);

  useEffect(() => {
    console.log('isLatestStatusLoading==',isLatestStatusLoading)
    console.log('isInitialized==',isInitialized)
    if (!isInitialized || isLatestStatusLoading) return;
    if (employeeDetails) {
        navigation.navigate('mainTabNavigator');
    } else {
      navigation.navigate('loginScreen');
    }
  }, [isInitialized, employeeDetails, isLatestStatusLoading]);
  
  const checkUserLoggedIn = async (details: EmployeeDetails) => {
    try {
      const response = await loginUser(details, false).unwrap();
      dispatch(setEmployeeId(response?.data?.employeeId.toString()));
      dispatch(setEmployeeDetailsState(details));
  
      if (response?.data?.isAppRegisterMandatory) {
        navigation.replace('cameraAuthScreen');
      }
    } catch (error) {
      console.error("Login error:", error);
      dispatch(setSnackMessage({ message: 'Login To get Started', severity: 'info' }));
      setEmployeeDetail(null); // Ensure it redirects to login
    }
  };
  

  useEffect(() => {
    if (employeeDetails) {
      if (latestStatusError) {
        checkUserLoggedIn(employeeDetails);
      }
      if (latestStatusData?.data?.status && !isLatestStatusLoading) {
        dispatch(setAttendanceData({ ...attendanceData, status: latestStatusData.data.status }));
      }
    }
  }, [latestStatusData, latestStatusError, isLatestStatusLoading]);

  

  return (
    <View style={styles.container}>
      <LottieView source={require('../../assets/timeLoader.json')} autoPlay loop style={styles.lottie} />
     
        <Text>Initializing...</Text>
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
