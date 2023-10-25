import { createSlice } from "@reduxjs/toolkit";
const accountStore = createSlice({
  name: "account",
  initialState: {
    usersInfor: {
      id: 505,
      userName: "Nguyen Hoang Nhan",
      email: "test@gmail.com",
      password: "$2a$10$biLULL30K.AT7PFGM3in3OBAfP0HiYClyYOwtxNuNWAwvhv06S10.",
      role: "USER",
      birthDate: "2002-07-21",
      userBio: null,
      avatar: null,
      history: [],
      favoriteGenres: [],
      followingArtists: [],
    },
    account: [],
    listAccount: [],
  },
  reducers: {
    authLogin: () => {},
    authRegister: () => {},
    setUser: (state, action) => {
      return {
        ...state,
        account: action.payload,
      };
    },
    setListAccount: (state, action) => {
      return {
        ...state,
        listAccount: action.payload,
      };
    },
    setUserInfor: (state, action) => {
      return {
        ...state,
        usersInfo: action.payload,
      };
    },
  },
});
//Action
export const {
  authLogin,
  authRegister,
  setUser,
  setListAccount,
  setUserInfor,
} = accountStore.actions;
//Reducer
export default accountStore.reducer;
