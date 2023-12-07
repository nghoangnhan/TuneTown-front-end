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
      songLinkArray: [
        "https://firebasestorage.googleapis.com/v0/b/tunetown-6b63a.appspot.com/o/audios%2Fbabe%20kajima%2Fbabe%20kajima_1.mp3?alt=media&token=29b10cca-12b3-492f-a316-642e6d897396",
        "https://firebasestorage.googleapis.com/v0/b/tunetown-6b63a.appspot.com/o/audios%2Fbabe%20kajima%2Fbabe%20kajima_2.mp3?alt=media&token=edf54995-84e8-46a9-a342-8378fcdd76ae",
        "https://firebasestorage.googleapis.com/v0/b/tunetown-6b63a.appspot.com/o/audios%2Fbabe%20kajima%2Fbabe%20kajima_3.mp3?alt=media&token=74385b3f-3085-4f01-aad5-c741cfba4556",
        "https://firebasestorage.googleapis.com/v0/b/tunetown-6b63a.appspot.com/o/audios%2Fbabe%20kajima%2Fbabe%20kajima_4.mp3?alt=media&token=86bd1c56-83f2-46d0-b0f4-388ab395efd8",
        "https://firebasestorage.googleapis.com/v0/b/tunetown-6b63a.appspot.com/o/audios%2Fbabe%20kajima%2Fbabe%20kajima_5.mp3?alt=media&token=7ffb8f6c-f7ea-4e32-8c25-33b5c222c4ae",
        "https://firebasestorage.googleapis.com/v0/b/tunetown-6b63a.appspot.com/o/audios%2Fbabe%20kajima%2Fbabe%20kajima_6.mp3?alt=media&token=0ad2bd34-54b7-47b4-a2e7-ac34ba227e5d",
        "https://firebasestorage.googleapis.com/v0/b/tunetown-6b63a.appspot.com/o/audios%2Fbabe%20kajima%2Fbabe%20kajima_7.mp3?alt=media&token=9f48f901-69c5-4174-b16c-3e1bcdd43745",
        "https://firebasestorage.googleapis.com/v0/b/tunetown-6b63a.appspot.com/o/audios%2Fbabe%20kajima%2Fbabe%20kajima_8.mp3?alt=media&token=46e7f688-65f8-4463-829a-ece0e295741f",
        "https://firebasestorage.googleapis.com/v0/b/tunetown-6b63a.appspot.com/o/audios%2Fbabe%20kajima%2Fbabe%20kajima_9.mp3?alt=media&token=efe48b6d-68c7-4a97-b695-6e9f56ace32e",
        "https://firebasestorage.googleapis.com/v0/b/tunetown-6b63a.appspot.com/o/audios%2Fbabe%20kajima%2Fbabe%20kajima_10.mp3?alt=media&token=e39ad2bf-72c6-47c9-8b6c-38fe0ebad2e2",
      ],
    },
    playlist: [],
    // Song will be played next
    songQueue: [
      {
        id: 1,
        songName: "What make you beautiful 2",
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
    // Song has been played
    songQueuePlayed: [],
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
  addSongToQueue,
  removeSongFromQueue,
  playNextSong,
  playPreviousSong,
} = musicStore.actions;

export default musicStore.reducer;
