import { createSlice } from '@reduxjs/toolkit';

const initialProfileImageIDState = {
  data: null,
  loading: false,
  error: null,
};

const ProfileImageIDSlice = createSlice({
  name: 'ProfileImageID',
  initialState: initialProfileImageIDState,
  reducers: {
    ProfileImageIDHandlerRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    ProfileImageIDHandlerSuccess: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
    ProfileImageIDHandlerFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
    ProfileImageIDHandlerRequest,
    ProfileImageIDHandlerSuccess,
    ProfileImageIDHandlerFailure,
} = ProfileImageIDSlice.actions;

export default ProfileImageIDSlice.reducer;
