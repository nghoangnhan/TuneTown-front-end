/* eslint-disable no-unused-vars */
import { useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  setCurrentSong,
  setCurrentTime,
  setIsPlaying,
  setSongLinks,
} from "../../redux/slice/music";
import MakeUBeauti from "../../assets/music/What_Makes_You_Beautiful.mp3";
import useSongDuration from "../../utils/songUtils";

const SongItem = () => {
  const isPlaying = useSelector((state) => state.music.isPlaying);
  const songInfor = useSelector((state) => state.music.currentSong);
  const audioRef = useRef();
  const dispatch = useDispatch();
  const { showArtist, GetSongDuration, TimeConvert } = useSongDuration();
  // const songInfor = useSelector((state) => state.music.currentSong);
  const songInforObj = {
    songName: songInfor.songName,
    artistName: songInfor.artistName,
    songDuration: songInfor.songDuration,
    songCover: songInfor.songCover,
    songLink: MakeUBeauti,
  };

  // When click to the song, save the current song to the context and play it
  const HandlePlay = () => {
    dispatch(setCurrentTime(0));
    dispatch(setCurrentSong(songInforObj));
    // dispatch(setSongLinks(songInforObj.songLink));
    if (isPlaying == false) {
      dispatch(setIsPlaying(!isPlaying));
      // audioRef.current.play();
    }
  };

  return (
    <div>
      <div className="flex flex-row relative hover:bg-slate-200 bg-white items-center rounded-xl text-sm xl:text-base">
        <img
          className="ml-[15px] mt-[15px] mr-[15px] mb-[15px] w-[40px] h-[40px] xl:w-[50px] xl:h-[50px] rounded-lg object-cover"
          alt="Album cover"
          src={songInforObj.songCover}
        />
        {/* // Audio element */}
        <audio ref={audioRef} src={songInforObj.songLink}></audio>
        <div className="text-[#2E3271] xl:text-base font-semibold">
          <h2 className="">{songInforObj.songName}</h2>
          <h2 className="text-sm text-[#7C8DB5B8] mt-1">
            {showArtist(songInforObj.artistName)}
          </h2>
        </div>
        <div className="absolute right-4 flex flex-row items-center gap-1 xl:gap-10">
          <button
            className="hover:bg-slate-300 rounded-2xl p-1"
            onClick={HandlePlay}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6"
            >
              <path
                fillRule="evenodd"
                d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <div>{TimeConvert(songInforObj.songDuration)}</div>
        </div>
      </div>
    </div>
  );
};

export default SongItem;
