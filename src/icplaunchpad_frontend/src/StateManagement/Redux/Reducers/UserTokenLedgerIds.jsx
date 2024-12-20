import { createSlice } from '@reduxjs/toolkit';

const initialUserTokenLedgerIdsState = {
  data: [],
  loading: false,
  error: null,
};

const UserTokenLedgerIdsSlice = createSlice({
  name: 'UserTokenLedgerIds',
  initialState: initialUserTokenLedgerIdsState,
  reducers: {
    UserTokenLedgerIdsHandlerRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    UserTokenLedgerIdsHandlerSuccess: (state, action) => {
      state.loading = false;
      if (Array.isArray(action.payload)) {
        state.data = action.payload; 
      } else {
        state.data = []; 
      }
    },
    UserTokenLedgerIdsHandlerFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
    UserTokenLedgerIdsHandlerRequest,
    UserTokenLedgerIdsHandlerSuccess,
    UserTokenLedgerIdsHandlerFailure,
} =  UserTokenLedgerIdsSlice.actions;

export default  UserTokenLedgerIdsSlice.reducer;
