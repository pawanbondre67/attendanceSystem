import {API_TOKEN} from '@env';
import {baseApi} from '../BaseApiSlice';
import {CheckInPayload, CheckOutPayload} from './types';

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
      invalidatesTags: ['checkin'],
    }),
  }),
});

export const {
  useMarkAttendanceMutation,
  useCheckOutMutation,
} = attendanceApi;
