import {API_TOKEN} from '@env';
import {baseApi} from '../BaseApiSlice';
import {CheckInPayload, CheckOutPayload, registerPayload} from './types';

// Define a service using a base URL and expected endpoints
export const attendanceApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    markAttendance: builder.mutation<any, CheckInPayload>({
      query: payload => {
        const {inImage, ...rest} = payload;

        // Creating a new FormData object
        const formData = new FormData();
        formData.append('inImage', {
          uri : inImage.uri,
          name: inImage.name,
          filename: inImage.filename,
          type: inImage.type,
        });
        // Append other payload data as needed
        Object.keys(rest).forEach(key => {
          formData.append(key, rest[key]);
        });
        console.log('checkin FormData', formData);
        return {
          url: 'checkin',
          method: 'POST',
          body: formData,
          headers: {
            // You may need to set appropriate headers for file upload
            Authorization: `Bearer ${API_TOKEN}`,
            'Content-Type': 'multipart/form-data', // Usually, not needed because it's set by the browser automatically
          },
        };
      },
      invalidatesTags: ['checkin'],
    }),
    checkOut: builder.mutation<any, CheckOutPayload>({
      query: payload => {
        const {outImage, ...rest} = payload;

        // Creating a new FormData object
        const formData = new FormData();
        formData.append('outImage', {
          uri: outImage.uri,
          name: outImage.name,
          filename: outImage.filename,
          type: outImage.type,
        });
        // Append other payload data as needed
        Object.keys(rest).forEach(key => {
          formData.append(key, rest[key]);
        });
        console.log('checkout FormData', formData);
        return {
          url: 'checkout',
          method: 'POST',
          body: formData,
          headers: {
            // You may need to set appropriate headers for file upload
            Authorization: `Bearer ${API_TOKEN}`,
            'Content-Type': 'multipart/form-data', // Usually, not needed because it's set by the browser automatically
          },
        };
      },
      invalidatesTags: ['checkout'],
    }),

    register: builder.mutation<any, registerPayload>({
      query: payload => {
        const {AppImage_I, AppImage_II, AppImage_III,InPhoneImage, ...rest} =
          payload;

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
        Object.keys(rest).forEach(key => {
          formData.append(key, rest[key]);
        });
        console.log('register FormData', formData);
        return {
          url: 'Register',
          method: 'POST',
          body: formData,
          headers: {
            // You may need to set appropriate headers for file upload
            Authorization: `Bearer ${API_TOKEN}`,
            'Content-Type': 'multipart/form-data', // Usually, not needed because it's set by the browser automatically
          },
        };
      },
    }),

    latestStatus: builder.query<any, void>({
      query: () => ({
        url: 'latestStatus',
        method: 'GET',
      }),
      providesTags: ['checkin', 'checkout'],
    }),
  }),
});

export const {
  useMarkAttendanceMutation,
  useCheckOutMutation,
  useLatestStatusQuery,
  useLazyLatestStatusQuery,
  useRegisterMutation,
} = attendanceApi;
