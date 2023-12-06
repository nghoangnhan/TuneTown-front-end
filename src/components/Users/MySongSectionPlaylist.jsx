/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import SongItemPlaylist from "./SongItemPlaylist";
import { useSelector } from "react-redux";
// import { useDispatch } from "react-redux";

const MySongSectionPlaylist = ({ songData }) => {
  const [songList, setSongList] = useState();
  const refreshPlaylist = useSelector(
    (state) => state.playlist.refreshPlaylist
  );

  useEffect(() => {
    setSongList(songData);
    console.log("MySongSectionPlaylist || SongList", songList);
  }, [songData, refreshPlaylist]);
  if (!songList) return null;
  return (
    <div className="xl:w-full w-full bg-[#ecf2fd]">
      <div className="bg-[#2f9948] hover:bg-[#40cf62] rounded-md mb-5 px-2 py-1 text-white font-bold w-fit h-fit flex flex-row gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5"
          />
        </svg>
        <button className="">Edit Order Song</button>
      </div>
      <div className="flex flex-row justify-between items-center mt-5 mb-5 text-[#4b4848]">
        <div className="flex flex-row gap-8 ml-8">
          <div className=" text-center font-bold">ID</div>
          <div className=" text-center font-bold">Song Details</div>
        </div>
        <div>
          <div className=" text-center font-bold">Duration</div>
        </div>
      </div>
      <div className="mt-2 flex flex-col gap-1">
        {songList &&
          songList.map((songItem) => (
            <SongItemPlaylist
              key={songItem.id}
              songId={songItem.id}
              songOrder={songItem.orderSong}
              song={songItem.song}
            />
          ))}
      </div>
    </div>
  );
};

export default MySongSectionPlaylist;
