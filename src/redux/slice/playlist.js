import { createSlice } from "@reduxjs/toolkit";

const playlistStore = createSlice({
  name: "playlist",
  initialState: {
    id: 152,
    playlistName: "test",
    user: {
      id: 505,
      userName: "Nguyen Hoang Nhan",
      email: "test@gmail.com",
      password: "$2a$10$biLULL30K.AT7PFGM3in3OBAfP0HiYClyYOwtxNuNWAwvhv06S10.",
      role: "USER",
      birthDate: "2002-07-21",
      userBio: null,
      avatar: null,
      history: [],
      favoriteGenres: [],
      followingArtists: [],
    },
    playlistType: "Public",
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
