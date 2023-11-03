/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  setCurrentSong,
  setCurrentTime,
  setIsPlaying,
  setSongLinks,
} from "../../redux/slice/music";
import useSongDuration from "../../utils/songUtils";
import DefaultArt from "../../assets/img/CoverArt/starboy.jpg";
import MakeUBeauti from "../../assets/music/What_Makes_You_Beautiful.mp3";

const SongItem = ({ song }) => {
  const audioRef = useRef();
  const dispatch = useDispatch();
  const isPlaying = useSelector((state) => state.music.isPlaying);
  const songInfor = useSelector((state) => state.music.currentSong);
  const { showArtist, TimeConvert } = useSongDuration();
  const { id, songName, artists, poster, songData } = song;
  // const songInfor = useSelector((state) => state.music.currentSong);
  const artistArr = artists.map((artist) => artist.userName);

  const songInforObj = {
    id: id,
    songName: songName,
    artistName: artistArr,
    songDuration: songInfor.songDuration,
    songCover: poster,
    songLink: songData,
  };

  // When click to the song, save the current song to the context and play it
  const HandlePlay = () => {
    dispatch(setCurrentTime(0));
    // Send Song information to the store
    dispatch(setCurrentSong(songInforObj));
    // dispatch(setSongLinks(songInforObj.songLink));
    if (isPlaying == false) {
      dispatch(setIsPlaying(!isPlaying));
    }
  };
  // const songDuration = GetSongDuration(songData);
  const audio = document.getElementById("audio");

  return (
    <div>
      <div className="flex flex-row relative hover:bg-slate-200 bg-white items-center rounded-xl text-sm xl:text-base p-2 my-1">
        <img
          className="mr-3 w-12 h-12 xl:w-14 xl:h-14 rounded-lg object-cover"
          alt="Album cover"
          src={poster ? poster : DefaultArt}
        />
        {/* // Audio element */}
        <audio ref={audioRef} src={songInforObj.songLink}></audio>
        <div className="text-[#2E3271] xl:text-base font-semibold">
          <h2 className="">{songInforObj.songName}</h2>
          <h2 className="text-sm text-[#7C8DB5B8] mt-1">
            {artists && showArtist(artistArr)}
            {/* {artists &&
              artists.map((artist) => (
                <span key={artist.id}>{artist.userName}</span>
              ))} */}
            {!artists && <span>Null</span>}
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
          {/* <div>{TimeConvert(songInforObj.songDuration)}</div> */}
          <div>{TimeConvert(234)}</div>
        </div>
      </div>
    </div>
  );
};

export default SongItem;
