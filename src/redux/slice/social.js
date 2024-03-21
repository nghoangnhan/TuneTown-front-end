import { createSlice } from "@reduxjs/toolkit";

const socialStore = createSlice({
  name: "social",
  initialState: {
    isOnline: false,
    currentChat: {
      currentChatId: "",
      conversation: [],
    },
  },
  reducers: {
    setChatChosen: (state, action) => {
      state.currentChat.currentChatId = action.payload;
    },
  },
});

export const { setChatChosen } = socialStore.actions;
export default socialStore.reducer;
