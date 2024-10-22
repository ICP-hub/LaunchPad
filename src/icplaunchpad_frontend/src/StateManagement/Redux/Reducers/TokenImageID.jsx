import { createSlice } from '@reduxjs/toolkit';

const initialTokenImageIDState = {
  data: null,
  loading: false,
  error: null,
};

const TokenImageIDSlice = createSlice({
  name: 'TokenImageID',
  initialState: initialTokenImageIDState,
  reducers: {
    TokenImageIDHandlerRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    TokenImageIDHandlerSuccess: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
    TokenImageIDHandlerFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
    TokenImageIDHandlerRequest,
    TokenImageIDHandlerSuccess,
    TokenImageIDHandlerFailure,
} = TokenImageIDSlice.actions;

export default TokenImageIDSlice.reducer;
