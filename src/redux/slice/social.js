import { createSlice } from "@reduxjs/toolkit";

const socialStore = createSlice({
  name: "social",
  initialState: {
    isOnline: false,
    isNewMessage: false,
    currentChat: {
      chatId: Number,
      name: "",
      message: "",
      time: "",
      avatar: null,
    },
  },
  reducers: {
    setChatId: (state, action) => {
      state.currentChat.chatId = action.payload;
    },
    setChatChosen: (state, action) => {
      state.currentChat = action.payload;
    },
    setIsNewMessage: (state, action) => {
      state.isNewMessage = action.payload;
    },
  },
});

export const { setChatChosen, setChatId, setIsNewMessage } =
  socialStore.actions;
export default socialStore.reducer;
