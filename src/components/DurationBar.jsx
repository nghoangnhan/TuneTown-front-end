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

  // console.log("file: DurationBar.jsx:21 || DurationBar || songObj:", songObj);

  const songQueuePlayed = useSelector((state) => state.music.songQueuePlayed);
  const songQueue = useSelector((state) => state.music.songQueue); // Get song queue from the store

  const duration = useSelector((state) => state.music.currentSong.songDuration);
  const audioFile = useSelector((state) => state.music.currentSong.songLink);
  const currentTime = useSelector((state) => state.music.currentTime); // Current time when play a song
  const isPlaying = useSelector((state) => state.music.isPlaying); // Check if the song is playing
  const songData = useSelector((state) => state.music.currentSong.songData);
  const volume = useSelector((state) => state.volume.volumeValue); // Get the volume from the store

  const GetSongById = async (id) => {
    try {
      const response = await axios.get(
        `${Base_URL}/songs/getSongById?songId=${id}`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      console.log(response.data);
      return response.data;
    } catch (error) {
      // console.log("Error:", error);
    }
  };

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
  const [sourceNode, setSourceNode] = useState([]);
  const [isAudioPlayed, setIsAudioPlayed] = useState(false);
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
    console.log(sourceNode);
    const logSourceNode = () => {
      if (!isAudioPlayed && sourceNode.length > 0) {
        console.log("Part: " + currentIndex);
        console.log(sourceNode);

        setIsAudioPlayed(true);
        sourceNode[currentIndex].start();
        if (currentIndex < audioArray.length - 1) {
          // setTimeout(() => {
          //   setIsAudioPlayed(false);
          //   setCurrentIndex((prev) => prev + 1);
          // }, (sourceNode[currentIndex].duration - 0.1) * 1000);

          sourceNode[currentIndex].onended = () => {
            setCurrentIndex((prev) => prev + 1);
            setIsAudioPlayed(false);
          };
        }
      }
    };
    logSourceNode();
  }, [sourceNode]);

  useEffect(() => {
    const logSourceNode = () => {
      // console.log(sourceNode);

      if (sourceNode.length > 0) {
        console.log("Part: " + currentIndex);
        console.log(sourceNode);

        setIsAudioPlayed(true);
        sourceNode[currentIndex].start();
        if (currentIndex < audioArray.length - 1) {
          // setTimeout(() => {
          //   setIsAudioPlayed(false);
          //   setCurrentIndex((prev) => prev + 1);
          // }, (sourceNode[currentIndex].duration - 0.005) * 1000);

          sourceNode[currentIndex].onended = () => {
            setCurrentIndex((prev) => prev + 1);
            setIsAudioPlayed(false);
          };
        }
      }
    };
    logSourceNode();
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
        setSourceNode((prevArray) => [...prevArray, source]);
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
    if (sourceNode.current[0] == null) {
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
   * Initialize the audioContext for a whole session
   */
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
    setStartTime(0);
  };

  /**
   * Play the audio right after the first part is processed
   */
  useEffect(() => {
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
    onLoaded();
  }, [isLoaded.current]);

  /**
   * Connect the audio source into a chain
   */
  useEffect(() => {
    const playNext = async () => {
      console.log(sourceNode.current[currentIndex]);
      if (sourceNode.current[currentIndex] != null) {
        console.log(sourceNode.current);
        sourceNode.current[currentIndex].start(0, startTime);
      }

      if (currentIndex + 1 < audioBufferArray.current.length) {
        await setOnEnded();
      }
    };
    playNext();
  }, [currentIndex, isSeeked.current]);

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
    if (newTime > 0 && newTime < duration && isPlaying === false) {
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
    }
  };

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
