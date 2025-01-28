import {useState} from 'react';
import {checkValidation} from './helper';
import {
  // useAddFCMMutation,
  useLazyLoginQuery,
  // useLoginQuery,
} from '../../redux/services/auth/login/LoginApiSlice';
// import {API_TOKEN, APP_DATA_ENCRYPTION_KEY} from '@env';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../../types/types';
import {useAppDispatch} from '../../redux/hook/hook';
import {
  setEmployeeDetails,
  setEmployeeId,
} from '../../redux/slices/Employee/index';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Errors {
  CustomerCode: string;
  UserName: string;
  Password: string;
}

export interface CustomerData extends Errors {}

const useLogin = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [customerData, setCustomerData] = useState<CustomerData>({
    CustomerCode: 'OTD1000',
    UserName: 'Shivani',
    Password: '1',
  });
  const [errors, setErrors] = useState<Errors>({
    CustomerCode: '',
    UserName: '',
    Password: '',
  });
  const [loginUser, loginResult] = useLazyLoginQuery();
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

  const handleLogin = async () => {
    // console.log('customerData', customerData);
    const validationErrors = checkValidation(customerData);
    if (validationErrors) {
      setErrors(validationErrors);
    } else {
      try {
        let response;
        // console.log('customerData while sending request', customerData);
        try {
          response = await loginUser(customerData, false).unwrap();
          // await registerFCMServices();
          console.log('response', response);
        } catch (err) {
          let errormessage;
          if ((err as any)?.data?.message) {
            errormessage = (err as any).data.message;
          } else if ((err as any)?.error) {
            errormessage = (err as any).error;
          } else if ((err as any)?.status === 500) {
            errormessage = 'server returned with status code 500';
          }
          //   dispatch(setSnackMessage(errormessage));
          console.error('errormessage', errormessage);
        }
        if (response?.data) {
          //   await saveLoginCredintials(customerData);
          dispatch(setEmployeeId(response?.data?.employeeId.toString()));
          dispatch(setEmployeeDetails(customerData));
          await saveEmployeeDetailsToLocal(customerData);

          navigation.navigate(
            // response?.data?.isAppRegistermandatory ? 'camera' : 'home',
            'camera',

          );
        }
      } catch (error: any) {
        if (error) {
          console.log('error', error);
          //   dispatch(setSnackMessage('error while login'));
        }
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
