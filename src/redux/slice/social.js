import { createSlice } from "@reduxjs/toolkit";

const socialStore = createSlice({
  name: "social",
  initialState: {
    isOnline: false,
    isNewMessage: false,
    currentChat: {
      chatId: null,
      userName: "",
      message: "",
      time: "",
      avatar: null,
      communityId: null,
      communityName: "",
      communityAvatar: "",
      communityHost: "",
      approveRequests: [],
      hosts: {},
      joinUsers: [],
    },

    isReplying: false,
    replyComment: {
      replyCommentId: null,
      userName: "",
      content: "",
      time: "",
    },
    refreshChatList: false,
    refreshPost: false,
  },
  reducers: {
    setChatId: (state, action) => {
      state.currentChat.chatId = action.payload;
    },
    setChatChosen: (state, action) => {
      state.currentChat = action.payload;
    },
    setCurrentCommunity: (state, action) => {
      state.currentCommunity = action.payload;
    },
    setCommunityId: (state, action) => {
      state.currentCommunity.communityId = action.payload;
    }
    ,
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
    setRefreshPost: (state, action) => {
      state.refreshPost = action.payload;
    },
    setRefreshChat: (state, action) => {
      state.refreshChatList = action.payload;
    }
  },
});

export const {
  setChatChosen,
  setChatId,
  setCurrentCommunity, setCommunityId,
  setIsNewMessage,
  setIsReply,
  setReplyCommentId,
  setReplyComment, setRefreshPost, setRefreshChat
} = socialStore.actions;
export default socialStore.reducer;
