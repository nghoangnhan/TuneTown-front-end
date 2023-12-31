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
      songName: "What Make You Beautiful",
      artists: [
        {
          userName: "One Direction",
        },
      ],
      songDuration: 214,
      songCover:
        "https://firebasestorage.googleapis.com/v0/b/tunetown-6b63a.appspot.com/o/images%2F1direction.jpg?alt=media&token=c62c84bd-3b36-45b2-844a-f7c4f236fe01",

      songData:
        "https://storage.googleapis.com/tunetown-6b63a.appspot.com/audios/What_Makes_You_Beautiful/What_Makes_You_Beautiful_",
    },
    playlist: [],
    // Song will be played next
    songQueue: [],
    // Song has been played
    songQueuePlayed: [],
    isPlaying: false,
    currentTime: 0,
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
      if (state.repeat === true) {
        const currentSongCopy = { ...state.currentSong }; // Tạo bản sao của currentSong
        state.songQueue = [currentSongCopy, ...state.songQueue]; // Thêm bản sao vào đầu mảng
      }
      if (state.repeat === false) {
        // Xóa bản sao của currentSong khỏi đầu mảng songQueue
        state.songQueue.shift();
      }
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
