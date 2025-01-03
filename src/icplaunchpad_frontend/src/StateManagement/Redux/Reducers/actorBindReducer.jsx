import { createSlice } from '@reduxjs/toolkit';

const initialActorState = {
  actor: null,
  isLoading: false,
  error: null,
};

const actorSlice = createSlice({
  name: 'actors',
  initialState: initialActorState,
  reducers: {
    initActor: (state, action) => {
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

export const { initActor, setActor, removeActor, actorError } = actorSlice.actions;

export default actorSlice.reducer;
