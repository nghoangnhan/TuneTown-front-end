import { Swiper, SwiperSlide } from "swiper/react";
import PlaylistItem from "./PlaylistItem";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { Base_URL, auth } from "../../api/config";
import axios from "axios";

const PlaylistSection = () => {
  //Fetch data from the server http://localhost:8080/playlists?userId=505
  const dispatch = useDispatch();
  const [playlistList, setPlaylistList] = useState();

  const getListSong = async () => {
    try {
      console.log("auth", auth.access_token);
      const response = await axios.get(`${Base_URL}/playlists?userId=505`, {
        headers: {
          Authorization: `Bearer ${auth.access_token}`,
        },
      });

      console.log("songList Response", response.data);
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
        className="xl:mt-7 mt-4 pl-3 xl:pl-2"
        spaceBetween={50}
        grabCursor={"true"}
        slidesPerView={"auto"}
        direction={"horizontal"}
      >
        <SwiperSlide>
          <PlaylistItem></PlaylistItem>
        </SwiperSlide>
        <SwiperSlide>
          <PlaylistItem></PlaylistItem>
        </SwiperSlide>
        <SwiperSlide>
          <PlaylistItem></PlaylistItem>
        </SwiperSlide>
        <SwiperSlide>
          <PlaylistItem></PlaylistItem>
        </SwiperSlide>
        <SwiperSlide>
          <PlaylistItem></PlaylistItem>
        </SwiperSlide>
        <SwiperSlide>
          <PlaylistItem></PlaylistItem>
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export default PlaylistSection;
