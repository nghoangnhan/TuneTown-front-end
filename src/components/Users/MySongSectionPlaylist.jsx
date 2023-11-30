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
  //   const dispatch = useDispatch();
  //   dispatch(setSongList(songList));
  useEffect(() => {
    setSongList(songData);
    console.log("songPlaylsit || SongList", songList);
  }, [songData, refreshPlaylist]);
  if (!songList) return null;
  return (
    <div className="xl:w-full w-full bg-[#ecf2fd]">
      <div className="mt-2 flex flex-col gap-1">
        {songList &&
          songList.map((songItem) => (
            <SongItemPlaylist
              key={songItem.id}
              songId={songItem.id}
              song={songItem.song}
            />
          ))}
      </div>
    </div>
  );
};

export default MySongSectionPlaylist;
