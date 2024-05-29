/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
import axios from "axios";
import UseCookie from "../hooks/useCookie";
import { useState } from "react";
import useConfig from "./useConfig";
import { message } from "antd";
import { setRefershAccount } from "../redux/slice/account";
import { useDispatch } from "react-redux";

const useUserUtils = () => {
  const { getToken } = UseCookie();
  const { access_token } = getToken();
  const { Base_URL } = useConfig();
  const dispatch = useDispatch();
  const CheckCookie = () => {
    if (access_token) {
      return true;
    }
    return false;
  };

  const checkToken = async () => {
    try {
      const response = await axios.post(
        `${Base_URL}/auth/checkToken`,
        {},
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      if (response.status !== 200 && response.status !== 201) {
        return false;
      }
      return true;
    } catch (error) {
      console.log("Error:", error);
      return false;
    }
  };

  // Get user information from API
  const getUserInfor = async (userId) => {
    try {
      const response = await axios.get(`${Base_URL}/users?userId=${userId}`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      console.log(response.data, response.status);
      dispatch(setRefershAccount(false));
      return response.data;
    } catch (error) {
      // Handle network errors or other exceptions
      console.error("Error edited user:", error.message);
    }
  };

  const getUserPost = async (authorId) => {
    try {
      const response = await axios.get(
        `${Base_URL}/post/getByAuthorId?authorId=${authorId}`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      console.log("getUserPost Response", response.data);
      return response.data;
    } catch (error) {
      console.log("Error:", error);
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

  const followArtist = async (artistId) => {
    try {
      const response = await axios.get(
        `${Base_URL}/users/follow?userId=${artistId}`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      console.log("Follow Artist Response", response.data);
      return response.data;
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const getAllGenres = async () => {
    try {
      const response = await axios.get(`${Base_URL}/songs/getAllGenres`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      console.log("getAllGenres Response", response.data);
      return response.data;
    } catch (error) {
      console.log("Error:", error);
    }
  };

  // Update user infor to API
  const editUser = async (values) => {
    try {
      const response = await axios.put(`${Base_URL}/users`, values, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      dispatch(setRefershAccount(true));
      if (response.status === 200) {
        // Handle success
        console.log("User edited successfully:", response.data);
        message.success("User edited successfully");
      }
    } catch (error) {
      // Handle network errors or other exceptions
      console.error("Error edited user:", error.message);
      message.error(`Error edited user ${error.message}`);
    }
  };

  const CheckCommunityExist = async (artistId) => {
    try {
      const response = await axios.post(
        `${Base_URL}/users/checkCommunityExist?artistId=${artistId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.log("Error:", error);
    }
  };

  return {
    CheckCookie,
    checkToken,
    getUserInfor,
    getArtistByArtistId,
    getAllGenres,
    getUserPost,
    followArtist,
    editUser,
    CheckCommunityExist,
  };
};
export default useUserUtils;
