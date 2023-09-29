import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import type { RootState } from './store';

import { getAllTokens, type Token } from '@/api';

export interface globalOnLoadDataSliceState {
  tokens: Token[] | null;
  xchPrice: number | null;
}

// ASYNC
/////////////////////////////////
export const getTokens = createAsyncThunk('wallet/getTokens', async (_, { getState }) => {
  const state = getState() as RootState;

  // If tokens have previously been loaded
  if (state.globalOnLoadData.tokens) return state.globalOnLoadData.tokens;

  // On first request
  try {
    return await getAllTokens();
  } catch (error: any) {
    if (error.message) {
      console.log("Error while fetching tokens:", error)
    }
    throw error;
  }
});

export const getXCHPrice = createAsyncThunk('wallet/getXCHPrice', async (_, { getState }) => {
  const state = getState() as RootState;

  // If tokens have previously been loaded
  if (state.globalOnLoadData.xchPrice) return state.globalOnLoadData.xchPrice;

  
  // On first request
  try {
    const resp = await fetch("https://xchscan.com/api/chia-price");
    const resp_parsed = await resp.json();
    return resp_parsed.usd;
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
  tokens: null,
  xchPrice: null,
};

const globalOnLoadDataSlice = createSlice({
  name: 'globalOnLoadData',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      // GET TOKENS
      //////////////////////////////////
      .addCase(getTokens.fulfilled, (state, action: PayloadAction<Token[]>) => {
        state.tokens = action.payload;
      })
      // GET XCH PRICE
      //////////////////////////////////
      .addCase(getXCHPrice.fulfilled, (state, action: PayloadAction<number | null>) => {
        state.xchPrice = action.payload;
      })
  },
});

// export const {  } = globalOnLoadDataSlice.actions;

export default globalOnLoadDataSlice.reducer;
