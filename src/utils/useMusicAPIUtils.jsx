import axios from "axios";
import UseCookie from "../hooks/useCookie";
import useConfig from "./useConfig";

export const useMusicAPIUtils = () => {
  const { getToken } = UseCookie();
  const { access_token } = getToken();
  const { Base_URL } = useConfig();

  // Get list song to show homepage
  const getListSong = async (songPage) => {
    try {
      const response = await axios.get(`${Base_URL}/songs?page=${songPage ? songPage : " "}`, {
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
      // console.log("My PlaylistList Response", response.data);
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
      // console.log("MyDetailPlaylist || SongList Response", response.data);
      return response.data;
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const getSongById = async (songId) => {
    try {
      const response = await axios.get(`${Base_URL}/songs/getSongById?songId=${songId}`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      console.log("SongDetail Response", response.data);
      return response.data;
    } catch (error) {
      console.log("Error:", error);
    }
  };

  // Edit playlist of user
  const editPlaylist = async (
    playlistId,
    playlistName,
    playlistType,
    coverArt
  ) => {
    try {
      const response = await axios.put(
        `${Base_URL}/playlists/editPlaylist`,
        {
          id: playlistId,
          playlistName: playlistName,
          playlistType: playlistType,
          coverArt: coverArt,
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
  // http://localhost:8080/users/addToHistory?userId=702&songId=607
  const addSongToHistory = async (userId, songId) => {
    try {
      const response = await axios.post(
        `${Base_URL}/users/addToHistory?userId=${userId}&songId=${songId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      console.log("addSongToHistory Response", response.data);
      return response.data;
    } catch (error) {
      console.log("Error:", error);
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
  const combineData = async (songId, mp3Link) => {
    try {
      const response = await axios.post(
        `${Base_URL}/songs/combineData?songId=${songId}`,
        {
          mp3Link: mp3Link
        },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
            Accept: 'application/octet-stream' // Specify the expected response content type
          },
          responseType: 'arraybuffer' // Tell Axios to expect a binary response
        }
      );
      return response.data;
    } catch (error) {
      console.log("Error:", error);
      return { success: false, error: error.message };
    }
  };
  const getPlaylistByUserId = async (userId) => {
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
      return { success: false, error: error.message };
    }
  }

  const getRecommendPlaylist = async () => {
    try {
      const response = await axios.get(`${Base_URL}/playlists/get-recommend-songs`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      )
      return response.data
    } catch (error) {
      console.log(error)
    }
  }

  return {
    addSongToPlaylist,
    getListSong,
    getSongById,
    getUserPlaylist,
    getListSongPlaylist,
    getPlaylistByPlaylistId,
    editPlaylist,
    addSongToHistory,
    deletePlaylist,
    deleteSongInPlaylist,
    deleteSong,
    combineData,
    getPlaylistByUserId, getRecommendPlaylist
  };
};
