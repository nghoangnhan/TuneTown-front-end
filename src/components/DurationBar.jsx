/* eslint-disable no-unused-vars */
import React, { Fragment, useEffect, useRef, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { useSelector, useDispatch } from "react-redux";
import useSongDuration from "../utils/songUtils";
import {
  setCurrentSong,
  setCurrentTime,
  setDuration,
  setIsPlaying,
} from "../redux/slice/music";
import axios from "axios";
import { Base_URL } from "../api/config";
import UseCookie from "../hooks/useCookie";
import { data } from "autoprefixer";
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
  const duration = useSelector((state) => state.music.currentSong.songDuration);
  const audioFile = useSelector((state) => state.music.currentSong.songLink);
  const currentTime = useSelector((state) => state.music.currentTime); // Current time when play a song
  const isPlaying = useSelector((state) => state.music.isPlaying); // Check if the song is playing
  const audioArray = useSelector(
    (state) => state.music.currentSong.songLinkArray
  );
  const volume = useSelector((state) => state.volume.volumeValue); // Get the volume from the store

  // // Get the max duration of the song
  const GetSongDuration = (audioRef) => {
    // setDuration(audioRef.current.duration);
    // setDuration(sourceNode.current[currentIndex].buffer.duration * 10);
  };
  // When the seekbar is changed by user
  const handleSeek = (e) => {
    const newTime = e.target.value; // newTime is the new value of the seekbar
    dispatch(setCurrentTime(parseFloat(newTime)));
    dispatch(setIsPlaying(true)); // When move the seekbar, the song will be played
    // audioRef.current.play();
    audioRef.current.currentTime = newTime; // Set the currentTime of the song to the newTime

    isLoaded.current = false;
    sourceNode.current.forEach((item) => item.disconnect());
    timeOutArray.current.forEach((item) => clearTimeout(item));
    const partIndex = ~~(newTime / audioBufferArray.current[0].duration);
    const currentStartTime = newTime % audioBufferArray.current[0].duration;
    setCurrentIndex(partIndex);
    setStartTime(currentStartTime);
    isLoaded.current = true;

    // If the song is paused, play the song
    if (newTime > 0 && newTime < duration && isPlaying === false) {
      dispatch(setIsPlaying(true));
    }
    // If the song is ended, stop the song
    else if (newTime >= duration - 1) {
      dispatch(setIsPlaying(false));
    }
  };

  // Update the currentTime every second
  useEffect(() => {
    GetSongDuration(audioRef); // Get the duration of the song
    // CheckPlaying(audioRef);
    let interval; // Count the isPlaying
    if (isPlaying == true && currentTime < duration) {
      // Update every second
      interval = setInterval(() => {
        dispatch(setCurrentTime(currentTime + 1));
        audioRef.current.currentTime = currentTime + 1;
        // audioRef.current.play();
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

  // When click the play/pause button
  const handlePlayPause = () => {
    /**
      Set the isPlaying state to the opposite value, 
      then the useEffect willbe triggered and the play/pause button will be changed
       */
    dispatch(setIsPlaying(!isPlaying));
    if (sourceNode.current.length == 0) {
      loadAndPlayAudio();
    } else {
      // Pause the song
      if (isPlaying == true && currentTime < duration) {
        audioContext.suspend();
      }
      // Play the song
      else if (isPlaying == false && currentTime < duration) {
        audioContext.resume();
      }
      // // If the song is ended, play the song from the beginning
      // else if (currentTime >= duration - 1) {
      //   dispatch(setCurrentTime(0));
      //   audioRef.current.currentTime = 0;
      //   audioRef.current.play();
      // }
    }
  };

  // HANLDE PLAYING AUDIO FILES WITH BUFFER
  const [audioContext, setAudioContext] = useState(null);
  const audioBufferArray = useRef([]);
  const sourceNode = useRef([]);
  const timeOutArray = useRef([]);
  const [isAudioPlayed, setIsAudioPlayed] = useState(false);
  const isLoaded = useRef(false);
  const [startTime, setStartTime] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const gainVolume = useRef();

  // const audioArray = [
  //   "https://firebasestorage.googleapis.com/v0/b/tunetown-6b63a.appspot.com/o/audios%2F50%20Feet%20-%20Somo%2F50%20Feet%20-%20Somo_1.mp3?alt=media&token=3b6bac15-c14b-43b0-9b51-257aa4a5582a",
  //   "https://firebasestorage.googleapis.com/v0/b/tunetown-6b63a.appspot.com/o/audios%2F50%20Feet%20-%20Somo%2F50%20Feet%20-%20Somo_2.mp3?alt=media&token=c379a880-1478-4348-832e-c1b1790ae4dc",
  //   "https://firebasestorage.googleapis.com/v0/b/tunetown-6b63a.appspot.com/o/audios%2F50%20Feet%20-%20Somo%2F50%20Feet%20-%20Somo_3.mp3?alt=media&token=40795bcb-f4e6-4321-aee2-7d7fa57cc6e2",
  // ];
  useEffect(() => {
    const initAudioContext = async () => {
      try {
        const audioCtx = new (window.AudioContext ||
          window.webkitAudioContext)();
        setAudioContext(audioCtx);
      } catch (error) {
        console.error("Error initializing AudioContext:", error);
      }
    };
    initAudioContext();
    return () => {
      if (audioContext) {
        audioContext.close();
      }
    };
  }, []);

  useEffect(() => {
    console.log(audioBufferArray.current[currentIndex]);
    if (audioBufferArray.current.length > 0 && isLoaded.current) {
      console.log("seeking");
      // Create a new source node
      const source = audioContext.createBufferSource();
      source.buffer = audioBufferArray.current[currentIndex];
      // Connect the source node to the audio context's destination
      source.connect(audioContext.destination);
      source.connect(gainVolume.current);
      // Set the source node in the state
      sourceNode.current.push(source);

      // setting songDuration
      dispatch(
        setDuration(sourceNode.current[currentIndex].buffer.duration * 10)
      );

      console.log("Play", currentIndex);
      setIsAudioPlayed(true);
      sourceNode.current[currentIndex].start(0, startTime);

      const timeOut = setTimeout(() => {
        // Create a new source node
        const source = audioContext.createBufferSource();
        source.buffer = audioBufferArray.current[currentIndex + 1];
        // Connect the source node to the audio context's destination
        source.connect(audioContext.destination);
        source.connect(gainVolume.current);
        // Set the source node in the state
        sourceNode.current.push(source);

        sourceNode.current[currentIndex + 1].start();
        setCurrentIndex(currentIndex + 1);
      }, (audioBufferArray.current[currentIndex].duration - 0.05) * 1000);
      timeOutArray.current.push(timeOut);
    }
  }, [isLoaded.current]);

  useEffect(() => {
    if (currentIndex + 1 < audioBufferArray.current.length) {
      console.log(sourceNode.current[currentIndex]);

      const timeOut = setTimeout(() => {
        // Create a new source node
        const source = audioContext.createBufferSource();
        source.buffer = audioBufferArray.current[currentIndex + 1];
        // Connect the source node to the audio context's destination
        source.connect(audioContext.destination);
        source.connect(gainVolume.current);
        sourceNode.current.push(source);

        sourceNode.current[currentIndex + 1].start(audioContext.currentTime);
        setCurrentIndex(currentIndex + 1);
      }, (audioBufferArray.current[currentIndex].duration - 0.05) * 1000);
      timeOutArray.current.push(timeOut);
    }
  }, [currentIndex]);

  const loadAudio = async (currentPartIndex) => {
    if (audioContext && audioArray.length > 0) {
      const currentAudioUrl = audioArray[currentPartIndex];

      try {
        const response = await fetch(currentAudioUrl);
        const arrayBuffer = await response.arrayBuffer();

        // Decode the audio data
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        audioBufferArray.current.push(audioBuffer);

        // // Create a new source node
        // const source = audioContext.createBufferSource();
        // source.buffer = audioBuffer;

        // // Connect the source node to the audio context's destination
        // source.connect(audioContext.destination);
        // source.connect(gainVolume.current);

        // // Set the source node in the state
        // sourceNode.current.push(source);

        isLoaded.current = true;
      } catch (error) {
        console.error("Error loading or playing audio:", error);
      }
    }
  };

  const loadAndPlayAudio = async () => {
    gainVolume.current = audioContext.createGain();
    gainVolume.current.connect(audioContext.destination);
    gainVolume.current.gain.setValueAtTime(volume, audioContext.currentTime);
    console.log(audioArray);
    for (let i = 0; i < audioArray.length; i++) {
      await loadAudio(i);
    }
  };

  const playPauseAudio = async () => {
    if (sourceNode.current.length == 0) {
      loadAndPlayAudio();
    } else {
      if (isAudioPlayed) {
        console.log("Stop", currentIndex, audioContext.currentTime);
        audioContext.suspend();
        setIsAudioPlayed(false);

        setIsAudioPlayed(false);
      } else {
        console.log("Play", currentIndex);
        audioContext.resume();
        setIsAudioPlayed(true);
      }
    }
  };

  useEffect(() => {
    if (sourceNode.current.length > 0) {
      gainVolume.current.gain.setValueAtTime(volume, audioContext.currentTime);
    }
  }, [volume]);

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
        <audio ref={audioRef} src={audioFile}></audio>

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

      {/* // Seekbar Control Song */}
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
