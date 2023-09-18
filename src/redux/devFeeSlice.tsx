import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface devFeeSliceState {
  devFee: number;
}

// SLICES
/////////////////////////////////
const initialState: devFeeSliceState = {
  devFee: 0.003
};

const devFeeSlice = createSlice({
  name: 'devFee',
  initialState,
  reducers: {
    setDevFee(state, action: PayloadAction<number>) {
      const devFee = action.payload;
      state.devFee = devFee;
    },
  },
});

export const { setDevFee } = devFeeSlice.actions;

export default devFeeSlice.reducer;
