/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
import axios from "axios";
import UseCookie from "../hooks/useCookie";
import { Base_URL } from "../api/config";
import { useState } from "react";

const useUserUtils = () => {
  const { getToken } = UseCookie();
  const { access_token } = getToken();

  const CheckCookie = () => {
    if (access_token) {
      return true;
    }
    return false;
  };

  // Get user information from API
  const getUserInfor = async (userId) => {
    const [userInfor, setUserInfor] = useState({});
    try {
      const response = await axios.get(`${Base_URL}/users?userId=${userId}`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
        body: {},
      });
      console.log(response.data, response.status);
      setUserInfor(response.data.user);
      // setUserName(response.data.user.userName);
    } catch (error) {
      // Handle network errors or other exceptions
      console.error("Error edited user:", error.message);
    }
  };
  const getArtistByArtistId = async (artistId) => {
    try {
      const response = await axios.post(
        `${Base_URL}/users/getArtistDetail?artistId=${artistId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      console.log("getArtistByArtistId Response", response.data);
      return response.data;
    } catch (error) {
      console.log("Error:", error);
    }
  };

  return { CheckCookie, getUserInfor, getArtistByArtistId };
};
export default useUserUtils;
