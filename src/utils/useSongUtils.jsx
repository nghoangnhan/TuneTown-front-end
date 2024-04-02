/* eslint-disable no-unused-vars */
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export const useSongUtils = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  //     const { setDuration } = useMusicSlice();
  //   // Get the duration of the song
  //   const getSongDuration = (songTime) => {
  //       dispatch(setDuration(songTime.duration))

  //       return duration;
  //     };

  // Transform seconds to minutes:seconds
  const isPlaying = useSelector((state) => state.music.isPlaying);
  const TimeConvert = (sec) => {
    const minutes = Math.floor(sec / 60);
    const seconds = Math.floor(sec % 60);
    const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
    return `${minutes}:${formattedSeconds}`;
  };
  // Show artist name
  const showArtist = (artistName) => {
    console.log("showArtist", artistName);
    if (artistName.length > 1) {
      return artistName.join(", ");
    } else {
      return artistName[0];
    }
  };
  const showArtistV2 = (artistName) => {
    if (artistName.length > 1) {
      return artistName.map((artist) => (
        <span
          key={artist.id}
          className="cursor-pointer cursor-pointe hover:underline"
          onClick={() => navigate(`artist/${artist.id}`)}
        >
          {artist.userName}, &nbsp;
        </span>
      ));
    } else if (artistName.length == 1) {
      let artist = artistName[0];
      return (
        <span
          key={artist.id}
          className="cursor-pointer cursor-pointe hover:underline"
          onClick={() => navigate(`artist/${artist.id}`)}
        >
          {artist.userName}
        </span>
      );
    } else {
      return "Unknown Artist";
    }
  };
  // Acronym the name of the song
  const AcronymName = (nameLenght, length) => {
    if (nameLenght && nameLenght.length > length) {
      return nameLenght.slice(0, length) + "...";
    } else {
      return nameLenght;
    }
  };
  // Get Song fragment
  const GetSongFragment = (audioSrc) => {
    document.addEventListener("DOMContentLoaded", function () {
      const btnPlay = document.getElementById("play");
      const audio = document.getElementById("audio");
      let arrayAudio = "";
      let loop = 2;
      btnPlay.addEventListener("click", function () {
        audio.src = audioSrc + 1 + ".mp3";
        audio.play();
      });
      audio.addEventListener("timeupdate", function () {
        let currentTime = audio.currentTime;
        if (audio.duration - currentTime >= 5) {
          if (loop <= 10) {
            arrayAudio = audioSrc + loop + ".mp3";
          }
        }
      });
      audio.addEventListener("ended", function () {
        audio.src = arrayAudio;
        audio.play();
        loop++;
      });
    });
  };

  // Check if the song isPlaying
  const CheckPlaying = (audioRef) => {
    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  };
  // Get the max duration of the song
  const GetSongDuration = (audioRef) => {
    // const audioElement = new Audio(audioRef);
    console.log("audioRef", audioRef.current.duration);
    return audioRef.current.duration;
  };

  return {
    TimeConvert,
    GetSongFragment,
    showArtist,
    showArtistV2,
    AcronymName,
    CheckPlaying,
    GetSongDuration,
  };
};
export default useSongUtils;
