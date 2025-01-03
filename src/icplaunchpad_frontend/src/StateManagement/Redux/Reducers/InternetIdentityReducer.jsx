import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAuthenticated: false,
  identity: null,
  principal: null,
  loading: false,
  error: null,
};

const internetIdentitySlice = createSlice({
  name: 'internet',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      const { isAuthenticated, identity, principal } = action.payload || {};
      state.isAuthenticated = isAuthenticated || false;
      state.identity = identity || null;
      state.principal = principal || null;
      state.loading = false;
      state.error = null;
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logoutStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    logoutSuccess: (state) => {
      state.isAuthenticated = false;
      state.identity = null;
      state.principal = null;
      state.loading = false;
      state.error = null;
    },
    logoutFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logoutStart,
  logoutSuccess,
  logoutFailure,
} = internetIdentitySlice.actions;

export default internetIdentitySlice.reducer;
