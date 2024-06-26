import { configureStore } from "@reduxjs/toolkit";
import accountReducer from "../slice/account";
import musicReducer from "../slice/music";
import playlistReducer from "../slice/playlist";
import volumeReducer from "../slice/volume";
import socialReducer from "../slice/social";

const store = configureStore({
  reducer: {
    account: accountReducer,
    music: musicReducer,
    playlist: playlistReducer,
    volume: volumeReducer,
    social: socialReducer,
  },
});
export default store;
