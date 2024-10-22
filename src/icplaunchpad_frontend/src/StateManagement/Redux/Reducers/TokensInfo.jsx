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
      state.data = action.payload;
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