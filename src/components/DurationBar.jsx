/* eslint-disable no-unused-vars */
import React, { Fragment, useEffect, useRef, useState } from "react";
import audioFile from "../assets/music/HappyNewYear.mp3";

const DurationBar = () => {
  // Current time when play a song
  let [currentTime, setCurrentTime] = useState(0);

  // Max time of the song
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef();

  // Get the max duration of the song
  const getSongDuration = () => {
    setDuration(audioRef.current.duration);
  };

  // Transform seconds to minutes:seconds
  const TimeConvert = (sec) => {
    const minutes = Math.floor(sec / 60);
    const seconds = Math.floor(sec % 60);
    const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
    return `${minutes}:${formattedSeconds}`;
  };

  // Update the currentTime every second
  useEffect(() => {
    // Get the duration of the song
    getSongDuration();
    // Count the currentTime every second
    let interval;
    if (isPlaying) {
      // Update every second
      interval = setInterval(() => {
        setCurrentTime((prevTime) => prevTime + 1);
      }, 1000);
      // if max time is reached, stop the interval
      if (currentTime == duration || currentTime > duration) {
        setIsPlaying(false);
        setCurrentTime(0);
        clearInterval(interval);
      }
    }
    // If the song is paused, stop the interval
    else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentTime, duration]);

  // When the seekbar is changed by user
  const handleSeek = (e) => {
    // newTime is the new value of the seekbar
    const newTime = e.target.value;
    setCurrentTime(parseFloat(newTime));

    // When move the seekbar, the song will be played
    setIsPlaying(true);
    audioRef.current.play();

    // Điều hướng đến thời gian mới trong bài hát
    audioRef.current.currentTime = newTime;
    // if the song is paused, play the song
    if (newTime < duration && newTime > 0 && isPlaying === false) {
      setIsPlaying(true);
    }
    // If the song is ended, stop the song
    else if (newTime === duration || newTime > duration) {
      setIsPlaying(false);
    }
  };

  // When click the play/pause button
  const handlePlayPause = () => {
    /**
     *Set the isPlaying state to the opposite value, then the useEffect will
     *be triggered and the play/pause button will be changed
     */
    setIsPlaying(!isPlaying);
    // Pause the song
    if (isPlaying === true) {
      audioRef.current.pause();
    }
    // Play the song
    else if (isPlaying === false) {
      audioRef.current.play();
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex flex-row justify-center items-center gap-3">
        {/* // Skip previous button */}
        <button className="bg-white hover:bg-[#c8c7c7] rounded-xl">
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

        {/* // Stop button */}
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
        {/* // Play button */}
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

        {/* // Audio element */}
        <audio ref={audioRef} src={audioFile} autoPlay></audio>

        {/* // Skip next button  */}
        <button className="bg-white hover:bg-[#c8c7c7] rounded-xl">
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
      </div>
      <div className="xl:flex flex-row justify-center items-center xl:relative hidden">
        <span className="text-xs xl:text-base">{TimeConvert(currentTime)}</span>
        <input
          type="range"
          min="0"
          max={duration}
          value={currentTime}
          onChange={handleSeek}
          className="bg-[#B9C0DE] w-32 xl:w-[400px] h-1 xl:h-1 mx-2 xl:mx-4 rounded-full"
        />
        <span className="text-xs xl:text-base">{TimeConvert(duration)}</span>
      </div>
    </div>
  );
};

export default DurationBar;
