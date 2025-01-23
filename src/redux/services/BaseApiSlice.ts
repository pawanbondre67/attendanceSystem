
import {API_TOKEN, REACT_APP_BASE_URL} from '@env';
import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';

// Define a service using a base URL and expected endpoints
console.log('REACT_APP_BASE_URL', REACT_APP_BASE_URL);
export const baseApi = createApi({
  reducerPath: 'baseApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${REACT_APP_BASE_URL}/api/`,
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
    },
  }),

  tagTypes: [

    'Notification',
    'checkin',
    'checkout',
  ],
  endpoints: () => ({}),
});
