import { createSlice } from "@reduxjs/toolkit";

const playlistStore = createSlice({
  name: "playlist",
  initialState: {
    id: 0,
    playlistName: "",
    user: {
      id: 0,
      userName: "",
      email: "",
      password: "",
      role: "",
      birthDate: "",
      userBio: null,
      avatar: null,
      history: [],
      favoriteGenres: [],
      followingArtists: [],
    },
    playlistType: "",
    coverArt: null,
    playlistSongsList: null,
  },
  reducers: {
    setPlaylist: (state, action) => {
      state.playlist = action.payload;
    },
  },
});

export const { setPlaylist } = playlistStore.actions;
export default playlistStore.reducer;
