import {API_TOKEN} from '@env';
import {baseApi} from '../BaseApiSlice';
import {
  CheckInPayload,
  CheckOutPayload,
  registerPayload,
  historyPayload,
} from './types';
// import useLocalStorage from '../../../screens/home/useLocalStorage';
// import { useAppSelector } from '../../hook/hook';

// const {employeeDetails} = useAppSelector(state => state.employee);

// Define a service using a base URL and expected endpoints
export const attendanceApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    markAttendance: builder.mutation<any, CheckInPayload>({
      query: payload => {
        const {
          mid,
          mip,
          employeeMaster_Fid,
          inLat,
          inLong,
          inDate,
          inTime,
          status,
          inImage,
          CustomerCode,
        } = payload;

        // Creating a new FormData object
        const formData = new FormData();
        formData.append('inImage', {
          uri: inImage.uri,
          name: inImage.name,
          filename: inImage.filename,
          type: inImage.type,
        });
        formData.append('mid', mid);
        formData.append('mip', mip);
        formData.append('employeeMaster_Fid', employeeMaster_Fid);
        formData.append('inLat', inLat);
        formData.append('inLong', inLong);
        formData.append('inDate', inDate);
        formData.append('inTime', inTime);
        formData.append('status', status);
        // Append other payload data as needed
        // Object.keys(rest).forEach(key => {
        //   formData.append(key, rest[key]);
        // });

        console.log('checkin FormData', formData);
        return {
          url: 'checkin',
          method: 'POST',
          body: formData,
          headers: {
            // You may need to set appropriate headers for file upload
            CustomerCode: CustomerCode,
            Authorization: `Bearer ${API_TOKEN}`,
            'Content-Type': 'multipart/form-data', // Usually, not needed because it's set by the browser automatically
          },
        };
      },
      invalidatesTags: ['checkin'],
    }),
    checkOut: builder.mutation<any, CheckOutPayload>({
      query: payload => {
        const {
          mid,
          mip,
          employeeMaster_Fid,
          outLat,
          outLong,
          outDate,
          outTime,
          status,
          outImage,
          CustomerCode,
        } = payload;

        // Creating a new FormData object
        const formData = new FormData();
        formData.append('outImage', {
          uri: outImage.uri,
          name: outImage.name,
          filename: outImage.filename,
          type: outImage.type,
        });
        formData.append('mid', mid);
        formData.append('mip', mip);
        formData.append('employeeMaster_Fid', employeeMaster_Fid);
        formData.append('outLat', outLat);
        formData.append('outLong', outLong);
        formData.append('outDate', outDate);
        formData.append('outTime', outTime);
        formData.append('status', status);
        // Append other payload data as needed
        // Object.keys(rest).forEach(key => {
        //   formData.append(key, rest[key]);
        // });
        console.log('checkout FormData', formData);
        return {
          url: 'checkout',
          method: 'POST',
          body: formData,
          headers: {
            // You may need to set appropriate headers for file upload
            CustomerCode: CustomerCode,
            Authorization: `Bearer ${API_TOKEN}`,
            'Content-Type': 'multipart/form-data', // Usually, not needed because it's set by the browser automatically
          },
        };
      },
      invalidatesTags: ['checkout'],
    }),

    register: builder.mutation<any, registerPayload>({
      query: payload => {
        const {
          AppImage_I,
          AppImage_II,
          AppImage_III,
          InPhoneImage,
          mid,
          mip,
          EmployeeMaster_Fid,
          IMEINumber,
          CustomerCode,
        } = payload;

        // Creating a new FormData object
        const formData = new FormData();

        formData.append('AppImage_I', {
          uri: AppImage_I.uri,
          name: AppImage_I.name,
          filename: AppImage_I.filename,
          type: AppImage_I.type,
        });
        formData.append('AppImage_II', {
          uri: AppImage_II.uri,
          name: AppImage_II.name,
          filename: AppImage_II.filename,
          type: AppImage_II.type,
        });
        formData.append('AppImage_III', {
          uri: AppImage_III.uri,
          name: AppImage_III.name,
          filename: AppImage_III.filename,
          type: AppImage_III.type,
        });
        formData.append('InPhoneImage', {
          uri: InPhoneImage.uri,
          name: InPhoneImage.name,
          filename: InPhoneImage.filename,
          type: InPhoneImage.type,
        });

        // Append other payload data as needed
        formData.append('mid', mid);
        formData.append('mip', mip);
        formData.append('EmployeeMaster_Fid', EmployeeMaster_Fid);
        formData.append('IMEINumber', IMEINumber);

        // Object.keys(rest).forEach(key => {
        //   formData.append(key, rest[key]);
        // });
        console.log('register FormData', formData);
        return {
          url: 'Register',
          method: 'POST',
          body: formData,
          headers: {
            // You may need to set appropriate headers for file upload
            CustomerCode: CustomerCode,
            Authorization: `Bearer ${API_TOKEN}`,
            'Content-Type': 'multipart/form-data', // Usually, not needed because it's set by the browser automatically
          },
        };
      },
    }),

    latestStatus: builder.query<any, {CustomerCode: string}>({
      query: ({CustomerCode}) => ({
        url: 'latestStatus',
        method: 'GET',
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
          CustomerCode: CustomerCode,
        },
      }),
      providesTags: ['checkin', 'checkout'],
    }),

    HistoryOfAttendance: builder.query<any, historyPayload>({
      query: ({fromdate, todate, id, CustomerCode}) => ({
        url: `HistoryOfAttendance?fromdate=${fromdate}&todate=${todate}&id=${id}`,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
          CustomerCode: CustomerCode,
        },
      }),
      providesTags: ['attendanceHistory'],
    }),
  }),
});

export const {
  useMarkAttendanceMutation,
  useCheckOutMutation,
  useLatestStatusQuery,
  useLazyLatestStatusQuery,
  useRegisterMutation,
  useHistoryOfAttendanceQuery,
  useLazyHistoryOfAttendanceQuery,
} = attendanceApi;
