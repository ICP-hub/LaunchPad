import { createSlice } from '@reduxjs/toolkit';

const initialTokensInfoState = {
  data: [],
  loading: false,
  error: null,
};

const TokensInfoSlice = createSlice({
  name: 'TokensInfo',
  initialState: initialTokensInfoState,
  reducers: {
    TokensInfoHandlerRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    TokensInfoHandlerSuccess: (state, action) => {
      state.loading = false;
      if (Array.isArray(action.payload)) {
        state.data = action.payload; 
      } else {
        state.data = []; 
      }
    },
    TokensInfoHandlerFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
    TokensInfoHandlerRequest,
    TokensInfoHandlerSuccess,
    TokensInfoHandlerFailure,
} = TokensInfoSlice.actions;

export default TokensInfoSlice.reducer;
