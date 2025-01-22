import {configureStore} from '@reduxjs/toolkit';
import {baseApi} from '../services/BaseApiSlice';
import attendanceReducer from '../slices/Attendance';
import employeeReducer from '../slices/Employee';

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    attendance: attendanceReducer,
    employee: employeeReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
