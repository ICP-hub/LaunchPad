import { createSlice } from '@reduxjs/toolkit';

const initialActorState = {
  actor: null,
  error: null,
  isLoading: false, // Added for tracking loading state
};

const actorSlice = createSlice({
  name: 'actors',
  initialState: initialActorState,
  reducers: {
    handleActorRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    setActor: (state, action) => {
      state.actor = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    removeActor: (state) => {
      state.actor = null;
      state.isLoading = false;
      state.error = null;
    },
    actorError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
});

export const { setActor, actorError, removeActor, handleActorRequest } =
  actorSlice.actions;
export default actorSlice.reducer;