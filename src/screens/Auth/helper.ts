import {CustomerData, Errors} from './useLogin';

const checkValidation = (customerData: CustomerData) => {
  const newErrors: Errors = {CustomerCode: '', UserName: '', Password: ''};

  if (!customerData.CustomerCode) {
    newErrors.CustomerCode = 'Customer Code is required';
  }
  if (!customerData.UserName) {
    newErrors.UserName = 'Login ID is required';
  }
  if (!customerData.Password) {
    newErrors.Password = 'Password is required';
  }

  if (Object.values(newErrors).some(value => value)) {
    return newErrors;
  }
  return null;
};

export {checkValidation};
