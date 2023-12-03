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

  // HANLDE PLAYING AUDIO FILES WITH BUFFER
  const [audioContext, setAudioContext] = useState(null);
  const sourceNode = useRef([]);
  const [isAudioPlayed, setIsAudioPlayed] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  // const [currentPartIndex, setCurrentPartIndex] = useState(0);

  const audioArray = [
    "https://firebasestorage.googleapis.com/v0/b/tunetown-6b63a.appspot.com/o/audios%2Fbabe%20kajima%2Fbabe%20kajima_1.mp3?alt=media&token=29b10cca-12b3-492f-a316-642e6d897396",
    "https://firebasestorage.googleapis.com/v0/b/tunetown-6b63a.appspot.com/o/audios%2Fbabe%20kajima%2Fbabe%20kajima_2.mp3?alt=media&token=edf54995-84e8-46a9-a342-8378fcdd76ae",
    "https://firebasestorage.googleapis.com/v0/b/tunetown-6b63a.appspot.com/o/audios%2Fbabe%20kajima%2Fbabe%20kajima_3.mp3?alt=media&token=74385b3f-3085-4f01-aad5-c741cfba4556",
    "https://firebasestorage.googleapis.com/v0/b/tunetown-6b63a.appspot.com/o/audios%2Fbabe%20kajima%2Fbabe%20kajima_4.mp3?alt=media&token=86bd1c56-83f2-46d0-b0f4-388ab395efd8",
    "https://firebasestorage.googleapis.com/v0/b/tunetown-6b63a.appspot.com/o/audios%2Fbabe%20kajima%2Fbabe%20kajima_5.mp3?alt=media&token=7ffb8f6c-f7ea-4e32-8c25-33b5c222c4ae",
    "https://firebasestorage.googleapis.com/v0/b/tunetown-6b63a.appspot.com/o/audios%2Fbabe%20kajima%2Fbabe%20kajima_6.mp3?alt=media&token=0ad2bd34-54b7-47b4-a2e7-ac34ba227e5d",
    "https://firebasestorage.googleapis.com/v0/b/tunetown-6b63a.appspot.com/o/audios%2Fbabe%20kajima%2Fbabe%20kajima_7.mp3?alt=media&token=9f48f901-69c5-4174-b16c-3e1bcdd43745",
    "https://firebasestorage.googleapis.com/v0/b/tunetown-6b63a.appspot.com/o/audios%2Fbabe%20kajima%2Fbabe%20kajima_8.mp3?alt=media&token=46e7f688-65f8-4463-829a-ece0e295741f",
    "https://firebasestorage.googleapis.com/v0/b/tunetown-6b63a.appspot.com/o/audios%2Fbabe%20kajima%2Fbabe%20kajima_9.mp3?alt=media&token=efe48b6d-68c7-4a97-b695-6e9f56ace32e",
    "https://firebasestorage.googleapis.com/v0/b/tunetown-6b63a.appspot.com/o/audios%2Fbabe%20kajima%2Fbabe%20kajima_10.mp3?alt=media&token=e39ad2bf-72c6-47c9-8b6c-38fe0ebad2e2",
  ];

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
    console.log(sourceNode.current[currentIndex]);
    console.log("activate effect");
    if (sourceNode.current.length > 0) {
      console.log("Play", currentIndex);
      setIsAudioPlayed(true);
      sourceNode.current[currentIndex].start();

      sourceNode.current[currentIndex].onended = () => {
        sourceNode.current[currentIndex + 1].start(audioContext.currentTime);
        setCurrentIndex(currentIndex + 1);
      };

      // setTimeout(() => {
      //   sourceNode.current[currentIndex + 1].start();
      //   setCurrentIndex(currentIndex + 1);
      // }, (sourceNode.current[currentIndex].buffer.duration - 0.05) * 1000);
    }
  }, [isLoaded]);

  useEffect(() => {
    if (currentIndex + 1 < sourceNode.current.length) {
      console.log(sourceNode.current[currentIndex]);
      sourceNode.current[currentIndex].onended = () => {
        sourceNode.current[currentIndex + 1].start(audioContext.currentTime);
        setCurrentIndex(currentIndex + 1);
      };

      // setTimeout(() => {
      //   sourceNode.current[currentIndex + 1].start();
      //   setCurrentIndex(currentIndex + 1);
      // }, (sourceNode.current[currentIndex].buffer.duration - 0.05) * 1000);
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

        // Create a new source node
        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;

        // Connect the source node to the audio context's destination
        source.connect(audioContext.destination);

        // Set the source node in the state
        sourceNode.current.push(source);
        setIsLoaded(true);
      } catch (error) {
        console.error("Error loading or playing audio:", error);
      }
    }
  };

  const loadAndPlayAudio = async () => {
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

        <div>
          <button onClick={(e) => playPauseAudio()}>Play</button>
        </div>

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
