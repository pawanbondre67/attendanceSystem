// import {
//   useNavigation,
//   NavigationProp,
//   CommonActions,
// } from '@react-navigation/native';
// import {RootStackParamList} from '../../types/types'; // Adjust the path as necessary
// import React, {useEffect, useState} from 'react';
// import {View, Text, StyleSheet} from 'react-native';

// import AsyncStorage from '@react-native-async-storage/async-storage';
// import {useLatestStatusQuery} from '../../redux/services/attendance/attendanceApiSlice';
// import {useAppDispatch, useAppSelector} from '../../redux/hook/hook';
// import {setCheckInOutData as setAttendanceData} from '../../redux/slices/Attendance';

// interface EmployeeDetails {
//   CustomerCode: string;
//   UserName: string;
//   Password: string;
// }

// const getEmployeeDetailsFromLocal = async (): Promise<EmployeeDetails | null> => {
//   try {
//     const jsonValue = await AsyncStorage.getItem('employeeDetails');
//     return jsonValue != null ? JSON.parse(jsonValue) : null;
//   } catch (error) {
//     console.error('Failed to retrieve employee details from local storage', error);
//     return null;
//   }
// };

// const SplashScreen = () => {
//   const dispatch = useAppDispatch();
//   const {data: latestStatusData, isLoading, error} = useLatestStatusQuery();
//   console.log('latestStatusData', latestStatusData);
//   const {CheckInOutData: attendanceData} = useAppSelector(
//     state => state.attendance,
//   );
//   const navigation = useNavigation<NavigationProp<RootStackParamList>>();

//   const [employeeDetails, setEmployeeDetails] = useState<EmployeeDetails | null>(null);

//   useEffect(() => {
//     const fetchEmployeeDetails = async () => {
//       const details = await getEmployeeDetailsFromLocal();
//       setEmployeeDetails(details);
//     };

//     fetchEmployeeDetails();

//     if (latestStatusData) {
//       console.log('latestStatusData', latestStatusData);
//       dispatch(
//         setAttendanceData({
//           ...attendanceData,
//           status: latestStatusData.data.status,
//         }),
//       );
//     }
//   }, [latestStatusData, dispatch, attendanceData]);

//   console.log(attendanceData);

//   // useEffect(() => {
//   //   const fetchEmployeeId = async () => {
//   //     try {
//   //       const id = await AsyncStorage.getItem('employeeId');
//   //       console.log('employee id from local storage', id);
//   //       setEmployeeId(id);
//   //     } catch (error) {
//   //       console.error('Failed to fetch employee id from local storage', error);
//   //     }
//   //   };

//   //   fetchEmployeeId();
//   // }, []);

//   useEffect(() => {
//     if (employeeDetails) {
//       console.log('Navigating to home');
//       // navigation.replace('home');
//       navigation.dispatch(
//         CommonActions.reset({
//           index: 0,
//           routes: [{name: 'home'}],
//         }),
//       );
//     } else {
//       console.log('Navigating to register');
//       // navigation.replace('register');
//       navigation.dispatch(
//         CommonActions.reset({
//           index: 0,
//           routes: [{name: 'register'}],
//         }),
//       );
//     }
//   }, [navigation , employeeId]);

//   return (
//     <View style={styles.container}>
//       <Text>Loading...</Text>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });

// export default SplashScreen;

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
import {useAppDispatch, useAppSelector} from '../../redux/hook/hook';
import {setCheckInOutData as setAttendanceData} from '../../redux/slices/Attendance';

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

  const [employeeDetails, setEmployeeDetails] =
    useState<EmployeeDetails | null>(null);
  const {data: latestStatusData, isLoading: isLatestStatusLoading} =
    useLatestStatusQuery();

  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      const details = await getEmployeeDetailsFromLocal();
      setEmployeeDetails(details);
    };

    fetchEmployeeDetails();
    if (latestStatusData) {
      console.log('latestStatusData', latestStatusData);
      dispatch(
        setAttendanceData({
          ...attendanceData,
          status: latestStatusData.data.status,
        }),
      );
    }
  }, [latestStatusData, dispatch, attendanceData]);

  console.log(attendanceData);

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
      console.log('Navigating to register');
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'register'}],
        }),
      );
    }
  }, [employeeDetails, isLatestStatusLoading, navigation]);

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
