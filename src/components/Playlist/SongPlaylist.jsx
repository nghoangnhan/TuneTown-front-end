/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import SongItemPlaylist from "../Song/SongItemPlaylist";
// import { useDispatch } from "react-redux";

const SongPlaylist = (props) => {
  const [songList, setSongList] = useState();
  //   const dispatch = useDispatch();
  //   dispatch(setSongList(songList));
  useEffect(() => {
    setSongList(props.songData);
    console.log("songPlaylsit || SongList", songList);
  }, [props.songData]);
  if (!songList) return null;
  return (
    <div className="xl:w-full w-full bg-[#ecf2fd]">
      <div className="mt-2 flex flex-col gap-1">
        {songList &&
          songList.map((songItem) => (
            <SongItemPlaylist key={songItem.id} song={songItem.song} />
          ))}
      </div>
    </div>
  );
};

export default SongPlaylist;
