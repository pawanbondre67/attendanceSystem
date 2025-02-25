import {useState, useEffect} from 'react';
import {checkValidation} from './helper';
import {useLazyLoginQuery} from '../../redux/services/auth/login/LoginApiSlice';
import {useAppDispatch, useAppSelector} from '../../redux/hook/hook';
import {
  setEmployeeDetailsState,
  setEmployeeId,
} from '../../redux/slices/Employee/index';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {setSnackMessage} from '../../redux/slices/snackbarSlice';
import {setCheckInOutData as setAttendanceData} from '../../redux/slices/Attendance';
import {useLatestStatusQuery} from '../../redux/services/attendance/attendanceApiSlice';

// Constants for navigation and message severity
const NAVIGATION_SCREENS = {
  CAMERA_AUTH: 'cameraAuthScreen',
  MAIN_TAB: 'mainTabNavigator',
};

// Interface for CustomerData
export interface CustomerData {
  CustomerCode: string;
  UserName: string;
  Password: string;
  EmployeeId?: string;
}

// Type for Errors (partial CustomerData)
export type Errors = Partial<CustomerData>;

const useLogin = () => {
// State for customer data and errors
const [customerData, setCustomerData] = useState<CustomerData>({
  CustomerCode: '',
  UserName: '',
  Password: '',
  EmployeeId: '',
});
const [errors, setErrors] = useState<Errors>({
  CustomerCode: '',
  UserName: '',
  Password: '',
});

// Redux hooks
const dispatch = useAppDispatch();
const [loginUser, loginResult] = useLazyLoginQuery();

const { CheckInOutData: attendanceData } = useAppSelector((state) => state.attendance);

// Fetch latest status
const { data: latestStatusData, isLoading: isLatestStatusLoading, refetch: refetchLatestStatus } = useLatestStatusQuery({
  CustomerCode: customerData.CustomerCode || '',
});

  // Reset errors when customer data changes
  const resetErrors = (newData: Partial<CustomerData>) => {
    const updatedErrors = {} as Errors;
    Object.keys(newData).forEach((key) => {
      updatedErrors[key as keyof Errors] = '';
    });
    setErrors((prevErrors) => ({ ...prevErrors, ...updatedErrors }));
  };

  // Update customer data and reset errors
  const updateCustomerData = (newData: Partial<CustomerData>) => {
    resetErrors(newData);
    setCustomerData((prevData) => ({ ...prevData, ...newData }));
  };

  // Save employee details to local storage
  const saveEmployeeDetailsToLocal = async (employeeDetails: CustomerData) => {
    try {
      const jsonValue = JSON.stringify(employeeDetails);
      await AsyncStorage.setItem('employeeDetails', jsonValue);
      console.log('Employee details saved to local storage');
    } catch (error) {
      console.error('Failed to save employee details to local storage', error);
      throw error; // Propagate the error
    }
  };


  // useEffect(() => {
  //   if (latestStatusData?.data?.status && !isLatestStatusLoading) {
  //     console.log('Dispatching Latest Status Data:', latestStatusData);
  //     dispatch(
  //       setAttendanceData({
  //         ...attendanceData,
  //         status: latestStatusData.data.status,
  //       }),
  //     );
  //   }
  // }, [latestStatusData?.data?.status, isLatestStatusLoading, dispatch]);

 // Handle login logic
 const handleLogin = async (navigation : any) => {
  const validationErrors = checkValidation(customerData);
  if (validationErrors) {
    setErrors(validationErrors);
    return; // Exit early if validation fails
  }

  try {
   // Step 1: Perform login
   const response = await loginUser(customerData, false).unwrap();
   console.log('API Response:', response);

   if (response?.data) {
     // Step 2: Update employee details in Redux and local storage
     dispatch(setEmployeeId(response.data.employeeId.toString()));
     dispatch(setEmployeeDetailsState(customerData));
     await saveEmployeeDetailsToLocal(customerData);

     // Step 3: Fetch latest status data
     const latestStatusResponse = await refetchLatestStatus().unwrap();
     console.log('Latest Status Data:', latestStatusResponse);

     // Step 4: Update attendance data in Redux
     if (latestStatusResponse?.data?.status) {
       dispatch(
         setAttendanceData({
           ...attendanceData,
           status: latestStatusResponse.data.status,
         }),
       );
     }

     // Step 5: Navigate to the appropriate screen
     if (response.data.isAppRegisterMandatory) {
       navigation.replace(NAVIGATION_SCREENS.CAMERA_AUTH);
     } else {
       navigation.replace(NAVIGATION_SCREENS.MAIN_TAB);
     }
   }
 } catch (error: any) {
    console.error('Login Failed:', error);
    const errorMessage =
      error?.data?.message || error?.error || 'Error while logging in';
    dispatch(
      setSnackMessage({
        message: errorMessage,
        severity: 'error',
      }),
    );
  }
};

  return {
    customerData,
    updateCustomerData,
    errors,
    handleLogin,
    loginResult,
  };
};

export default useLogin;
