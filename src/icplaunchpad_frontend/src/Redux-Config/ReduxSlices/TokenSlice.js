import { createSlice } from "@reduxjs/toolkit";

const tokenSlice = createSlice({
  name: "token",
  initialState: {
    ledgerId:null,
    tokenData:null
  },
  reducers: {
    addTokenData: (state, action) => {
      return action.payload;  // Correct way to replace the entire state
    },
    // You can add more reducer functions as per your need...
  }
});

// Export actions and reducer
export const { addTokenData } = tokenSlice.actions;
export default tokenSlice.reducer;
