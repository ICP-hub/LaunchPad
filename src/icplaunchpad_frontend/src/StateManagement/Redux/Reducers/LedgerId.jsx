import { createSlice } from '@reduxjs/toolkit';

const initialLedgerIdState = {
  data: null,
};

const LedgerIdSlice = createSlice({
  name: 'ledgerId',
  initialState: initialLedgerIdState,
  reducers: {

    SetLedgerIdHandler: (state, action) => {

      state.data = action.payload;
    }
  },
});

export const {
    SetLedgerIdHandler
} = LedgerIdSlice.actions;

export default LedgerIdSlice.reducer;
