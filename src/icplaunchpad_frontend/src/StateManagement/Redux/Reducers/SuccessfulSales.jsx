import { createSlice } from '@reduxjs/toolkit';

const initialSuccessfulSalesState = {
  data: [],
  loading: false,
  error: null,
};

const SuccessfulSalesSlice = createSlice({
  name: 'SuccessfulSalesData',
  initialState: initialSuccessfulSalesState,
  reducers: {
    SuccessfulSalesHandlerRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    SuccessfulSalesHandlerSuccess: (state, action) => {
      state.loading = false;
      state.data = action.payload;
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
