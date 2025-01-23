import {check} from 'react-native-permissions';
import {useCallback, useEffect, useState} from 'react';
import {formatDate} from '../../helper/index';
import useLocation from '../../helper/location';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import DeviceInfo from 'react-native-device-info';
import {useAppDispatch, useAppSelector} from '../../redux/hook/hook';
import NetInfo from '@react-native-community/netinfo';

import {
  useCheckOutMutation,
  useMarkAttendanceMutation,
  useLatestStatusQuery,
} from '../../redux/services/attendance/attendanceApiSlice';

// import {CheckInOutData} from '../../redux/slices/Attendance/index';
import {isIos} from '../../helper/utility';
import {setCheckInOutData as setAttendanceData} from '../../redux/slices/Attendance';

// Define types for state and function parameters
interface CheckInOutData {
  image: string;
  latitude: number | null;
  longitude: number | null;
  showCamera: boolean;
  status: string;
}

interface ErrorState {
  file: string;
  location: string;
}
interface RouteParams {
  type: string;
}
type CheckInOutRouteProp = RouteProp<{params: RouteParams}, 'params'>;

const useCheckInOut = () => {
  const dispatch = useAppDispatch();
  const {currentLatitude, currentLongitude, isFetchingLocation} = useLocation();

  const {CheckInOutData: attendanceData } = useAppSelector(
    state => state.attendance,
  );

  console.log('CheckInOutData', attendanceData);
  const [markAttendance, markAttendanceResult] = useMarkAttendanceMutation();
  const {data: latestStatusData, isLoading, error} = useLatestStatusQuery();



  const [checkOut, checkOutResult] = useCheckOutMutation();
  const route = useRoute<CheckInOutRouteProp>();
  const btnLabel = route.params?.type;
  console.log('btnLabel', btnLabel);
  const navigation = useNavigation();

  const [checkInOutData, setCheckinOutData] = useState<CheckInOutData>({
    image: '',
    latitude: null,
    longitude: null,
    showCamera: true,
    status: btnLabel.toLowerCase(),
  });

  const [errorState, setErrorState] = useState<ErrorState>({
    file: '',
    location: '',
  });

  useEffect(() => {
    if (latestStatusData) {
      console.log('latestStatusData', latestStatusData);
      dispatch(
        setAttendanceData({
          ...attendanceData,
          status: latestStatusData.data.status,
        }),
      );
    }
  } , [latestStatusData]);
  console.log('only after mark attendace data is updated' ,attendanceData);

  useEffect(() => {
    if (!checkInOutData.latitude || !checkInOutData.longitude) {
      setCheckinOutData(prevData => ({
        ...prevData,
        currentCoordinates: {
          longitude: currentLongitude,
          latitude: currentLatitude,
        },
      }));
    }
  }, [
    currentLatitude,
    currentLongitude,
    checkInOutData.latitude,
    checkInOutData.longitude,
  ]);

  console.log('checkout result data', checkOutResult);
  console.log('after marking attednase resp data', markAttendanceResult);

  const generateCheckinOutPayload = async () => {
    try {
      const deviceName = await DeviceInfo.getDeviceName();
      const deviceIp = await DeviceInfo.getIpAddress();
      const timestamp = new Date().getTime();
      const status = btnLabel.toLowerCase();
      const selfieName = `selfie_${timestamp}_${btnLabel.toLowerCase()}.jpg`;
      const currentDate = formatDate(new Date());
      const currentLat = checkInOutData.latitude;
      const currentLong = checkInOutData.longitude;
      const payload: any = {
        status: status === 'checkin' ? 'in' : 'inout',
        mip: deviceIp,
        mid: deviceName,
        selfie: checkInOutData?.image
          ? {
              uri: isIos
                ? checkInOutData?.image
                : `file://${checkInOutData?.image}`,
              type: 'image/jpeg',
              name: selfieName,
            }
          : null,
        // batteryStatus: (await DeviceInfo.getBatteryLevel()) * 100,
      };
      if (status === 'checkin') {
        payload.inDate = currentDate;
        payload.inLat = currentLat;
        payload.inLong = currentLong;
      } else if (status === 'checkout') {
        payload.outDate = currentDate;
        payload.outLat = currentLat;
        payload.outLong = currentLong;
      }

      return payload;
    } catch (err) {
      console.error('Error generating payload:', error);
      throw error;
    }
  };

  useEffect(() => {
    if (
      markAttendanceResult?.isSuccess &&
      markAttendanceResult?.data?.message
    ) {
      dispatch(
        setAttendanceData({
          ...attendanceData,
          // inTime: markAttendanceResult.data.data.inTime,
          status: markAttendanceResult.data.data.status,
        }),
      );
      navigation.replace('home');
    }

    if (
      markAttendanceResult?.isError &&
      markAttendanceResult?.error?.data?.message
    ) {
      console.error(
        'Error marking attendance:',
        markAttendanceResult.error.data.message,
      );
    }
    if (checkOutResult?.isSuccess && checkOutResult?.data?.message) {
      dispatch(
        setAttendanceData({
          ...attendanceData,
          // outTime: markAttendanceResult.data.data.outTime,
          status: markAttendanceResult.data.data.status,
        }),
      );
      navigation.replace('home');
    }
    if (checkOutResult?.isError && checkOutResult?.error?.data?.message) {
      console.error('Error checking out:', checkOutResult.error.data.message);
    }
  }, [markAttendanceResult, checkOutResult]);

  const updateCheckInOutData = (newData: Partial<CheckInOutData>) => {
    setCheckinOutData(prevData => ({
      ...prevData,
      ...newData,
    }));
  };

  // console.log('markAttendanceResult', markAttendanceResult);

  const generateErrorState = (checkInOutData: CheckInOutData) => {
    const errors: Partial<ErrorState> = {};

    // if (checkInOutData.selectedLocation.locationId == null) {
    //   errors.location = 'Please select a location.';
    // }

    if (!checkInOutData.image) {
      const noSelfieErrorMessage =
        'Please capture and upload your selfie to mark attendance.';
      errors.file = noSelfieErrorMessage;
    }

    return errors;
  };

  const onSubmit = async () => {
    const errors = generateErrorState(checkInOutData);
    setErrorState(errors as ErrorState);
    if (Object.keys(errors).length > 0) {
      console.log('errors', errors);
      return;
    } else {
      try {
        const payload = await generateCheckinOutPayload();
        console.log(payload);
        // Check network connectivity
        NetInfo.fetch().then(async state => {
          if (state.isConnected) {
            // If connected, hit API request to backend
            const status = btnLabel.toLowerCase();
            if (status === 'checkin') {
              markAttendance(payload);
            } else if (status === 'checkout') {
              console.log('checkout Payload', payload);
              checkOut(payload);
            }
          } else {
            // If not connected, hit SQL request
            try {
              // await saveAttendance(payload);
              console.log('attendance saved ', payload);
              // dispatch(setSnackMessage('Attendance saved offline'));
            } catch (innerError) {
              console.error('Error saving attendance:', innerError);
            }
          }
        });
      } catch (err) {
        console.error('Error submitting attendance:', err);
      }
    }
  };

  const onPhotoCapture = (result: string) => {
    console.log('result', result);
    updateCheckInOutData({image: result});
    updateCheckInOutData({showCamera: false});
  };

  const pickImage = useCallback(async () => {
    // try {
    //   const result = await ImagePicker.openCamera({
    //     width: 300,
    //     height: 400,
    //   });
    //   updateCheckInOutData({image: result});
    // } catch (err) {
    //   console.log('err', err);
    // }
    updateCheckInOutData({showCamera: true});
  }, []);

  const proceedMarkAttendance = async () => {
    try {
      const payload = await generateCheckinOutPayload();
      console.log('payload', payload);
      NetInfo.fetch().then(async state => {
        if (state.isConnected) {
          // If connected, hit API request to backend
          const status = btnLabel.toLowerCase();
          if (status === 'checkin') {
            markAttendance(payload);
          } else if (status === 'checkout') {
            checkOut(payload);
          }
        } else {
          // If not connected, hit SQL request
          try {
            // const resp = await saveAttendance(payload);
            console.log('response');
            // dispatch(setSnackMessage('Attendance saved offline'));
          } catch (error) {
            console.error('Error saving attendance:', error);
            // Handle error while saving to SQLite
            // dispatch(setSnackMessage('Error saving attendance offline'));
          }
        }
      });
    } catch (error) {
      console.error('Error proceeding with attendance:', error);
    }
  };

  return {
    checkInOutData,
    updateCheckInOutData,
    onSubmit,
    errorState,
    pickImage,
    btnLabel,
    isFetchingLocation,
    markAttendanceResult,
    proceedMarkAttendance,
    onPhotoCapture,
    currentLatitude,
    currentLongitude,
  };
};

export default useCheckInOut;
