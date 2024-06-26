/* eslint-disable no-unused-vars */
import { message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setRefreshPlaylist } from "../redux/slice/playlist";
import useConfig from "./useConfig";
import ColorThief from "colorthief";

export const useSongUtils = () => {
  const { Base_URL_FE } = useConfig();
  const userId = localStorage.getItem("userId");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const refreshPlaylist = useSelector(
    (state) => state.playlist.refreshPlaylist
  );

  const isPlaying = useSelector((state) => state.music.isPlaying);

  //     const { setDuration } = useMusicSlice();
  //   // Get the duration of the song
  //   const getSongDuration = (songTime) => {
  //       dispatch(setDuration(songTime.duration))
  //       return duration;
  //     };
  // Transform seconds to minutes:seconds

  const TimeConvert = (sec) => {
    const minutes = Math.floor(sec / 60);
    const seconds = Math.floor(sec % 60);
    const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
    return `${minutes}:${formattedSeconds}`;
  };
  // Show artist name
  const showArtist = (artistName) => {
    // console.log("showArtist", artistName);
    if (artistName.length > 1) {
      return artistName.join(", ");
    } else {
      return artistName[0];
    }
  };
  const handleNavigation = (artistId) => {
    if (userId === artistId) {

      navigate('/my-profile');
    } else {
      navigate(`/artist/${artistId}`);
    }
  };
  const showArtistV2 = (artistName, fontSize) => {
    if (artistName && artistName.length > 1) {
      return artistName.map((artist, index) => (
        <span key={artist.id} className={`${fontSize ? fontSize : "text-sm"} cursor-pointer text-primaryText2 dark:text-primaryTextDark2 hover:underline hover:text-primary`}>
          {index == artistName.length - 1 ? (
            <span onClick={() => handleNavigation(artist.id)}>
              {artist.userName}
            </span>
          ) : (
            <span onClick={() => handleNavigation(artist.id)}>
              {artist.userName}, &nbsp;
            </span>
          )}
        </span>
      ));
    } else if (artistName && artistName.length == 1) {
      let artist = artistName[0];
      return (
        <span
          key={artist.id}
          className={`${fontSize ? fontSize : "text-sm"}  cursor-pointer text-primaryText2 dark:text-primaryTextDark2 hover:underline hover:text-primary`}
          onClick={() => handleNavigation(artist.id)}
        >
          {artist.userName}
        </span>
      );
    } else {
      return "Unknown Artist";
    }
  };

  const NavigateSong = (songId) => {
    navigate(`/song/${songId}`);
  };

  const NavigatePlaylist = (playlistId, owned) => {
    if (owned == true) {
      navigate(`/my-detail-playlist/${playlistId}`);
    }
    else {
      navigate(`/detail-playlist/${playlistId}`);
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

  const HandleRefreshPlaylist = () => {
    // True is to refresh the playlist
    if (refreshPlaylist == true) {
      dispatch(setRefreshPlaylist(false));
    }
  }

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
    // console.log("audioRef", audioRef.current.duration);
    return audioRef.current.duration;
  };

  const rgbToHex = (r, g, b) => '#' + [r, g, b].map(x => {
    const hex = x.toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }).join('')

  const getPosterColor = async (poster, colorBG, setColorBG, setLoading) => {
    return new Promise((resolve, reject) => {
      const colorThief = new ColorThief();
      const img = new Image();
      img.crossOrigin = "Anonymous";

      img.onload = () => {
        const color = colorThief.getColor(img);
        const hexColor = rgbToHex(color[0], color[1], color[2]);
        setColorBG(hexColor);
        // console.log("Color", colorBG);
        setLoading(false);
      };

      img.onerror = (error) => {
        reject(error); // Reject the promise if there's an error loading the image
      };
      img.src = poster;
    });
  };

  // Song Option
  const handleDownloadSong = async (songInforObj, setLoading, combineData) => {
    setLoading(true);
    try {
      const data = await combineData(songInforObj.id);
      const blob = new Blob([data], { type: 'audio/mpeg' });

      // Create a link element
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = songInforObj.songName; // Set the filename

      // Trigger a click event on the link to prompt the save dialog
      document.body.appendChild(link);
      link.click();

      // Clean up
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false); // Hide loading overlay
    }
  };

  const handleShareSong = (songInforObj) => {
    try {
      const currentUrl = window.location.href;
      const songUrl = `${Base_URL_FE}/song/${songInforObj.id}`;
      navigator.clipboard.writeText(songUrl);
      message.success("Link copied!");
    } catch (error) {
      message.error("Error when coppying song link!!");
      console.error('Error:', error);
    }
  }

  return {
    TimeConvert, GetSongFragment,
    showArtist, showArtistV2, NavigateSong, NavigatePlaylist,
    AcronymName, CheckPlaying, GetSongDuration, rgbToHex, handleDownloadSong, handleShareSong,
    HandleRefreshPlaylist, getPosterColor
  };
};
export default useSongUtils;
