import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import type { RootState } from './store';

import { getAllPairs, Pair, type Token } from '@/api';

export interface globalOnLoadDataSliceState {
  pairs: Pair[] | null;
}

// ASYNC
/////////////////////////////////
export const getPairs = createAsyncThunk('wallet/getPairs', async (_, { getState }) => {
  const state = getState() as RootState;

  // If tokens have previously been loaded
  if (state.globalOnLoadData.pairs) return state.globalOnLoadData.pairs;

  // On first request
  try {
    return await getAllPairs();
  } catch (error: any) {
    if (error.message) {
      console.log("Error while fetching tokens:", error)
    }
    throw error;
  }
});

// SLICES
/////////////////////////////////
const initialState: globalOnLoadDataSliceState = {
  pairs: null,
};

const globalOnLoadDataSlice = createSlice({
  name: 'globalOnLoadData',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      // GET TOKENS
      //////////////////////////////////
      .addCase(getPairs.fulfilled, (state, action: PayloadAction<Pair[]>) => {
        state.pairs = action.payload;
      })
  },
});

// export const {  } = globalOnLoadDataSlice.actions;

export default globalOnLoadDataSlice.reducer;
