/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import SongItem from "../Song/SongItem";
// import { useDispatch } from "react-redux";

const SongSectionPlaylist = (props) => {
  const [songList, setSongList] = useState();
  useEffect(() => {
    setSongList(props.songData);
    console.log("songPlaylsit || SongList", songList);
  }, [props.songData]);
  if (!songList) return null;
  return (
    <div className="w-full xl:w-full bg-backgroundPrimary dark:bg-backgroundDarkPrimary">
      <div className="flex flex-row items-center justify-between mt-5 mb-5 text-primary dark:text-primaryDarkmode">
        <div className="flex flex-row gap-8 ml-8">
          <div className="font-bold text-center ">#</div>
          <div className="font-bold text-center ">Song Details</div>
        </div>
        {/* <div>
          <div className="font-bold text-center ">Duration</div>
        </div> */}
      </div>
      <div className="flex flex-col gap-1 mt-2">
        {songList &&
          songList.map((songItem) => (
            <SongItem
              key={songItem.id}
              songOrder={songItem.orderSong}
              song={songItem.song}
            />
          ))}
      </div>
    </div>
  );
};

export default SongSectionPlaylist;
