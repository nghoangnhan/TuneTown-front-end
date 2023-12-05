/* eslint-disable no-unused-vars */
import { createSlice } from "@reduxjs/toolkit";
import MakeUBeauti from "../../assets/music/What_Makes_You_Beautiful.mp3";
import HappyNewYear from "../../assets/music/HappyNewYear.mp3";
import BlindingLight from "../../assets/music/BlindingLight.mp3";

const musicStore = createSlice({
  name: "music",
  initialState: {
    currentSong: {
      id: null,
      songName: "What make you beautiful",
      artists: [
        {
          userName: "One Direction",
        },
        {
          userName: "Two Direction",
        },
        {
          userName: "Three Direction",
        },
      ],
      songDuration: 214,
      songCover:
        "https://media.npr.org/assets/music/news/2010/09/maroon-e9cb8c5b25b4d1f3e68aa26e6a0ce51cf2ae59d8-s1100-c50.jpg",
      songLink: MakeUBeauti,
    },
    playlist: [],
    songQueue: [
      {
        id: 1,
        songName: "What make you beautiful",
        artists: [
          {
            userName: "One Direction",
          },
          {
            userName: "Two Direction",
          },
          {
            userName: "Three Direction",
          },
        ],
        songDuration: 214,
        songCover:
          "https://media.npr.org/assets/music/news/2010/09/maroon-e9cb8c5b25b4d1f3e68aa26e6a0ce51cf2ae59d8-s1100-c50.jpg",
        songLink: MakeUBeauti,
      },
      {
        id: 2,
        songName: "Happy New Year",
        artists: [
          {
            userName: "ABBA",
          },
        ],
        songDuration: 214,
        songCover:
          "https://img.freepik.com/free-vector/happy-new-year-2020-lettering-greeting-inscription-vector-illustration-eps10_87521-3994.jpg?size=626&ext=jpg&ga=GA1.1.1803636316.1701561600&semt=ais",
        songLink: HappyNewYear,
      },
      {
        id: 3,
        songName: "Bliding Lights",
        artists: [
          {
            userName: "The Weeknd",
          },
        ],
        songDuration: 214,
        songCover:
          "https://upload.wikimedia.org/wikipedia/en/e/e6/The_Weeknd_-_Blinding_Lights.png",
        songLink: BlindingLight,
      },
    ],
    isPlaying: false,
    currentTime: 0,
    // ... other state properties
  },
  // type action
  reducers: {
    setCurrentSong: (state, action) => {
      state.currentSong = action.payload;
      state.currentSong.duration = action.payload.songDuration;
      if (!state.isPlaying) {
        state.isPlaying = true;
      }
    },
    setPlaylist: (state, action) => {
      state.playlist = action.payload;
    },
    setIsPlaying: (state, action) => {
      state.isPlaying = action.payload;
    },
    setCurrentTime: (state, action) => {
      state.currentTime = action.payload;
    },
    setSongLinks: (state, action) => {
      state.currentSong.songLink = action.payload;
    },
    setDuration: (state, action) => {
      state.currentSong.songDuration = action.payload;
    },
    setListSong: (state, action) => {
      state.listSong = action.payload;
    },
    addSongToQueue: (state, action) => {
      state.songQueue.push(action.payload);
    },
    removeSongFromQueue: (state, action) => {
      state.songQueue = state.songQueue.filter(
        (song) => song.id !== action.payload
      );
    },
  },
});

export const {
  setCurrentSong,
  setPlaylist,
  setIsPlaying,
  setCurrentTime,
  setSongLinks,
  setDuration,
  setListSong,
  addSongToQueue,
  removeSongFromQueue,
} = musicStore.actions;

export default musicStore.reducer;
