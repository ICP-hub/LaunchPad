import { createSlice } from '@reduxjs/toolkit';

const initialActiveSalesState = {
  data: [],
  loading: false,
  error: null,
};

const ActiveSalesSlice = createSlice({
  name: 'ActiveSalesData',
  initialState: initialActiveSalesState,
  reducers: {
    ActiveSalesHandlerRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    ActiveSalesHandlerSuccess: (state, action) => {
      state.loading = false;
      if (Array.isArray(action.payload)) {
        state.data = action.payload; 
      } else {
        state.data = []; 
      }
    },
    ActiveSalesHandlerFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
    ActiveSalesHandlerRequest,
    ActiveSalesHandlerSuccess,
    ActiveSalesHandlerFailure,
} = ActiveSalesSlice.actions;

export default ActiveSalesSlice.reducer;
