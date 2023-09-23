import { Swiper, SwiperSlide } from "swiper/react";
import PlaylistItem from "./PlaylistItem";

const PlaylistSection = () => {
  return (
    <div className="playlist-section xl:w-full">
      <h1 className="text-[#2E3271] text-xl font-bold">Chart: Top 50</h1>
      <Swiper
        className="mt-7"
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
