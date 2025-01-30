import {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
}

const useLocalStorage = () => {
  const [employeeDetails, setEmployeeDetails] = useState<EmployeeDetails | null>(
    null,
  );
  const [attendanceData, setAttendanceData] = useState<CheckInOutData | null>(null);

  useEffect(() => {
    const getDataFromLocalStorage = async () => {
      try {
        const empDetails = await AsyncStorage.getItem('employeeDetails');
        const attendanceDataValue = await AsyncStorage.getItem('attendanceData');
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

  const storeAttendanceData = async (data: any) => {
    try {
      await AsyncStorage.setItem('attendanceData', JSON.stringify(data));
      setAttendanceData(data);
      console.log('Attendance data stored:', data);
    } catch (error) {
      console.error('Error storing attendance data:', error);
    }
  };

  return {employeeDetails, attendanceData , storeAttendanceData};
};

export default useLocalStorage;
