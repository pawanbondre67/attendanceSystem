import NetInfo from '@react-native-community/netinfo';
import DeviceInfo from 'react-native-device-info';
// import {useAppDispatch, useAppSelector} from '../../redux/hook/hook';
import {useRegisterMutation} from '../../redux/services/attendance/attendanceApiSlice';

// import {isIos} from '../../helper/utility';
import {useEffect, useState} from 'react';

interface images {
  straight: string;
  left: string;
  right: string;
  InPhoneImage: string;
  [key: string]: string;
}

interface ErrorState {
  file: string;
}

const useCameraAuth = () => {
  //   const dispatch = useAppDispatch();
  const [register, registerResult] = useRegisterMutation();

  const [errorState, setErrorState] = useState<ErrorState>({
    file: '',
  });

  const [images, setImages] = useState<images>({
    straight: '',
    left: '',
    right: '',
    InPhoneImage: '',
  });

  useEffect(() => {
    console.log('Updated images:', images);
  }, [images]);

  console.log('registerResult in camera registeration', registerResult);

  //   const updateImages = (newData: Partial<images>) => {
  //     setImages(prevData => ({
  //       ...prevData,
  //     }));
  //   };

  const generateRegisterPayload = async () => {
    try {
      const deviceName = await DeviceInfo.getDeviceName();
      const deviceIp = await DeviceInfo.getIpAddress();
      // const timestamp = new Date().getTime();

      const payload: any = {
        mid: deviceName,
        mip: deviceIp,
        EmployeeMaster_Fid: '1',
        IMEINumber: '1234567890',
        AppImage_I: `file:/${images.straight}`,
        AppImage_II: `file:/${images.left}`,
        AppImage_III: `file:/${images.right}`,
        InPhoneImage: `file:/${images.InPhoneImage}`,
      };

      console.log('register payload', payload);
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

  const onsubmit = async () => {
    const errors = generateErrorState();
    setErrorState(errors as ErrorState);
    if (Object.keys(errors).length > 0) {
      console.log('errors', errors);
      return;
    } else {
      try {
        const payload = await generateRegisterPayload();
        console.log(payload);
        // Check network connectivity
        NetInfo.fetch().then(async state => {
          if (state.isConnected) {
            // If connected, hit API request to backend
            register(payload);
          } else {
            console.log('register Payload  &&  error', payload);
          }
        });
      } catch (err) {
        console.error('Error submitting images:', err);
      }
    }
  };
  return {onsubmit, images, setImages, errorState};
};

export default useCameraAuth;
