import { createSlice } from "@reduxjs/toolkit";

const tokenSlice = createSlice({
  name: "token",
  initialState: {
    ledgerId:null,
    tokenData:null
  },
  reducers: {
    addTokenIds: (state, action) => {
      state.ledgerId= action.payload;  // Correct way to replace the entire state
    },
    addTokenData: (state, action) => {
      state.tokenData = action.payload;  // Correct way to replace the entire state
    },
  }
});

// Export actions and reducer
export const { addTokenData } = tokenSlice.actions;
export default tokenSlice.reducer;
