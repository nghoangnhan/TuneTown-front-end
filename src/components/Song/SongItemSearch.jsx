/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  addSongToQueue,
  setCurrentSong,
  setCurrentTime,
  setIsPlaying,
} from "../../redux/slice/music";
import DefaultArt from "../../assets/img/CoverArt/starboy.jpg";
import {
  Menu,
  Item,
  Separator,
  Submenu,
  useContextMenu,
} from "react-contexify";
import { message } from "antd";
import useSongUtils from "../../utils/useSongUtils";
import { useMusicAPIUtils } from "../../utils/useMusicAPIUtils";
import useIconUtils from "../../utils/useIconUtils";
import { useTranslation } from "react-i18next";

// Different from SongItem.jsx, this component is used for search page and the color of attribute is different
const SongItemSearch = ({ song, songOrder }) => {
  const { id, songName, artists, poster, songData, lyric } = song;
  const audioRef = useRef();
  const { PlayButton } = useIconUtils();
  const { show } = useContextMenu();
  const dispatch = useDispatch();
  const userId = localStorage.getItem("userId");
  const { addSongToPlaylist, getUserPlaylist, addSongToHistory } =
    useMusicAPIUtils();
  const { showArtistV2, NavigateSong } = useSongUtils();
  const isPlaying = useSelector((state) => state.music.isPlaying);
  const songInfor = useSelector((state) => state.music.currentSong);
  // const audio = document.getElementById("audio");
  const [playlistList, setPlaylistList] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const { t } = useTranslation();

  const songInforObj = {
    id: id,
    songName: songName,
    artists: artists.map((artist) => artist),
    songDuration: songInfor.songDuration,
    songCover: poster,
    songData: songData,
    lyric: lyric,
  };

  // When click to the song, save the current song to the context and play it
  const HandlePlay = () => {
    addSongToHistory(userId, songInforObj.id);
    dispatch(setCurrentTime(0));
    // Send Song information to the store
    dispatch(setCurrentSong(songInforObj));
    // dispatch(setSongLinks(songInforObj.songLink));
    if (isPlaying == false) {
      dispatch(setIsPlaying(!isPlaying));
    }
  };
  // const songDuration = GetSongDuration(songData);

  function displayMenu(e, songId) {
    // console.log("PlaylistList", playlistList);
    e.preventDefault();
    show({
      position: { x: e.clientX, y: e.clientY },
      event: e,
      id: `songOption_${songId}`,
    });
  }

  // Call this function when you want to refresh the playlist
  const refreshPlaylist = () => {
    setRefresh(!refresh);
  };
  useEffect(() => {
    // Add list playlist to context menu
    getUserPlaylist(userId).then((data) => setPlaylistList(data));
  }, []);

  return (
    <div onContextMenu={(e) => displayMenu(e, songInforObj.id)}>
      {/* Context Menu */}
      <Menu id={`songOption_${songInforObj.id}`} className="contexify-menu">
        <Item onClick={refreshPlaylist}>{t("song.refresh")}</Item>
        <Item
          onClick={() => {
            dispatch(addSongToQueue(songInforObj));
            message.success(`${t("song.added")} ${songInforObj.songName} ${t("song.toQueue")}`);
          }}
        >
          {t("song.addToQueue")}
        </Item>
        <Separator />
        <Submenu label={t("song.addToPlaylist")}>
          {playlistList &&
            playlistList.map((playlist) => (
              <Item
                key={playlist.id}
                onClick={() => {
                  addSongToPlaylist(songInforObj.id, playlist.id).then(
                    (result) => {
                      if (result.success) {
                        message.success(
                          `${t("song.added")} ${songInforObj.songName} #${songInforObj.id} ${t("song.to")} ${playlist.playlistName} #${playlist.id}`
                        );
                      } else {
                        message.error(`${t("song.failedToAddSong")}: ${result.error}`);
                      }
                    }
                  );
                }}
              >
                {playlist.playlistName}{" "}
                <span className="text-[#938e8e] ml-1"> #{playlist.id}</span>
              </Item>
            ))}
        </Submenu>
      </Menu>

      <div className="relative flex flex-row items-center p-2 my-2 text-sm rounded-md cursor-pointer bg-backgroundSongItem hover:bg-backgroundSongItemHover dark:bg-backgroundSongItemDark hover:dark:bg-backgroundSongItemHoverDarkbg-backgroundSongItem hover:dark:bg-backgroundSongItemHoverDark text-primary xl:text-base">
        {
          <div className="flex items-center justify-center mx-2 font-bold xl:w-12 xl:h-12 xl:mx-3 text-primary dark:text-primaryDarkmode ">
            <span>{songOrder}</span>
          </div>
        }
        <img
          className="object-cover w-12 h-12 mr-3 rounded-lg xl:w-14 xl:h-14"
          alt="Album cover"
          src={poster ? poster : DefaultArt}
        />
        {/* // Audio element */}
        <audio ref={audioRef} src={songInforObj.songLink}></audio>
        <div className="font-semibold text-primary dark:text-primaryDarkmode xl:text-base">
          <h2 className="text-primary dark:text-primaryDarkmode" onClick={() => NavigateSong(songInforObj.id)}>{songInforObj.songName}</h2>
          <h2 className="mt-1 text-sm text-primaryText2 dark:text-primaryTextDark2">
            {artists && showArtistV2(artists)}
            {!artists && <span>Null</span>}
          </h2>
        </div>
        <div className="absolute flex flex-row items-center gap-1 right-4 xl:gap-10">
          <button
            className="p-1 hover:bg-slate-300 rounded-2xl"
            onClick={HandlePlay}
          >
            <PlayButton></PlayButton>
          </button>
          {/* <div>{TimeConvert(songInforObj.songDuration)}</div> */}
          {/* <div>{TimeConvert(234)}</div> */}
        </div>
      </div>
    </div>
  );
};

export default SongItemSearch;
