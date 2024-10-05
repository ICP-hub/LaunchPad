import { createSlice } from '@reduxjs/toolkit';

const initialActorState = {
  actor: null,
  error: null,
};

const actorSlice = createSlice({
  name: 'actors',
  initialState: initialActorState,
  reducers: {
    setActor: (state, action) => {
      state.actor = action.payload;
      state.error = null;
    },
    removeActor: (state) => {
      state.actor = null;
      state.error = null;
    },
    actorError: (state, action) => {
      state.error = action.payload;
    },
    handleActorRequest: (state, action) => {},
  },
});

export const { setActor, actorError, removeActor, handleActorRequest } =
  actorSlice.actions;
export default actorSlice.reducer;
