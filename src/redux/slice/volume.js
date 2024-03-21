import { createSlice } from "@reduxjs/toolkit";

const volumeStore = createSlice({
  name: "volume",
  initialState: {
    volumeValue: 0.5,
  },
  reducers: {
    setVolume: (state, action) => {
      state.volumeValue = action.payload;
    },
  },
});

export const { setVolume } = volumeStore.actions;
export default volumeStore.reducer;
