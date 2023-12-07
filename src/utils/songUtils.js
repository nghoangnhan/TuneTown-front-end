/* eslint-disable no-unused-vars */
import { useDispatch, useSelector } from "react-redux";
import { setDuration } from "../redux/slice/music";
import { useRef } from "react";
import axios from "axios";
import { Base_URL } from "../api/config";
import UseCookie from "../hooks/useCookie";

export const useSongDuration = () => {
  const dispatch = useDispatch();

  //     const { setDuration } = useMusicSlice();
  //   // Get the duration of the song
  //   const getSongDuration = (songTime) => {
  //       dispatch(setDuration(songTime.duration))

  //       return duration;
  //     };

  // Transform seconds to minutes:seconds
  const isPlaying = useSelector((state) => state.music.isPlaying);
  const TimeConvert = (sec) => {
    const minutes = Math.floor(sec / 60);
    const seconds = Math.floor(sec % 60);
    const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
    return `${minutes}:${formattedSeconds}`;
  };
  const showArtist = (artistName) => {
    if (artistName.length > 1) {
      return artistName.join(", ");
    } else {
      return artistName[0];
    }
  };
  // Acronym the name of the song
  const AcronymName = (nameLenght, length) => {
    if (nameLenght && nameLenght.length > 10) {
      return nameLenght.slice(0, length) + "...";
    } else {
      return nameLenght;
    }
  };
  // Get Song fragment
  const GetSongFragment = (audioSrc) => {
    document.addEventListener("DOMContentLoaded", function () {
      const btnPlay = document.getElementById("play");
      const audio = document.getElementById("audio");
      let arrayAudio = "";
      let loop = 2;
      btnPlay.addEventListener("click", function () {
        audio.src = audioSrc + 1 + ".mp3";
        audio.play();
      });
      audio.addEventListener("timeupdate", function () {
        let currentTime = audio.currentTime;
        if (audio.duration - currentTime >= 5) {
          if (loop <= 10) {
            arrayAudio = audioSrc + loop + ".mp3";
          }
        }
      });
      audio.addEventListener("ended", function () {
        audio.src = arrayAudio;
        audio.play();
        loop++;
      });
    });
  };

  // Check if the song isPlaying
  const CheckPlaying = (audioRef) => {
    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  };
  // Get the max duration of the song
  const GetSongDuration = (audioRef) => {
    const audioElement = new Audio(audioRef);
    const duration = audioElement.current.duration;
    console.log(`The duration of the song is ${duration} seconds`);
    dispatch(setDuration(audioElement.current.duration));
  };

  return {
    TimeConvert,
    GetSongFragment,
    showArtist,
    AcronymName,
    CheckPlaying,
    GetSongDuration,
  };
};
export default useSongDuration;

export const useMusicAPI = () => {
  const { getToken } = UseCookie();
  const { access_token } = getToken();

  // Get list song to show homepage
  const getListSong = async (userId, songPage) => {
    try {
      const response = await axios.get(`${Base_URL}/songs?page=${songPage}`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      const { songList, currentPage, totalPages } = response.data;
      console.log("ListSong Response", songList, currentPage, totalPages);
      return response.data;
    } catch (error) {
      console.log("Error:", error);
    }
  };

  // Get playlist of user
  const getUserPlaylist = async (userId) => {
    try {
      const response = await axios.get(
        `${Base_URL}/playlists/getUserPlaylists?userId=${userId}`,
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

  // GetPlaylist by playlistId
  const getPlaylistByPlaylistId = async (playlistId) => {
    try {
      const response = await axios.get(
        `${Base_URL}/playlists?playlistId=${playlistId}`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      console.log("PlaylistDetail Response", response.data);
      return response.data;
    } catch (error) {
      console.log("Error:", error);
    }
  };

  // Get song in playlist
  const getListSongPlaylist = async (playlistId) => {
    try {
      const response = await axios.get(
        `${Base_URL}/playlists/getPlaylistSongs?playlistId=${playlistId}`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      console.log("MyDetailPlaylist || SongList Response", response.data);
      console.log(
        "MyDetailPlaylist || PLaylistDetail Response",
        response.data[0].playlist
      );
      return response.data;
    } catch (error) {
      console.log("Error:", error);
    }
  };
  // Edit playlist of user
  const editPlaylist = async (playlistId, playlistName, playlistType) => {
    try {
      const response = await axios.put(
        `${Base_URL}/playlists/editPlaylist`,
        {
          id: playlistId,
          playlistName: playlistName,
          playlistType: playlistType,
          playlistSongsList: [],
        },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      if (response.status === 200) {
        console.log("Playlist edited successfully", response.data);
        // eslint-disable-next-line no-undef
        messageApi.open({
          type: "success",
          content: "Edited Successfully",
        });
      }
    } catch (error) {
      console.error("Error edited playlist:", error.message);
    }
  };

  // Delete playlist
  const deletePlaylist = async (playlistId) => {
    try {
      if (
        confirm(
          `Are you sure you want to delete this playlist? id: ${playlistId}`
        ) == true
      ) {
        const response = await axios.delete(
          `${Base_URL}/playlists?playlistId=${playlistId}`,
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          }
        );
        console.log("songList Response", response.data);
        // Refresh the component
        return response.data;
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };

  // Add song to playlist
  // http://localhost:8080/playlists?songId=1&playlistId=343
  const addSongToPlaylist = async (songId, playlistId) => {
    try {
      const response = await axios.put(
        `${Base_URL}/playlists?songId=${songId}&playlistId=${playlistId}`,
        {
          songId: songId,
          playlistId: playlistId,
        },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      console.log("songList Response", response.data);
      if (response.status === 200) {
        // Return a success flag or any relevant data
        return { success: true, data: response.data };
      } else {
        // Return an error flag or relevant error data
        return { success: false, error: response.data };
      }
    } catch (error) {
      console.log("Error:", error);
      // Return an error flag or relevant error data
      return { success: false, error: error.message };
    }
  };

  // Delete a song in CMS
  const deleteSong = async (songId) => {
    try {
      if (confirm(`Are you sure you want to delete this song?`) == true) {
        const response = await axios.delete(
          `${Base_URL}/songs/deleteSong?songId=${songId}`,
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          }
        );
        if (response.status === 200) {
          return { success: true, data: response.data };
        } else {
          return { success: false, error: response.data };
        }
      }
    } catch (error) {
      console.log("Error:", error);
      return { success: false, error: error.message };
    }
  };

  // Delete a song in playlist
  const deleteSongInPlaylist = async (songId, playlistId) => {
    try {
      console.log("deleteSongInPlaylist", songId, playlistId);
      if (
        confirm(
          `Are you sure you want to delete this song in playlist? id: ${songId} playlistId: ${playlistId}`
        ) == true
      ) {
        const response = await axios.delete(
          `${Base_URL}/playlists/deletePlaylistSongs`,

          {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
            data: {
              id: songId,
              playlist: { id: playlistId },
            },
          }
        );
        console.log("songList Response", response.data);
        // Refresh the component
        return response.status;
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };
  return {
    addSongToPlaylist,
    getListSong,
    getUserPlaylist,
    getListSongPlaylist,
    getPlaylistByPlaylistId,
    editPlaylist,
    deletePlaylist,
    deleteSongInPlaylist,
    deleteSong,
  };
};