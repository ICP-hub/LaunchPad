import { createSlice } from '@reduxjs/toolkit';

const initialTokenImageIDsState = {
  data: [],
  loading: false,
  error: null,
};

const TokenImageIDsSlice = createSlice({
  name: 'TokenImageIDs',
  initialState: initialTokenImageIDsState,
  reducers: {
    TokenImageIDsHandlerRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    TokenImageIDsHandlerSuccess: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
    TokenImageIDsHandlerFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  TokenImageIDsHandlerRequest,
  TokenImageIDsHandlerSuccess,
  TokenImageIDsHandlerFailure,
} = TokenImageIDsSlice.actions;

export default TokenImageIDsSlice.reducer;
