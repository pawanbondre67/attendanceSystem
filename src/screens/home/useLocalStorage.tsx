import {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppDispatch } from '../../redux/hook/hook';
import { setEmployeeDetailsState, setEmployeeId } from '../../redux/slices/Employee';
import { setCheckInOutData } from '../../redux/slices/Attendance';
interface CheckInOutData {
  status: string | null;
  checkInTime?: string | null;
  checkOutTime?: string | null;
  date?: string | null;
}

interface EmployeeDetails {
  CustomerCode: string;
  UserName: string;
  Password: string;
  ProfilePic?: string | null;
  EmployeeId?: string | null;
}

const useLocalStorage = ({navigation} : any) => {
  const [employeeDetails, setEmployeeDetails] =
    useState<EmployeeDetails | null>(null);
  const [attendanceData, setAttendanceData] = useState<CheckInOutData | null>(
    null,
  );

  const dispatch = useAppDispatch();

  useEffect(() => {
    const getDataFromLocalStorage = async () => {
      try {
        const empDetails = await AsyncStorage.getItem('employeeDetails');
        const attendanceDataValue = await AsyncStorage.getItem(
          'attendanceData',
        );
        if (empDetails !== null) {
          setEmployeeDetails(JSON.parse(empDetails));
        }
        if (attendanceDataValue !== null) {
          setAttendanceData(JSON.parse(attendanceDataValue));
        }
      } catch (error) {
        console.error('Failed to retrieve data from local storage', error);
      }
    };

    getDataFromLocalStorage();
  }, []);

  const updateEmployeeDetails = async (
    newDetails: Partial<EmployeeDetails>,
  ) => {
    try {
      const updatedDetails = {
        ...employeeDetails,
        ...newDetails,
      } as EmployeeDetails; // Add type assertion here

      setEmployeeDetails(updatedDetails);
      await AsyncStorage.setItem(
        'employeeDetails',
        JSON.stringify(updatedDetails),
      );
      console.log('Employee details updated:', employeeDetails);
      // console.log('Employee details updated:', updatedDetails);
    } catch (error) {
      console.error('Failed to update employee details:', error);
    }
  };

  // Function to delete employeeId from local storage
  const deleteEmployeeDetails = async () => {
    try {
      await AsyncStorage.removeItem('employeeDetails');
      await AsyncStorage.removeItem('attendanceData');
      dispatch(setEmployeeId(''));
      dispatch(setEmployeeDetailsState(null));
      dispatch(setCheckInOutData({ status: null , checkInTime: null, checkOutTime: null, date: null }));
      console.log('employeeId deleted from local storage');
      // Optionally, navigate to another screen or update state
      navigation.replace('loginScreen');
    } catch (error) {
      console.error('Failed to delete employeeId from local storage', error);
    }
  };

  const storeAttendanceData = async (data: any) => {
    try {
      await AsyncStorage.setItem('attendanceData', JSON.stringify(data));
      setAttendanceData(data);
      console.log('Attendance data stored:', data);
    } catch (error) {
      console.error('Error storing attendance data:', error);
    }
  };

  return {
    employeeDetails,
    setEmployeeDetails,
    attendanceData,
    storeAttendanceData,
    updateEmployeeDetails,
    deleteEmployeeDetails,
  };
};

export default useLocalStorage;
