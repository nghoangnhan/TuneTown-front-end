/* eslint-disable no-unused-vars */
import React, { Fragment, useEffect, useState } from "react";

const DurationBar = () => {
  var [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(300); // Giả sử bài hát có thời lượng 300 giây

  // When the seekbar is changed, the currentTime will be changed
  const handleSeek = (e) => {
    const newTime = e.target.value;
    setCurrentTime(parseFloat(newTime));
    // Điều hướng đến thời gian mới trong bài hát
    // Ví dụ: audioElement.current.currentTime = newTime;
  };

  // Transform seconds to minutes:seconds
  const TimeConvert = (sec) => {
    const minutes = Math.floor(sec / 60);
    const seconds = Math.floor(sec % 60);
    const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
    return `${minutes}:${formattedSeconds}`;
  };

  const [isPlaying, setIsPlaying] = useState(false);
  // Update the currentTime every second
  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prevTime) => prevTime + 1);
      }, 1000); // Update every second
      if (currentTime == duration) {
        setIsPlaying(false);
        setCurrentTime(0);
        clearInterval(interval);
      }
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentTime, duration]);
  // When click the play/pause button, the isPlaying state will be changed
  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
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
