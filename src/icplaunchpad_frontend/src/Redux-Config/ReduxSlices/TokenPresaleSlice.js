import { createSlice } from "@reduxjs/toolkit";

const TokenPresaleSlice = createSlice({
  name: "TokenPresale",
  initialState: {},
  reducers: {
    addTokenPresaleData: (state, action) => {
      // Directly mutate the state properties or replace the state
      return { ...action.payload };
    }

    // Add more reducer functions as needed
  }
});

export const { addTokenPresaleData } = TokenPresaleSlice.actions;
export default TokenPresaleSlice.reducer;
