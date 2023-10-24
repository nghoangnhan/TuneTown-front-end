/* eslint-disable no-unused-vars */
import { useDispatch, useSelector } from "react-redux";
import { setDuration } from "../redux/slice/music";
import { useRef } from "react";

const useSongDuration = () => {
  const dispatch = useDispatch();

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
  const showArtist = (artistName) => {
    if (artistName.length > 1) {
      return artistName.join(", ");
    } else {
      return artistName[0];
    }
  };
  // Acronym the name of the song
  const AcronymName = (nameLenght, length) => {
    if (nameLenght.length > 10) {
      return nameLenght.slice(0, length) + "...";
    } else {
      return nameLenght;
    }
  };
  // Get Song fragment
  const GetSongFragment = () => {
    const btnPlay = document.getElementById("play");
    const audio = document.getElementById("audio");
    let arrayAudio = "";
    let audioSrc =
      "https://storage.googleapis.com/tunetown-6b63a.appspot.com/audios/Nhói Lòng Thuyền Hoa Remix/Nhói Lòng Thuyền Hoa Remix_";
    let loop = 2;
    btnPlay.addEventListener("click", function () {
      audio.src = audioSrc + 1 + ".mp3";
      audio.play();
    });

    // function playNextAudio() {
    //   if (loop <= 10) {
    //     audio.src = audioSrc + loop + ".mp3";
    //     audio.play();
    //     loop++;
    //   }
    // }

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
    const audioElement = new Audio(audioRef);
    const duration = audioElement.current.duration;
    console.log(`The duration of the song is ${duration} seconds`);
    dispatch(setDuration(audioElement.current.duration));
  };
  return {
    TimeConvert,
    GetSongFragment,
    showArtist,
    AcronymName,
    CheckPlaying,
    GetSongDuration,
  };
};
export default useSongDuration;
