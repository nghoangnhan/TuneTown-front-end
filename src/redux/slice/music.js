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
      songName: "No song yet",
      artists: null,
      currentTime: 0,
      songDuration: 300,
      status: null,
      songCover: null,
      songData: null,
      lyric: null,
    },
    listSong: [],
    playlist: [],
    // Song will be played next
    songQueue: [],
    // Song has been played
    songQueuePlayed: [],
    isPlaying: false,
    repeat: false,
    shuffle: false,
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
      state.currentSong.currentTime = 0;
    },
    setPlaylist: (state, action) => {
      state.playlist = action.payload;
    },
    setIsPlaying: (state, action) => {
      state.isPlaying = action.payload;
    },
    setCurrentTime: (state, action) => {
      state.currentSong.currentTime = action.payload;
    },
    setSongLinks: (state, action) => {
      state.currentSong.songData = action.payload;
    },
    setDuration: (state, action) => {
      state.currentSong.songDuration = action.payload;
    },
    setListSong: (state, action) => {
      state.listSong = action.payload;
    },
    setRepeat: (state, action) => {
      state.repeat = action.payload;
    },
    setShuffle: (state, action) => {
      state.shuffle = action.payload;
      if (state.shuffle === true) {
        // Tạo một bản sao của mảng songQueue
        const shuffledQueue = [...state.songQueue];

        // Sử dụng thuật toán xáo trộn Fisher-Yates
        for (let i = shuffledQueue.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffledQueue[i], shuffledQueue[j]] = [
            shuffledQueue[j],
            shuffledQueue[i],
          ];
        }

        // Gán mảng đã xáo trộn vào state
        state.songQueue = shuffledQueue;
      }
    },

    addSongToQueue: (state, action) => {
      state.songQueue.push(action.payload);
    },
    addPlaylistSongToQueue: (state, action) => {
      state.songQueue.push(...action.payload);
    },
    removeSongFromQueue: (state, action) => {
      state.songQueue = state.songQueue.filter(
        (song) => song.id !== action.payload
      );
    },
    playNextSong: (state) => {
      if (state.songQueue.length > 0) {
        state.songQueuePlayed.push(state.currentSong);
        state.currentSong = state.songQueue[0];
        state.songQueue.shift();
        state.currentSong.currentTime = 0;
      } else {
        state.currentSong = null;
      }
    },
    playPreviousSong: (state) => {
      if (state.songQueuePlayed.length > 0) {
        state.songQueue.unshift(state.currentSong);
        state.currentSong =
          state.songQueuePlayed[state.songQueuePlayed.length - 1];
        state.songQueuePlayed.pop();
        state.currentSong.currentTime = 0;
      } else {
        state.currentSong = null;
      }
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
  setRepeat,
  setShuffle,
  addSongToQueue,
  addPlaylistSongToQueue,
  removeSongFromQueue,
  playNextSong,
  playPreviousSong,
} = musicStore.actions;

export default musicStore.reducer;
