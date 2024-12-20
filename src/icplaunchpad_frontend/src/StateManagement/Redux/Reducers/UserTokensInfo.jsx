import { createSlice } from '@reduxjs/toolkit';

const initialUserTokensInfoState = {
  data: [],
  loading: false,
  error: null,
};

const UserTokensInfoSlice = createSlice({
  name: ' UserTokensInfo',
  initialState: initialUserTokensInfoState,
  reducers: {
    UserTokensInfoHandlerRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    UserTokensInfoHandlerSuccess: (state, action) => {
      state.loading = false;
      if (Array.isArray(action.payload)) {
        state.data = action.payload; 
      } else {
        state.data = []; 
      }
    },
    UserTokensInfoHandlerFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
    UserTokensInfoHandlerRequest,
    UserTokensInfoHandlerSuccess,
    UserTokensInfoHandlerFailure,
} =  UserTokensInfoSlice.actions;

export default  UserTokensInfoSlice.reducer;
