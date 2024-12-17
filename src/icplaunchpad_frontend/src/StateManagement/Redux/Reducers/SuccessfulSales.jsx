import { createSlice } from '@reduxjs/toolkit';

const initialSuccessfulSalesState = {
  data: [],
  loading: false,
  error: null,
};

const SuccessfulSalesSlice = createSlice({
  name: 'SuccessfulSales',
  initialState: initialSuccessfulSalesState,
  reducers: {
    SuccessfulSalesHandlerRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    SuccessfulSalesHandlerSuccess: (state, action) => {
      state.loading = false;
      if (Array.isArray(action.payload)) {
        state.data = action.payload; 
      } else {
        state.data = []; 
      }
    },
    SuccessfulSalesHandlerFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
    SuccessfulSalesHandlerRequest,
    SuccessfulSalesHandlerSuccess,
    SuccessfulSalesHandlerFailure,
} = SuccessfulSalesSlice.actions;

export default SuccessfulSalesSlice.reducer;
