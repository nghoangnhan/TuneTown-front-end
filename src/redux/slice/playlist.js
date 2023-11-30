import { createSlice } from "@reduxjs/toolkit";

const playlistStore = createSlice({
  name: "playlist",
  initialState: {
    refreshPlaylist: false,
    myPlaylistLists: [],
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
    setMyPLaylistList: (state, action) => {
      state.myPlaylistLists = action.payload;
    },
    setRefresh: (state, action) => {
      state.refreshPlaylist = action.payload;
    },
  },
});

export const { setPlaylist, setMyPLaylistList, setRefresh } =
  playlistStore.actions;
export default playlistStore.reducer;
