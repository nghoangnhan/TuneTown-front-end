/* eslint-disable no-unused-vars */
import React, { Fragment, useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import useSongUtils from "../utils/useSongUtils";
import {
  playNextSong,
  playPreviousSong,
  setCurrentTime,
  setDuration,
  setIsPlaying,
  setRepeat,
  setShuffle,
  setSongLinks,
} from "../redux/slice/music";
import useConfig from "../utils/useConfig";
import useIconUtils from "../utils/useIconUtils";

const DurationBar = () => {
  const { TimeConvert, CheckPlaying, GetSongDuration } = useSongUtils(); // Song Function
  const dispatch = useDispatch();
  const audioRef = useRef();
  const { PlayIcon, PauseIcon, RepeatIcon, ShuffleIcon,
    SkipNextIcon, SkipPreviousIcon } = useIconUtils();
  const { isMobile } = useConfig();
  // const [duration, setDuration] = useState("0"); // Max time of the song
  const songObj = useSelector((state) => state.music.currentSong); // Get song information from the store
  const songQueuePlayed = useSelector((state) => state.music.songQueuePlayed);
  const songQueue = useSelector((state) => state.music.songQueue); // Get song queue from the store
  const duration = useSelector((state) => state.music.currentSong.songDuration);
  const songData = useSelector((state) => state.music.currentSong.songData);
  const currentTime = useSelector(
    (state) => state.music.currentSong.currentTime
  ); // Current time when play a song
  const isPlaying = useSelector((state) => state.music.isPlaying); // Check if the song is playing
  const volume = useSelector((state) => state.volume.volumeValue); // Get the volume from the store
  const repeat = useSelector((state) => state.music.repeat); // Get the repeat state from the store
  const shuffle = useSelector((state) => state.music.shuffle); // Get the shuffle state from the store
  const [isAudioReady, setIsAudioReady] = useState(false);

  // HANLDE PLAYING AUDIO FILES WITH BUFFER
  const [audioContext, setAudioContext] = useState(null);
  const audioBufferArray = useRef([]);
  const sourceNode = useRef([
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
  ]);
  const timeOutArray = useRef([
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
  ]);
  // const [isAudioPlayed, setIsAudioPlayed] = useState(false);
  const isLoaded = useRef(false);
  const [startTime, setStartTime] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const gainVolume = useRef();
  const isSeeked = useRef(true);
  /**
   * Create a buffer source for buffered audio
   */
  const createSourceForPlaying = async (index) => {
    // Create a new source node
    const source = audioContext.createBufferSource();
    source.buffer = audioBufferArray.current[index];
    // Connect the source node to the audio context's destination
    source.connect(audioContext.destination);
    source.connect(gainVolume.current);
    // Set the source node in the state
    console.log("replace index: " + index);
    sourceNode.current[index] = source;
  };

  /**
   *
   */
  const setOnEnded = async () => {
    const timeOut = setTimeout(async () => {
      await createSourceForPlaying(currentIndex + 1);
      setCurrentIndex(currentIndex + 1);
    }, (audioBufferArray.current[currentIndex].duration - startTime - 0.05) * 1000);
    timeOutArray.current[currentIndex] = timeOut;
  };

  // ----------------------------------------------------
  const checkAudioReady = () => {
    if (audioBufferArray.current.length > 0) {
      setIsAudioReady(true);
      return true;
    }
    return false;
  };

  // When click the play/pause button
  const handlePlayPause = async () => {
    /**
      Set the isPlaying state to the opposite value, 
      then the useEffect willbe triggered and the play/pause button will be changed
       */
    if (isAudioReady != null) {
      dispatch(setIsPlaying(!isPlaying));
      if (sourceNode.current[0] == null) {
        await loadAndPlayAudio();
      } else {
        // Pause the song
        if (isPlaying == true && currentTime < duration) {
          audioContext.suspend();
        }
        // Play the song
        else if (isPlaying == false && currentTime < duration) {
          audioContext.resume();
        }
      }
    }
  };

  // When click the repeat button
  const handleRepeat = () => {
    dispatch(setRepeat(!repeat));
  };
  const handleShuffle = () => {
    dispatch(setShuffle(!shuffle));
  };

  // When the seekbar is changed by user
  const handleSeek = async (e) => {
    const newTime = e.target.value; // newTime is the new value of the seekbar
    dispatch(setCurrentTime(parseFloat(newTime)));
    dispatch(setIsPlaying(true)); // When move the seekbar, the song will be played
    // audioRef.current.play();
    audioRef.current.currentTime = newTime; // Set the currentTime of the song to the newTime
    const clearCurrentSourceNode = async () => {
      for (let i = 0; i < 10; i++) {
        if (sourceNode.current[i] != null) sourceNode.current[i].disconnect();
        if (timeOutArray.current[i] != null)
          clearTimeout(timeOutArray.current[i]);
      }
    };
    await clearCurrentSourceNode();
    if (sourceNode.current[0] == null) {
      await loadAndPlayAudio();
    }
    const partIndex = ~~(newTime / audioBufferArray.current[0].duration);
    const currentStartTime = newTime % audioBufferArray.current[0].duration;
    console.log(
      "seek to: " + newTime + "=> part: " + partIndex + " " + currentStartTime
    );
    await createSourceForPlaying(partIndex);
    setCurrentIndex(partIndex);
    isSeeked.current = !isSeeked.current;
    setStartTime(currentStartTime);
    // If the song is paused, play the song
    if (newTime >= 0 && newTime < duration && isPlaying === false) {
      dispatch(setIsPlaying(true));
    }
    // If the song is ended, stop the song
    else if (newTime >= duration - 1) {
      dispatch(setIsPlaying(false));
    }
  };

  /**
   * Download the audio files and getting buffer of them
   */
  const loadAudio = async (currentPartIndex) => {
    if (audioContext && songData != null) {
      const currentAudioUrl = songData + currentPartIndex + ".mp3";

      try {
        const response = await fetch(currentAudioUrl);
        const arrayBuffer = await response.arrayBuffer();

        // Decode the audio data
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        audioBufferArray.current.push(audioBuffer);

        isLoaded.current = true;
      } catch (error) {
        console.error("Error loading or playing audio:", error);
      }
    }
  };

  /**
   * Looping for downloading 10 parts of a song and create GainNode for controllig volume
   */
  const loadAndPlayAudio = async () => {
    gainVolume.current = audioContext.createGain();
    gainVolume.current.connect(audioContext.destination);
    gainVolume.current.gain.setValueAtTime(volume, audioContext.currentTime);
    for (let i = 1; i <= 10; i++) {
      await loadAudio(i);
      isLoaded.current = true;
    }
  };
  const initAudioContext = async () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      setAudioContext(audioCtx);
    } catch (error) {
      console.error("Error initializing AudioContext:", error);
    }
  };
  const onLoaded = async () => {
    if (audioBufferArray.current.length > 0 && isLoaded.current) {
      await createSourceForPlaying(currentIndex);
      console.log(sourceNode.current[currentIndex]);
      // setting songDuration
      dispatch(
        setDuration(sourceNode.current[currentIndex].buffer.duration * 10)
      );
      sourceNode.current[currentIndex].start(0, startTime);
      await setOnEnded();
    }
  };

  const playNext = async () => {
    if (sourceNode.current[currentIndex] != null) {
      sourceNode.current[currentIndex].start(0, startTime);
    }
    // if (timeOutArray.current[currentIndex] != null) {
    //   clearTimeout(timeOutArray.current[currentIndex]);
    // }
    if (currentIndex + 1 < audioBufferArray.current.length) {
      await setOnEnded();
    }
    setStartTime(0);
  };

  /**
   * Initialize the audioContext for a whole session
   */
  useEffect(() => {
    initAudioContext();
    return () => {
      if (audioContext) {
        audioContext.close();
      }
    };
  }, []);

  /**
   * Play the audio right after the first part is processed
   */
  useEffect(() => {
    console.log("Loaded changed " + isLoaded.current);
    onLoaded();
  }, [isLoaded.current]);

  /**
   * Connect the audio source into a chain
   */
  useEffect(() => {
    playNext();
  }, [currentIndex, isSeeked.current]);

  // Update the currentTime every second
  useEffect(() => {
    // CheckPlaying(audioRef);
    let interval; // Count the isPlaying
    if (isAudioReady == true && isPlaying == true && currentTime < duration) {
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
      // play next song
      if (songQueue.length > 0) {
        dispatch(setCurrentTime(0));
        dispatch(setIsPlaying(true));
        dispatch(playNextSong());
      } else if (songQueue.length == 0) {
        dispatch(setIsPlaying(false));
        dispatch(setCurrentTime(0));
        // dispatch(setCurrentSong(null));
        dispatch(setSongLinks(null));
      }
    } else {
      clearInterval(interval); // If the song is paused, stop the interval
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentTime, duration, dispatch, CheckPlaying]);

  useEffect(() => {
    console.log("songData changed", songData);
    const loadCurrentSong = async () => {
      const clearCurrentSourceNode = async () => {
        for (let i = 0; i < 10; i++) {
          audioBufferArray.current = [];
          if (sourceNode.current[i] != null) {
            sourceNode.current[i].disconnect();
            sourceNode.current[i] = null;
          }
          if (timeOutArray.current[i] != null)
            clearTimeout(timeOutArray.current[i]);
        }
        isLoaded.current = false;
      };
      await clearCurrentSourceNode();

      if (sourceNode.current[0] == null) {
        await loadAndPlayAudio();
        setCurrentIndex(0);
        setIsAudioReady(true);
      }
    };
    loadCurrentSong();
  }, [songData]);

  /**
   * Hanlde onChange volume
   */
  useEffect(() => {
    if (sourceNode.current[0] != null) {
      gainVolume.current.gain.setValueAtTime(volume, audioContext.currentTime);
    }
  }, [volume]);

  return (
    <div className="flex flex-col">
      <div className="flex flex-row items-center justify-center gap-5">
        {/* Shuffle button */}
        <button
          className={` text-iconText dark:text-iconTextDark hover:opacity-70 ${shuffle ? "text-iconTextActive dark:text-iconTextActiveDark" : ""}`}
          onClick={() => handleShuffle()}
        >
          <ShuffleIcon></ShuffleIcon>
        </button>
        {/* Skip previous button */}
        <button
          className={`${songQueuePlayed == 0 ? "" : "hover:opacity-70"
            } text-iconText dark:text-iconTextDark`}
          disabled={songQueuePlayed.length == 0}
          onClick={
            // Play previous song in queue
            () => {
              if (songQueuePlayed.length > 0) {
                dispatch(setIsPlaying(true));
                dispatch(setCurrentTime(0));
                dispatch(playPreviousSong());
              } else if (songQueuePlayed.length == 0) {
                // dispatch(setIsPlaying(false));
                // dispatch(setCurrentTime(0));
                // dispatch(setCurrentSong(null));
                // dispatch(setSongLinks(null));
              }
            }
          }
        >
          <SkipPreviousIcon></SkipPreviousIcon>
        </button>

        {/* // Stop button */}
        <button
          className="text-iconText dark:text-iconTextDark hover:opacity-70"
          onClick={() => handlePlayPause()}
          hidden={!isPlaying}
        >
          <PauseIcon></PauseIcon>
        </button>

        {/* // Play button */}
        <button
          className="text-iconText dark:text-iconTextDark hover:opacity-70"
          onClick={() => handlePlayPause()}
          hidden={isPlaying}
        >
          <PlayIcon></PlayIcon>
        </button>
        {/* // Audio element */}
        <audio ref={audioRef} src={songData}></audio>

        {/* Skip next button  */}
        <button
          className={`${songQueue == 0 ? " ]" : "hover:opacity-70"
            } text-iconText dark:text-iconTextDark`}
          disabled={songQueue.length == 0}
          onClick={
            // Play next song in queue
            () => {
              if (songQueue.length > 0) {
                dispatch(setIsPlaying(true));
                dispatch(setCurrentTime(0));
                dispatch(playNextSong());
              } else if (songQueue.length == 0) {
                // dispatch(setIsPlaying(false));
                // dispatch(setCurrentTime(0));
                // dispatch(setCurrentSong(null));
                // dispatch(setSongLinks(null));
              }
            }
          }
        >
          <SkipNextIcon></SkipNextIcon>
        </button>

        {/* Repeat button */}
        <button
          className={`text-iconText dark:text-iconTextDark hover:opacity-70 ${repeat ? "text-iconTextActive dark:text-iconTextActiveDark" : ""}`}
          onClick={() => handleRepeat()}
        >
          <RepeatIcon></RepeatIcon>
        </button>
      </div>

      {/* Seekbar Control Song */}
      {/* Desktop  */}
      {!isMobile && (
        <div className="relative flex flex-row items-center justify-center text-primaryText dark:text-primaryTextDark">
          <span className="text-base">
            {TimeConvert(currentTime)}
          </span>
          <input
            type="range"
            min={0}
            max={duration}
            value={currentTime}
            onChange={handleSeek}
            className="bg-[#B9C0DE] w-[400px] h-1 mx-4 rounded-full"
          />
          <span className="text-base">{TimeConvert(duration)}</span>
        </div>
      )}
      {/* Mobile  */}
      {isMobile && (
        <div className="relative flex flex-row items-center justify-center w-screen px-5 text-primaryText dark:text-primaryTextDark">
          <span className="text-xs">
            {TimeConvert(currentTime)}
          </span>
          <input
            type="range"
            min={0}
            max={duration}
            value={currentTime}
            onChange={handleSeek}
            className="bg-[#B9C0DE] w-screen px-5 h-1 mx-2 rounded-full"
          />
          <span className="text-xs">{TimeConvert(duration)}</span>
        </div>
      )}


    </div>
  );
};

export default DurationBar;
