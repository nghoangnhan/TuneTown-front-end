import { Swiper, SwiperSlide } from "swiper/react";
import PlaylistItem from "./PlaylistItem";

const PlaylistSection = () => {
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
