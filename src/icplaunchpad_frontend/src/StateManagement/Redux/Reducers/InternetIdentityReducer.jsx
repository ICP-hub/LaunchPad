import { createSlice } from '@reduxjs/toolkit';

// Initial state for the authentication slice
const initialState = {
  isAuthenticated: false,
  principal: null,
  identity: null,
  loading: false,
  error: null,
  authContext: null, // Stores auth context with login/logout functions
};

// Create the authentication slice
const internetIdentitySlice = createSlice({
  name: 'internet',
  initialState,
  reducers: {
    setAuthContext: (state, action) => {
      state.authContext = action.payload;
    },
    loginStart: (state, action) => {
      state.loading = true;
      state.error = null;
      state.walletType = action.payload?.walletType || undefined; // Set wallet type if provided
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
      state.error = action.payload || 'Login failed';
    },
    logoutStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    logoutSuccess: (state) => {
      state.isAuthenticated = false;
      state.principal = null;
      state.identity = null;
      state.walletType = undefined;
      state.loading = false;
      state.error = null;
    },
    logoutFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload || 'Logout failed';
    },
    checkLoginOnStart: (state) => {
      state.loading = true;
      state.error = null;
    },
  },
});

// Export the actions to use in sagas or components
export const {
  setAuthContext,
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
