/* eslint-disable no-unused-vars */
import { createSlice } from "@reduxjs/toolkit";
import MakeUBeauti from "../../assets/music/What_Makes_You_Beautiful.mp3";
import HappyNewYear from "../../assets/music/HappyNewYear.mp3";
import BlindingLight from "../../assets/music/BlindingLight.mp3";

const musicStore = createSlice({
  name: "music",
  initialState: {
    currentSong: {
      id: 2,
      songName: "One Of The Girls",
      artists: [
        {
          id: "c3a83bc2-a6c2-ba0e-c3a9-4bc2b6c290c2",
          userName: "The Weeknd",
        },
      ],
      currentTime: 0,
      songDuration: 214,
      songCover:
        "https://firebasestorage.googleapis.com/v0/b/tunetown-6b63a.appspot.com/o/images%2Foneofthegirl.jpg?alt=media&token=b14195a6-74d2-4559-bd73-ff1c25f0c494",
      songData:
        "https://storage.googleapis.com/tunetown-6b63a.appspot.com/audios/One-of-the-girls/One-of-the-girls_",
      // HappyNewYear,
      lyric: `
     <p>You're insecure</p><p>Don't know what for</p>
     <p>You're turning heads when you walk through the door-or-or</p>
     <p>Don't need make-up</p><p>To cover up</p>
     <p>Being the way that you are is enough-ugh-ugh</p>
     <p><br></p><p>Everyone else in the room can see it</p>
     <p>Everyone else but you-ou</p><p><br></p>
     <p>Baby you light up my world like nobody else</p>
     <p>The way that you flip your hair gets me overwhelmed</p>
     <p>But when you smile at the ground it ain't hard to tell</p>
     <p>You don't know-ow-ow</p><p>You don't know you're beautiful</p>
     <p><br></p><p>If only you saw what I can see</p>
     <p>You'll understand why I want you so desperately</p>
     <p>Right now I'm looking at you and I can't believe</p>
     <p>You don't know-ow-ow</p><p>You don't know you're beautiful</p>
     <p>Oh-oh-oh</p><p><br></p><p>That's what makes you beautiful</p><p><br></p>
     <p>So c-c-come on</p><p>You got it wrong</p>
     <p>To prove I'm right I put it in a song-ong-ong</p><p>I don't know why</p>
     <p>You're being shy</p><p>And turn away when I look into your eye-ye-yes</p>
      `,
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
