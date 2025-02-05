import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';
import {employeeState} from './types';

const initialState: employeeState = {
  employeeId: undefined,
  employeeDetails: undefined,
};

export const employeeSlice = createSlice({
  name: 'employee',
  initialState,
  reducers: {
    setEmployeeId: (state, action: PayloadAction<string | undefined>) => {
      state.employeeId = action.payload;
    },
    setEmployeeDetails: (state, action: PayloadAction<any>) => {
      state.employeeDetails = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {setEmployeeId, setEmployeeDetails} = employeeSlice.actions;
export default employeeSlice.reducer;
