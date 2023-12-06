/* eslint-disable no-unused-vars */
import React, { Fragment, useEffect, useRef, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { useSelector, useDispatch } from "react-redux";
import useSongDuration from "../utils/songUtils";
import {
  playNextSong,
  playPreviousSong,
  setCurrentSong,
  setCurrentTime,
  setDuration,
  setIsPlaying,
  setSongLinks,
} from "../redux/slice/music";
import axios from "axios";
import { Base_URL } from "../api/config";
import UseCookie from "../hooks/useCookie";
// import audioFile from "../assets/music/HappyNewYear.mp3";

const DurationBar = () => {
  const { TimeConvert, CheckPlaying } = useSongDuration(); // Song Function
  const dispatch = useDispatch();
  const audioRef = useRef();
  const { getToken } = UseCookie();
  const { access_token } = getToken();
  const isMobile = useMediaQuery({ query: "(max-width: 640px)" });
  // const [duration, setDuration] = useState("0"); // Max time of the song
  const songObj = useSelector((state) => state.music.currentSong); // Get song information from the store
  console.log("file: DurationBar.jsx:21 || DurationBar || songObj:", songObj);
  const songQueuePlayed = useSelector((state) => state.music.songQueuePlayed);
  const songQueue = useSelector((state) => state.music.songQueue); // Get song queue from the store
  const duration = useSelector((state) => state.music.currentSong.songDuration);
  const audioFile = useSelector((state) => state.music.currentSong.songLink);
  const currentTime = useSelector((state) => state.music.currentTime); // Current time when play a song
  const isPlaying = useSelector((state) => state.music.isPlaying); // Check if the song is playing
  const volume = useSelector((state) => state.volume.volumeValue); // Get the volume from the store

  // // Get the max duration of the song
  const GetSongDuration = (audioRef) => {
    setDuration(audioRef.current.duration);
  };
  // When the seekbar is changed by user
  const handleSeek = (e) => {
    const newTime = e.target.value; // newTime is the new value of the seekbar
    dispatch(setCurrentTime(parseFloat(newTime)));
    dispatch(setIsPlaying(true)); // When move the seekbar, the song will be played
    audioRef.current.play();
    audioRef.current.currentTime = newTime; // Set the currentTime of the song to the newTime

    // If the song is paused, play the song
    if (newTime > 0 && newTime < duration && isPlaying === false) {
      dispatch(setIsPlaying(true));
    }
    // If the song is ended, stop the song
    else if (newTime >= duration - 1) {
      dispatch(setIsPlaying(false));
    }
  };
  // When click the play/pause button
  const handlePlayPause = () => {
    /**
    Set the isPlaying state to the opposite value, 
    then the useEffect willbe triggered and the play/pause button will be changed
     */
    dispatch(setIsPlaying(!isPlaying));
    // Pause the song
    if (isPlaying == true && currentTime < duration) {
      audioRef.current.pause();
    }
    // Play the song
    else if (isPlaying == false && currentTime < duration) {
      audioRef.current.play();
    }

    // If the song is ended, play the song from the beginning
    else if (currentTime >= duration - 1) {
      dispatch(setCurrentTime(0));
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }
  };

  useEffect(() => {
    //Handle Volume
    audioRef.current.volume = volume / 100;
  }, [volume]);

  // Update the currentTime every second
  useEffect(() => {
    GetSongDuration(audioRef); // Get the duration of the song
    CheckPlaying(audioRef);
    let interval; // Count the isPlaying
    if (isPlaying == true && currentTime < duration) {
      // Update every second
      interval = setInterval(() => {
        dispatch(setCurrentTime(currentTime + 1));
        audioRef.current.currentTime = currentTime + 1;
        audioRef.current.play();
      }, 1000);
      dispatch(setIsPlaying(true));
    }
    // if max time is reached, stop the interval
    else if (currentTime >= duration && isPlaying == true) {
      dispatch(setCurrentTime(0));
      dispatch(setIsPlaying(!isPlaying));
      clearInterval(interval);
    } else {
      clearInterval(interval); // If the song is paused, stop the interval
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentTime, duration, dispatch, CheckPlaying]);

  return (
    <div className="flex flex-col">
      <div className="flex flex-row justify-center items-center gap-3">
        {/* Shuffle button */}
        <button className="bg-white hover:bg-[#c8c7c7] rounded-xl">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 25 24"
            fill="#887D7D"
            className="w-5 h-5"
            stroke="#887D7D"
          >
            <path
              d="M22.25 17.98C22.25 17.96 22.24 17.94 22.24 17.92C22.23 17.84 22.22 17.76 22.19 17.69C22.15 17.6 22.1 17.53 22.04 17.46C22.04 17.46 22.04 17.45 22.03 17.45C21.96 17.38 21.88 17.33 21.79 17.29C21.7 17.25 21.6 17.23 21.5 17.23L16.83 17.25C16.83 17.25 16.83 17.25 16.82 17.25C16.22 17.25 15.64 16.97 15.28 16.49L14.06 14.92C13.81 14.59 13.34 14.53 13.01 14.79C12.68 15.05 12.62 15.51 12.88 15.84L14.1 17.41C14.75 18.25 15.77 18.75 16.83 18.75H16.84L19.69 18.74L18.98 19.45C18.69 19.74 18.69 20.22 18.98 20.51C19.13 20.66 19.32 20.73 19.51 20.73C19.7 20.73 19.89 20.66 20.04 20.51L22.04 18.51C22.11 18.44 22.16 18.36 22.2 18.27C22.23 18.17 22.25 18.07 22.25 17.98Z"
              fill="#121212"
            />
            <path
              d="M8.92 6.69001C8.27 5.79001 7.23 5.26001 6.12 5.26001C6.11 5.26001 6.11 5.26001 6.1 5.26001L3.5 5.27001C3.09 5.27001 2.75 5.61001 2.75 6.02001C2.75 6.43001 3.09 6.77001 3.5 6.77001L6.11 6.76001H6.12C6.75 6.76001 7.34 7.06001 7.7 7.57001L8.78 9.07001C8.93 9.27001 9.16 9.38001 9.39 9.38001C9.54 9.38001 9.7 9.33001 9.83 9.24001C10.17 8.99001 10.24 8.52001 10 8.19001L8.92 6.69001Z"
              fill="#121212"
            />
            <path
              d="M22.24 6.07997C22.24 6.05997 22.25 6.03997 22.25 6.02997C22.25 5.92997 22.23 5.82997 22.19 5.73997C22.15 5.64997 22.1 5.56997 22.03 5.49997L20.03 3.49997C19.74 3.20997 19.26 3.20997 18.97 3.49997C18.68 3.78997 18.68 4.26997 18.97 4.55997L19.68 5.26997L16.95 5.25997C16.94 5.25997 16.94 5.25997 16.93 5.25997C15.78 5.25997 14.7 5.82997 14.06 6.79997L7.67 16.38C7.31 16.92 6.7 17.25 6.05 17.25H6.04L3.5 17.23C3.09 17.23 2.75 17.56 2.75 17.98C2.75 18.39 3.08 18.73 3.5 18.73L6.05 18.74C6.06 18.74 6.06 18.74 6.07 18.74C7.23 18.74 8.3 18.17 8.94 17.2L15.33 7.61997C15.69 7.07997 16.3 6.74997 16.95 6.74997H16.96L21.5 6.76997C21.6 6.76997 21.69 6.74997 21.79 6.70997C21.88 6.66997 21.96 6.61997 22.03 6.54997C22.03 6.54997 22.03 6.53997 22.04 6.53997C22.1 6.46997 22.16 6.39997 22.19 6.30997C22.22 6.23997 22.23 6.15997 22.24 6.07997Z"
              fill="#121212"
            />
          </svg>
        </button>
        {/* Skip previous button */}
        <button
          className="bg-white hover:bg-[#c8c7c7] rounded-xl"
          onClick={
            // Play previous song in queue
            () => {
              if (songQueuePlayed.length > 0) {
                dispatch(setIsPlaying(true));
                dispatch(setCurrentTime(0));
                dispatch(playPreviousSong());
              } else if (songQueuePlayed.length == 0) {
                dispatch(setIsPlaying(false));
                dispatch(setCurrentTime(0));
                dispatch(setCurrentSong(null));
                dispatch(setSongLinks(null));
              }
            }
          }
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            className="transform: ;msFilter:;"
            fill="#887D7D"
          >
            <path d="m16 7-7 5 7 5zm-7 5V7H7v10h2z"></path>
          </svg>
        </button>

        {/* Stop button */}
        <button
          className="bg-white hover:bg-[#c8c7c7] rounded-xl"
          onClick={handlePlayPause}
          hidden={!isPlaying}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            className="transform: ;msFilter:;"
            fill="#887D7D"
          >
            <path d="M8 7h3v10H8zm5 0h3v10h-3z"></path>
          </svg>
        </button>
        {/* Play button */}
        <button
          className="bg-white hover:bg-[#c8c7c7] rounded-xl"
          onClick={handlePlayPause}
          hidden={isPlaying}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            className="transform: ;msFilter:;"
            fill="#887D7D"
          >
            <path d="M7 6v12l10-6z"></path>
          </svg>
        </button>

        {/* Audio element */}
        <audio ref={audioRef} src={audioFile}></audio>

        {/* Skip next button  */}
        <button
          className="bg-white hover:bg-[#c8c7c7] rounded-xl"
          onClick={
            // Play next song in queue
            () => {
              if (songQueue.length > 0) {
                dispatch(setIsPlaying(true));
                dispatch(setCurrentTime(0));
                dispatch(playNextSong());
              } else if (songQueue.length == 0) {
                dispatch(setIsPlaying(false));
                dispatch(setCurrentTime(0));
                dispatch(setCurrentSong(null));
                dispatch(setSongLinks(null));
              }
            }
          }
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            className="transform: ;msFilter:;"
            fill="#887D7D"
          >
            <path d="M7 7v10l7-5zm9 10V7h-2v10z"></path>
          </svg>
        </button>
        {/* Repeat button */}
        <button className="bg-white hover:bg-[#c8c7c7] rounded-xl">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            // stroke="currentColor"
            stroke="#887D7D"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3"
            />
          </svg>
        </button>
      </div>

      {/* Seekbar Control Song */}
      {/* Mobile  */}
      {isMobile && (
        <div className="flex flex-row justify-center items-center xl:relative max-sm:static max-sm:bottom-0 max-sm:w-screen px-5">
          <span className="text-xs xl:text-base">
            {TimeConvert(currentTime)}
          </span>
          <input
            type="range"
            min="0"
            max={duration}
            value={currentTime}
            onChange={handleSeek}
            className="bg-[#B9C0DE] max-sm:w-screen max-sm:px-5 h-1 mx-2 rounded-full"
          />
          <span className="text-xs xl:text-base">{TimeConvert(duration)}</span>
        </div>
      )}

      {/* Desktop  */}
      {!isMobile && (
        <div className="xl:flex flex-row justify-center items-center xl:relative">
          <span className="text-xs xl:text-base">
            {TimeConvert(currentTime)}
          </span>
          <input
            type="range"
            min="0"
            max={duration}
            value={currentTime}
            onChange={handleSeek}
            className="bg-[#B9C0DE] w-[400px] h-1 xl:h-1 mx-2 xl:mx-4 rounded-full"
          />
          <span className="text-xs xl:text-base">{TimeConvert(duration)}</span>
        </div>
      )}
    </div>
  );
};

export default DurationBar;
