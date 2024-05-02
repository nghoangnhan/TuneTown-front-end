import { createSlice } from "@reduxjs/toolkit";
const accountStore = createSlice({
  name: "account",
  initialState: {
    usersInfor: {
      id: 0,
      userName: "",
      email: "",
      password: null,
      role: "",
      birthDate: "",
      userBio: "",
      avatar: "",
      history: [],
      favoriteGenres: [],
      followingArtists: [],
    },
    account: [],
    listAccount: [],
    refreshAccount: false,
  },
  reducers: {
    authLogin: () => { },
    authRegister: () => { },
    setListUser: (state, action) => {
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
        usersInfor: action.payload,
      };
    },
    setUserId: (state, action) => {
      state.usersInfor.id = action.payload;
    },
    setUserName: (state, action) => {
      state.usersInfor.userName = action.payload;
    },
    setUserRole: (state, action) => {
      state.usersInfor.role = action.payload;
    },
    setUserAccount: (state, action) => {
      return {
        ...state,
        account: action.payload,
      };
    },
    setRefershAccount: (state, action) => {
      state.refreshAccount = action.payload;
    }
  },
});
//Action
export const {
  authLogin, authRegister, setRefershAccount,
  setUser, setListAccount, setUserInfor, setUserId,
  setUserName, setUserRole, setUserAccount,
} = accountStore.actions;
//Reducer
export default accountStore.reducer;
