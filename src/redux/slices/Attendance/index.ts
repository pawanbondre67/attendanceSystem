import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {AttendanceState, CheckInOutData} from './types';

const initialState: AttendanceState = {
  CheckInOutData: null,
};

export const attendanceSlice = createSlice({
  name: 'attendance',
  initialState,
  reducers: {
    setCheckInOutData: (state, action: PayloadAction<CheckInOutData>) => {
      state.CheckInOutData = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {setCheckInOutData} = attendanceSlice.actions;
export default attendanceSlice.reducer;
