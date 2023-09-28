import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getAllTokens, type Token } from '@/api';
import { RootState } from './store';

export interface globalOnLoadDataSliceState {
  tokens: Token[] | null;
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

// SLICES
/////////////////////////////////
const initialState: globalOnLoadDataSliceState = {
  tokens: null,
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
  },
});

// export const {  } = globalOnLoadDataSlice.actions;

export default globalOnLoadDataSlice.reducer;
