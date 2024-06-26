/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import SongItemPlaylist from "./SongItemPlaylist";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setDraggable } from "../../redux/slice/playlist";
import {
  addPlaylistSongToQueue,
  setCurrentSong,
  setCurrentTime,
  setIsPlaying,
} from "../../redux/slice/music";
import { useTranslation } from "react-i18next";
import useIconUtils from "../../utils/useIconUtils";

const MySongSectionPlaylist = ({ songData, playlistId }) => {
  const { PlayButton } = useIconUtils();
  const [songList, setSongList] = useState();
  const dispatch = useDispatch();
  const draggable = useSelector((state) => state.playlist.draggable);
  const refreshPlaylist = useSelector(
    (state) => state.playlist.refreshPlaylist
  );
  const { t } = useTranslation();

  const handleAddSongToQueue = (songList) => {
    dispatch(setCurrentTime(0));
    dispatch(
      setCurrentSong({
        id: songList[0].song.id,
        songName: songList[0].song.songName,
        artists: songList[0].song.artists.map((artist) => artist),
        songDuration: songList[0].song.songDuration || 200,
        songCover: songList[0].song.poster,
        songData: songList[0].song.songData,
      })
    );

    dispatch(setIsPlaying(true));
    const queueSongs = songList.slice(1, songList.length).map((song) => ({
      id: song.song.id,
      songName: song.song.songName,
      artists: song.song.artists.map((artist) => artist),
      songDuration: song.song.songDuration || 200,
      songCover: song.song.poster,
      songData: song.song.songData,
    }));
    // console.log(queueSongs);
    dispatch(addPlaylistSongToQueue(queueSongs));
  };

  useEffect(() => {
    setSongList(songData);
    if (refreshPlaylist == true) setSongList(songData);
    // console.log("MySongSectionPlaylist || SongList", songList);
  }, [songData, refreshPlaylist]);

  if (!songList) return null;
  return (
    <div className="w-full xl:w-full bg-backgroundPrimary dark:bg-backgroundDarkPrimary">
      <div className="flex flex-row items-center gap-5">
        <div className="flex flex-row gap-2 p-2 border border-solid rounded-md border-primary dark:border-primaryDarkmode text-primary dark:text-primaryDarkmode">
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
          <button
            className=""
            onClick={() => dispatch(setDraggable(!draggable))}
          >
            {t("playlist.editOrderSong")}
          </button>{" "}
        </div>

        <button
          className="font-bold"
          onClick={() => handleAddSongToQueue(songList)}
        >
          <PlayButton color={true} size={4}></PlayButton>
        </button>

      </div>
      <div className="flex flex-row items-center justify-between mt-5 mb-5 text-primary dark:text-primaryDarkmode">
        <div className="flex flex-row gap-8 ml-8">
          <div className="font-bold text-center ">#</div>
          <div className="font-bold text-center ">Title</div>
        </div>
        {/* <div>
          <div className="font-bold text-center ">Duration</div>
        </div> */}
      </div>
      <div className="flex flex-col gap-1 mt-2">
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
