import UseCookie from "../hooks/useCookie";
import axios from "axios";
const { getToken } = UseCookie();

export const Base_URL = "http://localhost:8080";
export const Base_Ava =
  "https://i.pinimg.com/564x/08/e4/58/08e458a736a3c0365612771772fa4904.jpg";
// token return an object {access_token, refress_Token}
const token = getToken();
export const auth = {
  access_token: token.access_token,
  refresh_token: token.refresh_token,
};

export const instance = axios.create({
  Base_URL,
  headers: {
    "Content-Type": "application/json",
  },
  params: {},
});
instance.interceptors.response.use(
  function (response) {
    if (response.data) {
      return response.data;
    }
    return response;
  },
  function (error) {
    return Promise.reject(error);
  }
);
