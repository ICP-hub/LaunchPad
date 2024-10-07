import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./ReduxSlices/UserSlice";
import tokenReducer from "./ReduxSlices/TokenSlice";
import tokenPresaleReducer from "./ReduxSlices/TokenPresaleSlice";

export const myStore = configureStore({
  reducer: {
    user: userReducer,
    token: tokenReducer,
    tokenPresale: tokenPresaleReducer,
  },
});
