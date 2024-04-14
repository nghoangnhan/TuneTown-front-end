import { createSlice } from "@reduxjs/toolkit";

const socialStore = createSlice({
  name: "social",
  initialState: {
    isOnline: false,
    isNewMessage: false,
    currentChat: {
      chatId: Number,
      userName: "",
      message: "",
      time: "",
      avatar: null,
    },
    isReplying: false,
    replyComment: {
      replyCommentId: Number,
      userName: "",
      content: "",
      time: "",
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
    setIsReply: (state, action) => {
      state.isReplying = action.payload;
    },
    setReplyCommentId: (state, action) => {
      state.replyComment.replyCommentId = action.payload;
    },
    setReplyComment: (state, action) => {
      const { author, content, commentDate } = action.payload;
      state.replyComment = {
        userName: author.userName,
        content: content,
        time: commentDate,
      };
    },
  },
});

export const {
  setChatChosen,
  setChatId,
  setIsNewMessage,
  setIsReply,
  setReplyCommentId,
  setReplyComment,
} = socialStore.actions;
export default socialStore.reducer;
