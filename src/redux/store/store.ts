import {configureStore} from '@reduxjs/toolkit';
import {baseApi} from '../services/BaseApiSlice';
import attendanceReducer from '../slices/Attendance';
import employeeReducer from '../slices/Employee';
import snackBarReducer from '../slices/snackbarSlice';

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    attendance: attendanceReducer,
    employee: employeeReducer,
    snackbar: snackBarReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
