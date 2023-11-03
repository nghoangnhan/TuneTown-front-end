import { Swiper, SwiperSlide } from "swiper/react";
import PlaylistItem from "./PlaylistItem";
import { useEffect, useState } from "react";
import { Base_URL } from "../../api/config";
import UseCookie from "../../hooks/useCookie";
import axios from "axios";

const PlaylistSection = () => {
  const { getToken } = UseCookie();
  const { access_token } = getToken();
  const userId = localStorage.getItem("userId");
  const [playlistList, setPlaylistList] = useState();
  const [refresh, setRefresh] = useState(false);

  // Call this function when you want to refresh the playlist
  const refreshPlaylist = () => {
    setRefresh(!refresh);
  };

  const getListSong = async () => {
    try {
      console.log("auth", access_token);
      const response = await axios.get(
        `${Base_URL}/playlists?userId=${userId}`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      console.log("songList Response", response.data);
      return response.data;
    } catch (error) {
      console.log("Error:", error);
    }
  };
  // Create a new playlist
  const CreateNewPlaylist = async () => {
    try {
      console.log("PlaylistPage || auth", access_token);
      const response = await axios.post(
        `${Base_URL}/playlists?userId=${userId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      if (response.status == 200) {
        console.log("Create new playlist successfully");
        alert("Create new playlist successfully");
        refreshPlaylist();
        // setRefresh(!refresh);
      }
      return response.data;
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const deletePlaylist = async (playlistId) => {
    try {
      confirm(`Are you sure you want to delete this playlist?`);
      if (confirm) {
        console.log("auth", access_token);
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
        refreshPlaylist();
        return response.data;
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };

  useEffect(() => {
    getListSong().then((data) => setPlaylistList(data));
    console.log("refresh", refresh);
  }, [refresh]);

  // dispatch(setPlaylistList(playlistList));
  // if (!playlistList) return null;
  // console.log("playlistttt", playlistList);
  return (
    <div className="playlist-section xl:w-full py-2">
      <button
        onClick={CreateNewPlaylist}
        className=" border-solid border border-[#54f466] text-[#3ecd4f] hover:text-white  bg-[#ffffff71] hover:bg-[#40cf62] rounded-md mb-5 mt-3 ml-3"
      >
        <div className="font-bold px-2 py-2">+ Create New Playlist</div>
      </button>
      <Swiper
        className="xl:mt-4 mt-2 pl-3 xl:pl-2"
        spaceBetween={50}
        grabCursor={"true"}
        slidesPerView={"auto"}
        direction={"horizontal"}
      >
        {playlistList &&
          playlistList.map((playlistItem) => (
            <SwiperSlide
              key={playlistItem.id}
              onContextMenu={(event) => {
                event.preventDefault();
                deletePlaylist(playlistItem.id);
              }}
            >
              <PlaylistItem
                key={playlistItem.id}
                id={playlistItem.id}
                playlistName={playlistItem.playlistName}
                playlistType={playlistItem.playlistType}
                users={playlistItem.users}
                coverArt={playlistItem.coverArt}
              ></PlaylistItem>
            </SwiperSlide>
          ))}
      </Swiper>
    </div>
  );
};

export default PlaylistSection;
