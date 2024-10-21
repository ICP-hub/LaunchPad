import { createSlice } from '@reduxjs/toolkit';

const initialSaleParamsState = {
  data: {},
  loading: false,
  error: null,
};

const SaleParamsSlice = createSlice({
  name: 'TokensInfoData',
  initialState: initialSaleParamsState,
  reducers: {
    SaleParamsHandlerRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    SaleParamsHandlerSuccess: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
    SaleParamsHandlerFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
    SaleParamsHandlerRequest,
    SaleParamsHandlerSuccess,
    SaleParamsHandlerFailure,
} = SaleParamsSlice.actions;

export default SaleParamsSlice.reducer;
