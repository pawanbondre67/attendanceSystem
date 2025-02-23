import {useState} from 'react';
import {checkValidation} from './helper';
import {
  // useAddFCMMutation,
  useLazyLoginQuery,
  // useLoginQuery,
} from '../../redux/services/auth/login/LoginApiSlice';
// import {API_TOKEN, APP_DATA_ENCRYPTION_KEY} from '@env';
// import {NavigationProp, useNavigation} from '@react-navigation/native';
// import {RootStackParamList} from '../../types/types';
import {useAppDispatch} from '../../redux/hook/hook';
import {
  setEmployeeDetailsState,
  setEmployeeId,
} from '../../redux/slices/Employee/index';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {setSnackMessage} from '../../redux/slices/snackbarSlice';

export interface Errors {
  CustomerCode: string;
  UserName: string;
  Password: string;
  EmployeeId?: string;
}

export interface CustomerData extends Errors {}

const useLogin = () => {
  // const navigation = useNavigation<NavigationProp<RootStackParamList>>();
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
  const [loginUser, loginResult] = useLazyLoginQuery();
  // const {updateEmployeeDetails} = useLocalStorage();
  // const [employeeId, setEmployeeID] = useState('');

  const dispatch = useAppDispatch();
  const resetErrors = (newData: Partial<CustomerData>) => {
    const updatedErrors = {} as Errors;
    Object.keys(newData).forEach(key => {
      updatedErrors[key as keyof Errors] = '';
    });
    setErrors(updatedErrors);
  };

  const updateCustomerData = (newData: Partial<CustomerData>) => {
    resetErrors(newData);
    setCustomerData(prevData => ({...prevData, ...newData}));
  };

  const saveEmployeeDetailsToLocal = async (employeeDetails: CustomerData) => {
    // setEmployeeID(employeeDetails.UserName);
    try {
      const jsonValue = JSON.stringify(employeeDetails);
      await AsyncStorage.setItem('employeeDetails', jsonValue);
      console.log('Employee details saved to local storage');
    } catch (error) {
      console.error('Failed to save employee details to local storage', error);
    }
  };

  // const updateEmployeeDetails = async (  newDetails: Partial<CustomerData>,) => {
  //   try {
  //     const updatedDetails = {
  //       ...customerData,
  //       ...newDetails,
  //     } as CustomerData; // Add type assertion here

  //     await updateEmployeeDetails(updatedDetails);
  //     console.log('Employee details updated:', updatedDetails);
  //   } catch (error) {
  //     console.error('Failed to update employee details:', error);
  //   }
  // };

  const handleLogin = async (navigation: any) => {
    const validationErrors = checkValidation(customerData);
    if (validationErrors) {
      setErrors(validationErrors);
    } else {
      try {
        let response;
        try {
          response = await loginUser(customerData, false).unwrap();
          console.log('API Response:', response);
        } catch (err) {
          let errormessage;
          if ((err as any)?.data?.message) {
            errormessage = (err as any).data.message;
          } else if ((err as any)?.error) {
            errormessage = (err as any).error;
          } else if ((err as any)?.status === 500) {
            errormessage = 'Server returned with status code 500';
          }
          dispatch(setSnackMessage({
            message: errormessage,
            severity: 'error',
          }));
          // console.error('Login Error:', errormessage);
        }

        if (response?.data) {
          dispatch(setEmployeeId(response?.data?.employeeId.toString()));
          dispatch(setEmployeeDetailsState(customerData));
          await saveEmployeeDetailsToLocal(customerData);

          navigation.replace(
            response.data.isAppRegisterMandatory
              ? 'cameraAuthScreen'
              : 'mainTabNavigator',
          );
        }
      } catch (error: any) {
        console.error('Login Failed:', error);
        dispatch(
          setSnackMessage({
            message: 'Error while logging in',
            severity: 'error',
          }),
        );
      }
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
