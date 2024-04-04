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
    isReplying: false,
    replyCommentId: Number,
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
    setIsReply: (state, action) => {
      state.isReplying = action.payload;
    },
    setReplyCommentId: (state, action) => {
      state.replyCommentId = action.payload;
    },
  },
});

export const {
  setChatChosen,
  setChatId,
  setIsNewMessage,
  setIsReply,
  setReplyCommentId,
} = socialStore.actions;
export default socialStore.reducer;
