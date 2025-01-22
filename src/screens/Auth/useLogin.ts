import {useEffect, useState} from 'react';
import {checkValidation} from './helper';
import {
  useAddFCMMutation,
  useLazyLoginQuery,
  useLoginQuery,
} from '../../redux/services/auth/login/LoginApiSlice';
import {API_TOKEN, APP_DATA_ENCRYPTION_KEY} from '@env';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../../types/types';
import {useAppDispatch} from '../../redux/hook/hook';
import {setEmployeeDetails} from '../../redux/slices/Employee/index';
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
    CustomerCode: '',
    UserName: '',
    Password: '',
  });
  const [errors, setErrors] = useState<Errors>({
    CustomerCode: '',
    UserName: '',
    Password: '',
  });
  const [loginUser, loginResult] = useLazyLoginQuery();
  const [employeeId, setEmployeeID] = useState('');

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

  const saveEmployeeIdToLocal = async (id: string) => {
    console.log('employee id', id);
    setEmployeeID(id);
    await AsyncStorage.setItem('employeeId', id);
    AsyncStorage.getItem('employeeId').then(res => {
      console.log('user saved in local storage', res);
    }
    );
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
          if (err?.data?.message) {
            errormessage = err.data.message;
          } else if (err?.error) {
            errormessage = err.error;
          } else if (err?.status == 500) {
            errormessage = 'server returned with status code 500';
          }
          //   dispatch(setSnackMessage(errormessage));
          console.log('errormessage', errormessage);
        }
        if (response?.data) {
          //   await saveLoginCredintials(customerData);
          await saveEmployeeIdToLocal(response?.data?.employeeId.toString());

          //   const details = await getUserDetails(
          //     response?.data?.employeeId.toString(),
          //   ).unwrap();
          //  console.log('userDetails', details);
          //   await saveEmployeeDetails(response?.data?.employeeId, details.data);
          //   dispatch(setEmployeeDetails(details?.data));
          // dispatch(setPinMode(PinCodeT.Modes.Set));
        
          navigation.navigate(response?.data?.isAppRegistermandatory ? 'camera' : 'home');
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
