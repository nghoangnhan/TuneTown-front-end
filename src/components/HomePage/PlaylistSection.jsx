/* eslint-disable react/prop-types */
import { Swiper, SwiperSlide } from "swiper/react";
import PlaylistItem from "../Playlist/PlaylistItem";
import { useEffect, useState } from "react";
import { useMusicAPIUtils } from "../../utils/useMusicAPIUtils";

const PlaylistSection = ({ playlistTitle }) => {
  const { getUserPlaylist } = useMusicAPIUtils();
  const userId = localStorage.getItem("userId");
  const [playlistList, setPlaylistList] = useState();

  useEffect(() => {
    getUserPlaylist(userId).then((data) => {
      setPlaylistList(data);
    });
  }, []);

  return (
    <div className="px-3 py-3 m-auto mx-1 mt-4 shadow-md bg-backgroundComponentPrimary dark:bg-backgroundComponentDarkPrimary rounded-2xl xl:h-fit xl:mx-5 xl:mt-8 xl:py-5 xl:px-5">
      <div className="py-2 playlist-section xl:w-full">
        <h1 className="text-xl font-bold text-center text-primary xl:text-2xl">
          {playlistTitle}
        </h1>
        <Swiper
          className="pl-2 mt-5 xl:mt-10 xl:pl-2"
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
