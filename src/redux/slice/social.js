import { createSlice } from "@reduxjs/toolkit";

const socialStore = createSlice({
  name: "social",
  initialState: {
    isOnline: false,
    currentChat: {
      chatId: Number,
      name: "",
      message: "",
      time: "",
      avatar: null,
    },
  },
  reducers: {
    setChatChosen: (state, action) => {
      state.currentChat = action.payload;
    },
  },
});

export const { setChatChosen } = socialStore.actions;
export default socialStore.reducer;
