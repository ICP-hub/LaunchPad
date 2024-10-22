import { createSlice } from '@reduxjs/toolkit';

// Initial state for the authentication slice
const initialState = {
  isAuthenticated: false,
  principal: null,
  identity: null,
  walletType: null, // Tracks which wallet the user logged in with (authClient, NFID, Plug)
  loading: false,
  error: null,
};

// Create the authentication slice
const internetIdentitySlice = createSlice({
  name: 'internet',
  initialState,
  reducers: {
    loginStart: (state, action) => {
      state.loading = true;
      state.error = null;
      state.walletType = action.payload.walletType; // Set wallet type
    },
    loginSuccess: (state, action) => {
      const { isAuthenticated, principal, identity } = action.payload;
      state.isAuthenticated = isAuthenticated;
      state.principal = principal;
      state.identity = identity;
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
      state.principal = null;
      state.identity = null;
      state.walletType = null;
      state.loading = false;
      state.error = null;
    },
    logoutFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    checkLoginOnStart: (state) => {
      state.loading = true;
      state.error = null;
    },
  },
});

// Export the actions to use in sagas or components
export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logoutStart,
  logoutSuccess,
  logoutFailure,
  checkLoginOnStart,
} = internetIdentitySlice.actions;

// Export the reducer to configure the store
export default internetIdentitySlice.reducer;
