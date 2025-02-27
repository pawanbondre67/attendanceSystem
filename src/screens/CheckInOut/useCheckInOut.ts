import RNFS from 'react-native-fs';
import {useCallback, useEffect, useState} from 'react';
import {formatDate} from '../../helper/index';
import {
  CommonActions,
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import DeviceInfo from 'react-native-device-info';
import {useAppDispatch, useAppSelector} from '../../redux/hook/hook';
import NetInfo from '@react-native-community/netinfo';

import {
  useCheckOutMutation,
  useMarkAttendanceMutation,
  // useLatestStatusQuery,
} from '../../redux/services/attendance/attendanceApiSlice';
import {isIos} from '../../helper/utility';
import {setCheckInOutData as setAttendanceData} from '../../redux/slices/Attendance';
import useLocalStorage from '..//home/useLocalStorage';
import {setSnackMessage} from '../../redux/slices/snackbarSlice';

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

const useCheckInOut = ({
  currentLatitude,
  currentLongitude,
}: {
  currentLatitude: number | null;
  currentLongitude: number | null;
}) => {
  const dispatch = useAppDispatch();

  console.log('currentLat', currentLatitude);
  console.log('currentLong', currentLongitude);
  const {storeAttendanceData} = useLocalStorage({});

  const {CheckInOutData: attendanceData} = useAppSelector(
    state => state.attendance,
  );

  const [markAttendance, markAttendanceResult] = useMarkAttendanceMutation();
  // const [isMarkingAttendance, setIsMarkingAttendance] = useState(false);
  // const {data: latestStatusData, isLoading, error} = useLatestStatusQuery();
  console.log('markAttendanceResult', markAttendanceResult);

  const [checkOut, checkOutResult] = useCheckOutMutation();
  const route = useRoute<CheckInOutRouteProp>();
  const btnLabel = route.params?.type;
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
    if (!checkInOutData.latitude || !checkInOutData.longitude) {
      setCheckinOutData(prevData => ({
        ...prevData,
        longitude: currentLongitude,
        latitude: currentLatitude,
      }));
    }
  }, [
    currentLatitude,
    currentLongitude,
    checkInOutData.latitude,
    checkInOutData.longitude,
  ]);

  const {currentTime, currentDate, currentTime12} = formatDate();
  const {employeeId, employeeDetailsState} = useAppSelector(
    state => state.employee,
  );

  const generateCheckinOutPayload = async () => {
    try {
      const deviceName = await DeviceInfo.getDeviceName();
      const deviceIp = await DeviceInfo.getIpAddress();
      const timestamp = new Date().getTime();
      const status = btnLabel.toLowerCase();
      const selfieName = `selfie_${timestamp}_${btnLabel.toLowerCase()}.jpg`;
      // Validate image path
      const filePath = checkInOutData?.image;
      if (!filePath) {
        throw new Error('Image path is null or undefined');
      }

      // Verify file access
      const fileExists = await RNFS.exists(filePath);
      if (!fileExists) {
        throw new Error(`File not found: ${filePath}`);
      }

      if (currentLatitude === null || currentLongitude === null) {
        // throw new Error('Location not fetched');
        return dispatch(setSnackMessage({
          message: 'Location not fetched, please try again',
          severity: 'warning',
        }));
      }
      const payload: any = {
        status: status === 'checkin' ? 'in' : 'inout',
        mip: deviceIp,
        mid: deviceName,
        employeeMaster_Fid: employeeId,
        CustomerCode: employeeDetailsState?.CustomerCode,
      };
      if (status === 'checkin') {
        payload.inDate = currentDate;
        payload.inTime = currentTime;
        payload.inLat = currentLatitude
          ? currentLatitude
          : checkInOutData.latitude;
        payload.inLong = currentLongitude
          ? currentLongitude
          : checkInOutData.longitude;

        payload.inImage = checkInOutData?.image
          ? {
              uri: isIos ? filePath : `file://${filePath}`,
              name: selfieName,
              filename: selfieName,
              type: 'image/jpeg',
            }
          : null;
      } else if (status === 'checkout') {
        payload.outDate = currentDate;
        payload.outTime = currentTime;
        payload.outLat = currentLatitude
          ? currentLatitude
          : checkInOutData.latitude;
        payload.outLong = currentLongitude
          ? currentLongitude
          : checkInOutData.longitude;

        payload.outImage = checkInOutData?.image
          ? {
              uri: isIos ? filePath : `file://${filePath}`,
              name: selfieName,
              filename: selfieName,
              type: 'image/jpeg',
            }
          : null;
      }

      return payload;
    } catch (err) {
      dispatch(
        setSnackMessage({
          message: 'Error generating payload , please refresh location again',
          severity: 'error',
        }),
      );
      throw err;
    }
  };

  useEffect(() => {
    if (
      markAttendanceResult?.isSuccess &&
      markAttendanceResult?.data?.message
    ) {
      const updatedAttendanceData = {
        ...attendanceData,
        status: 'in',
        checkInTime: currentTime12,
      };
      dispatch(setSnackMessage({
        message: 'Attendance marked successfully',
        severity: 'success',
      }));
      console.log('updatedAttendanceData after markng attendace', updatedAttendanceData);

      dispatch(setAttendanceData(updatedAttendanceData));   // we are updating these state in history screen
      storeAttendanceData(updatedAttendanceData);
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'homeTab'}],
        }),
      );
    }

    if (markAttendanceResult?.isError && markAttendanceResult?.error) {
      if (markAttendanceResult.error.status === 500) {
        dispatch(setSnackMessage({
          message: 'Internal Server Error',
          severity: 'error',
        }));
      } else {
        dispatch(setSnackMessage({
          message: markAttendanceResult.error.data.message,
          severity: 'error',
        }));
      }
    }
    if (checkOutResult?.isSuccess && checkOutResult?.data?.message) {
      const updatedAttendanceData = {
        ...attendanceData,
        status: 'inout',
        checkOutTime: currentTime12,
      };
      console.log('updatedAttendanceData after markng attendace', updatedAttendanceData);

      dispatch(setAttendanceData(updatedAttendanceData));
      dispatch(setSnackMessage({
        message: 'Attendance marked successfully',
        severity: 'success',
      }));
      storeAttendanceData(updatedAttendanceData);
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'homeTab'}],
        }),
      );
    }
    if (checkOutResult?.isError && checkOutResult?.error) {
      if (checkOutResult.error.status === 500) {
        dispatch(setSnackMessage({
          message: 'Internal Server Error',
          severity: 'error',
        }));
      } else {
        dispatch(setSnackMessage({
          message: checkOutResult.error.data.message,
          severity: 'error',
        }));
      }
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
        console.log('payload', payload);
        // Check network connectivity
        NetInfo.fetch().then(async state => {
          if (state.isConnected) {
            // If connected, hit API request to backend
            const status = btnLabel.toLowerCase();
            if (status === 'checkin') {
               await markAttendance(payload);
            } else if (status === 'checkout') {
             await checkOut(payload);
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
            dispatch(setSnackMessage({
              message: 'Attendance marked successfully',
              severity: 'success',
            }));
          } else if (status === 'checkout') {
            checkOut(payload);
            dispatch(setSnackMessage({
              message: 'Attendance marked successfully',
              severity: 'success',
            }));
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
    markAttendanceResult,
    checkOutResult,
    proceedMarkAttendance,
    onPhotoCapture,
  };
};

export default useCheckInOut;
