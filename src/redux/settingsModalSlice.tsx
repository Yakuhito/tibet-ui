import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface settingsModalSliceState {
  isOpen: boolean;
}

// SLICES
/////////////////////////////////
const initialState: settingsModalSliceState = {
  isOpen: false
};

const settingsModalSlice = createSlice({
  name: 'settingsModal',
  initialState,
  reducers: {
    setIsOpen(state, action: PayloadAction<boolean>) {
      state.isOpen = action.payload;
    },
  },
});

export const { setIsOpen } = settingsModalSlice.actions;

export default settingsModalSlice.reducer;
