import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';
import {employeeState} from './types';

const initialState: employeeState = {
  employeeId: null,
  employeeDetailsState: null,
};

export const employeeSlice = createSlice({
  name: 'employee',
  initialState,
  reducers: {
    setEmployeeId: (state, action: PayloadAction<number | string| null>) => {
      state.employeeId = action.payload;
    },
    setEmployeeDetailsState: (state, action: PayloadAction<any>) => {
      state.employeeDetailsState = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {setEmployeeId, setEmployeeDetailsState} = employeeSlice.actions;
export default employeeSlice.reducer;
