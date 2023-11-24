import { Swiper, SwiperSlide } from "swiper/react";
import PlaylistItem from "../Playlist/PlaylistItem";
import { useEffect, useState } from "react";
import { Base_URL } from "../../api/config";
import UseCookie from "../../hooks/useCookie";
import axios from "axios";

const PlaylistSection = ({ playlistTitle }) => {
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

  useEffect(() => {
    getListSong().then((data) => setPlaylistList(data));
  }, [refresh]);

  return (
    <div className="bg-[#FFFFFFCC] rounded-2xl max-xl:w-full m-auto xl:h-fit xl:ml-5 xl:mr-5 xl:mt-5 mt-4 pt-3 xl:pt-5 pl-3 xl:pl-5 pr-3 xl:pr-5 pb-3 xl:pb-5">
      <div className="playlist-section xl:w-full py-2">
        <h1 className="text-[#2E3271] text-xl font-bold">{playlistTitle}</h1>
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
    </div>
  );
};

export default PlaylistSection;
