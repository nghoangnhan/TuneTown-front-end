/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
import axios from "axios";
import UseCookie from "../hooks/useCookie";
import { useState } from "react";
import useConfig from "./useConfig";

const useUserUtils = () => {
  const { getToken } = UseCookie();
  const { access_token } = getToken();
  const { Base_URL } = useConfig();

  const CheckCookie = () => {
    if (access_token) {
      return true;
    }
    return false;
  };

  // Get user information from API
  const getUserInfor = async (userId) => {
    try {
      const response = await axios.get(`${Base_URL}/users?userId=${userId}`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
        body: {},
      });
      console.log(response.data, response.status);
      return response.data;
    } catch (error) {
      // Handle network errors or other exceptions
      console.error("Error edited user:", error.message);
    }
  };

  const getUserPost = async (authorId) => {
    try {
      const response = await axios.get(`${Base_URL}/post/getByAuthorId?authorId=${authorId}`, {
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      })
      console.log("getUserPost Response", response.data);
      return response.data;
    } catch (error) {
      console.log("Error:", error);
    }
  }

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

  const followArtist = async (userId, artistId) => {
    try {
      const response = await axios.post(
        `${Base_URL}/users/follow`,
        {
          "follower": {
            "id": userId
          }, "subject": {
            "id": artistId
          }
        },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        })
      console.log("Follow Artist Response", response.data);
      return response.data;
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const unfollowArtist = async (userId, artistId) => {
    try {
      const response = await axios.post(
        `${Base_URL}/users/unfollowArtist?artistId=${artistId}`,
        {
          "follower": {
            "id": userId
          }, "subject": {
            "id": artistId
          }
        },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        })
      console.log("Unfollow Artist Response", response.data);
      return response.data;
    }
    catch (error) {
      console.log("Error:", error);
    }
  }

  return { CheckCookie, getUserInfor, getArtistByArtistId, getUserPost, followArtist, unfollowArtist };
};
export default useUserUtils;
