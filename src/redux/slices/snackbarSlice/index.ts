import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';
import {SnackBarState} from './types';

const initialState: SnackBarState = {
  visible: false,
  message: '',
  severity: 'info',
};

export const snackBarSlice = createSlice({
  name: 'snackBar',
  initialState,
  reducers: {
    setSnackBarVisibility: (state, action: PayloadAction<boolean>) => {
      state.visible = action.payload;
    },
    toggleSnackBarVisibility: state => {
      state.visible = !state.visible;
    },
    setSnackMessage: (state, action: PayloadAction<{ message: string; severity: SnackBarState['severity'] }>) => {
       state.visible = true;
      state.message = action.payload.message;
      state.severity = action.payload.severity;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setSnackBarVisibility,
  toggleSnackBarVisibility,
  setSnackMessage,
} = snackBarSlice.actions;

export default snackBarSlice.reducer;
