// import NetInfo from '@react-native-community/netinfo';
// import DeviceInfo from 'react-native-device-info';
// // import {useAppDispatch, useAppSelector} from '../../redux/hook/hook';
// import {useRegisterMutation} from '../../redux/services/attendance/attendanceApiSlice';

// // import {isIos} from '../../helper/utility';
// import {useEffect, useState} from 'react';
// import { useAppSelector } from '../../redux/hook/hook';

// interface images {
//   straight: string;
//   left: string;
//   right: string;
//   InPhoneImage: string;
//   [key: string]: string;
// }

// interface ErrorState {
//   file: string;
// }

// const useCameraAuth = () => {
//   //   const dispatch = useAppDispatch();
//   const  {employeeId}  = useAppSelector(state => state.employee);
//   const [register, registerResult] = useRegisterMutation();

//   const [errorState, setErrorState] = useState<ErrorState>({
//     file: '',
//   });

//   const [images, setImages] = useState<images>({
//     straight: '',
//     left: '',
//     right: '',
//     InPhoneImage: '',
//   });

//   // useEffect(() => {
//   //   console.log('Updated images:', images);
//   // }, [images]);

//   console.log('registerResult in camera registeration', registerResult);

//   //   const updateImages = (newData: Partial<images>) => {
//   //     setImages(prevData => ({
//   //       ...prevData,
//   //     }));
//   //   };

//   const generateRegisterPayload = async () => {
//     try {
//       const deviceName = await DeviceInfo.getDeviceName();
//       const deviceIp = await DeviceInfo.getIpAddress();
//       const imei = await DeviceInfo.getBuildId();
//       // const timestamp = new Date().getTime();

//       const payload: any = {
//         mid: deviceName,
//         mip: deviceIp,
//         EmployeeMaster_Fid: employeeId,
//         IMEINumber  : imei ,
//         AppImage_I: `file://${images.straight}`,
//         AppImage_II: `file://${images.left}`,
//         AppImage_III: `file://${images.right}`,
//         InPhoneImage: `file://${images.InPhoneImage}`,
//       };

//       console.log('register payload', payload);
//       return payload;
//     } catch (err) {
//       console.error('Error generating payload:', err);
//       throw err;
//     }
//   };

// const generateErrorState = () => {
//   const errors: Partial<ErrorState> = {};

//   if (!images) {
//     const noSelfieErrorMessage =
//       'Please capture and upload your selfie to mark attendance.';
//     errors.file = noSelfieErrorMessage;
//   }

//   return errors;
// };

//   const onsubmit = async () => {
//     const errors = generateErrorState();
//     setErrorState(errors as ErrorState);
//     if (Object.keys(errors).length > 0) {
//       console.log('errors on click onsubmit', errors);
//       return;
//     } else {
//       try {
//         const payload = await generateRegisterPayload();
//         console.log(payload);
//         // Check network connectivity
//         NetInfo.fetch().then(async state => {
//           if (state.isConnected) {
//             // If connected, hit API request to backend
//            await register(payload);
//           } else {
//             console.log('register Payload  &&  error', payload);
//           }
//         });
//       } catch (err) {
//         console.error('Error submitting images:', err);
//       }
//     }
//   };
//   return {onsubmit, images, setImages, errorState};
// };

// export default useCameraAuth;

import {useState} from 'react';
import RNFS from 'react-native-fs';

import {useNavigation, CommonActions} from '@react-navigation/native';
import DeviceInfo from 'react-native-device-info';
import NetInfo from '@react-native-community/netinfo';
import {useRegisterMutation} from '../../redux/services/attendance/attendanceApiSlice';
import {useAppSelector} from '../../redux/hook/hook';
// import { setCheckInOutData as setAttendanceData } from '../../redux/slices/Attendance';
// import { setEmployeeId } from '../../redux/slices/Employee';

interface ErrorState {
  file: string;
}

interface Images {
  straight: string;
  left: string;
  right: string;
  InPhoneImage: string;
}

const useCameraAuth = () => {
  const [errorState, setErrorState] = useState<ErrorState>({file: ''});
  const [images, setImages] = useState<Images>({
    straight: '',
    left: '',
    right: '',
    InPhoneImage: '',
  });

  const navigation = useNavigation();
  // const dispatch = useAppDispatch();
  const {employeeId, employeeDetails} = useAppSelector(state => state.employee);
  const [register, {isLoading, error}] = useRegisterMutation();

  // // console.log('registerResult in camera registration', registerResult);

  const generateRegisterPayload = async () => {
    try {
      const deviceName = await DeviceInfo.getDeviceName();
      const deviceIp = await DeviceInfo.getIpAddress();
      const imei = await DeviceInfo.getBuildId();
      

      // Verify file access
      for (const key in images) {
        const filePath = images[key];
        const fileExists = await RNFS.exists(filePath);
        if (!fileExists) {
          throw new Error(`File not found: ${filePath}`);
        }
      }
      const payload: any = {
        mid: deviceName,
        mip: deviceIp,
        EmployeeMaster_Fid: employeeId,
        IMEINumber: imei,
        CustomerCode: employeeDetails?.CustomerCode,
        AppImage_I: {
          uri: `file://${images.straight}`,
          name: 'straight.jpg',
          filename: 'straight.jpg',
          type: 'image/jpeg',
        },
        AppImage_II: {
          uri: `file://${images.left}`,
          name: 'left.jpg',
          filename: 'left.jpg',
          type: 'image/jpeg',
        },
        AppImage_III: {
          uri: `file://${images.right}`,
          name: 'right.jpg',
          filename: 'right.jpg',
          type: 'image/jpeg',
        },
        InPhoneImage: {
          uri: `file://${images.InPhoneImage}`,
          name: 'InPhoneImage.jpg',
          filename: 'InPhoneImage.jpg',
          type: 'image/jpeg',
        },
      };

      console.log('register payload', payload.AppImage_I);
      return payload;
    } catch (err) {
      console.error('Error generating payload:', err);
      throw err;
    }
  };

  const generateErrorState = () => {
    const errors: Partial<ErrorState> = {};

    if (!images) {
      const noSelfieErrorMessage =
        'Please capture and upload your selfie to mark attendance.';
      errors.file = noSelfieErrorMessage;
    }

    return errors;
  };

  //       const response = await axios.post('http://example.com/Register', formData, {
  //         headers: {
  //           'Content-Type': 'multipart/form-data',
  //         },
  //       });
  //       console.log('Response:', response);
  //     } catch (error) {
  //       if (axios.isAxiosError(error)) {
  //         console.error('Axios error message:', error.message);
  //         console.error('Axios error config:', error.config);
  //         if (error.response) {
  //           console.error('Axios error response data:', error.response.data);
  //           console.error('Axios error response status:', error.response.status);
  //           console.error('Axios error response headers:', error.response.headers);
  //         } else if (error.request) {
  //           console.error('Axios error request:', error.request);
  //         }
  //       } else {
  //         console.error('Unexpected error:', error);
  //       }
  //     }
  //   };

  const onsubmit = async () => {
    const errors = generateErrorState();
    setErrorState(errors as ErrorState);
    if (Object.keys(errors).length > 0) {
      console.log('errors on click onsubmit', errors);
      return;
    } else {
      try {
        const payload = await generateRegisterPayload();
        console.log(payload);
        // Check network connectivity
        NetInfo.fetch().then(async state => {
          if (state.isConnected) {
            try {
              // If connected, hit API request to backend
              const response = await register(payload).unwrap();
              console.log('API Response:', response);
              !isLoading && !error
                ? navigation.dispatch(
                    CommonActions.reset({
                      index: 0,
                      routes: [{name: 'home'}],
                    }),
                  )
                : null;
            } catch (apiError) {
              console.error('API Error:', apiError);
              if ((apiError as Error).message === 'Network request failed') {
                console.error(
                  'Network request failed. Please check your internet connection.',
                );
              }
            }
          } else {
            console.log('register Payload  &&  error', payload, error);
          }
        });
      } catch (err) {
        console.error('Error submitting images:', err);
      }
    }
  };

  return {onsubmit, images, setImages};
};

export default useCameraAuth;
