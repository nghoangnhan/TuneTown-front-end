import { Swiper, SwiperSlide } from "swiper/react";
import PlaylistItem from "./PlaylistItem";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Base_URL, auth } from "../../api/config";
import axios from "axios";

const PlaylistSection = () => {
  //Fetch data from the server http://localhost:8080/playlists?userId=505
  const userId = useSelector((state) => state.account.usersInfor.id);
  const [playlistList, setPlaylistList] = useState();

  const getListSong = async () => {
    try {
      console.log("auth", auth.access_token);
      const response = await axios.get(
        `${Base_URL}/playlists?userId=${userId ? userId : 505}`,
        {
          headers: {
            Authorization: `Bearer ${auth.access_token}`,
          },
        }
      );
      console.log("songList Response", response.data);
      setPlaylistList(response.data);
      return response.data;
    } catch (error) {
      console.log("Error:", error);
    }
  };

  useEffect(() => {
    getListSong();
  }, []);
  // dispatch(setPlaylistList(playlistList));
  // if (!playlistList) return null;
  // console.log("playlistttt", playlistList);
  return (
    <div className="playlist-section xl:w-full py-2">
      <Swiper
        className="xl:mt-4 mt-2 pl-3 xl:pl-2"
        spaceBetween={50}
        grabCursor={"true"}
        slidesPerView={"auto"}
        direction={"horizontal"}
      >
        {playlistList &&
          playlistList.map((playlistItem) => (
            <SwiperSlide key={playlistItem.id}>
              <PlaylistItem
                key={playlistItem.id}
                // playlistItem={playlistItem}
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
