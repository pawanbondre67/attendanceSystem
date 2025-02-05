import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import { CheckInOutData} from './types';

const initialState: {CheckInOutData: CheckInOutData} = {
  CheckInOutData: {
    status: null,
    checkInTime: null,
    checkOutTime: null,
    date: null,
  },
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
