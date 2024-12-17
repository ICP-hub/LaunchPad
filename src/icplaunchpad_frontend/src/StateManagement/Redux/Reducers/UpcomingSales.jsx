import { createSlice } from '@reduxjs/toolkit';

const initialSalesState = {
  data: [],
  loading: false,
  error: null,
};

const SalesSlice = createSlice({
  name: 'upcomingSales',
  initialState: initialSalesState,
  reducers: {
    upcomingSalesHandlerRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    upcomingSalesHandlerSuccess: (state, action) => {
      state.loading = false;
      if (Array.isArray(action.payload)) {
        state.data = action.payload; 
      } else {
        state.data = []; 
      }
    },
    upcomingSalesHandlerFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
    upcomingSalesHandlerRequest,
    upcomingSalesHandlerSuccess,
    upcomingSalesHandlerFailure,
} = SalesSlice.actions;

export default SalesSlice.reducer;
