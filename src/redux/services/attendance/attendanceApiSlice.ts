import {API_TOKEN} from '@env';
import {baseApi} from '../BaseApiSlice';
import {CheckInPayload, CheckOutPayload, registerPayload} from './types';

// Define a service using a base URL and expected endpoints
export const attendanceApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    markAttendance: builder.mutation<any, CheckInPayload>({
      query: payload => {
        const {outImage, ...rest} = payload;

        // Creating a new FormData object
        const formData = new FormData();
        formData.append('selfie', outImage);
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
        formData.append('selfie', outImage);
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
        const {AppImage_I, AppImage_II, AppImage_III, InPhoneImage, ...rest} =
          payload;

        // Creating a new FormData object
        const formData = new FormData();
        formData.append('AppImage_I', AppImage_I);
        formData.append('AppImage_II', AppImage_II);
        formData.append('AppImage_III', AppImage_III);
        formData.append('InPhoneImage', InPhoneImage || '');
        // Append other payload data as needed
        Object.keys(rest).forEach(key => {
          formData.append(key, rest[key]);
        });
        console.log('register FormData', formData);
        return {
          url: 'register',
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
