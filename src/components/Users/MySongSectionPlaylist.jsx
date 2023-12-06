/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import SongItemPlaylist from "./SongItemPlaylist";
import { useSelector } from "react-redux";
// import { useDispatch } from "react-redux";

const MySongSectionPlaylist = ({ songData, playlistId }) => {
  const [songList, setSongList] = useState();
  const refreshPlaylist = useSelector(
    (state) => state.playlist.refreshPlaylist
  );
  //   const dispatch = useDispatch();
  //   dispatch(setSongList(songList));
  useEffect(() => {
    setSongList(songData);
    console.log("MySongSectionPlaylist || SongList", songList);
  }, [songData, refreshPlaylist]);
  if (!songList) return null;
  return (
    <div className="xl:w-full w-full bg-[#ecf2fd]">
      <div className="mt-2 flex flex-col gap-1">
        {songList &&
          songList.map((songItem, index) => (
            <SongItemPlaylist
              key={songItem.id}
              playlistId={playlistId}
              songId={songItem.id}
              songOrder={songItem.orderSong}
              songIndex={index}
              song={songItem.song}
            />
          ))}
      </div>
    </div>
  );
};

export default MySongSectionPlaylist;
