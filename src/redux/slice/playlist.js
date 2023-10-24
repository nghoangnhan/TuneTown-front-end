import { createSlice } from "@reduxjs/toolkit";

const playlistStore = createSlice({
  name: "playlist",
  initialState: {
    playlist: { name: "", author: "", coverArt: "", listSongs: [] },
  },
  reducers: {
    setPlaylist: (state, action) => {
      state.playlist = action.payload;
    },
  },
});

export const { setPlaylist } = playlistStore.actions;
export default playlistStore.reducer;
