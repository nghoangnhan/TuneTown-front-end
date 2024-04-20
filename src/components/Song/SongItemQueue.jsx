/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  removeSongFromQueue,
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

const SongItemQueue = ({ song, isPlaying, order }) => {
  const { id, songName, artists, songCover, songData, lyric } = song;
  const userId = localStorage.getItem("userId");
  const { show } = useContextMenu();
  const dispatch = useDispatch();
  const { MusicIcon, PlayButton } = useIconUtils();
  const { addSongToPlaylist,
    getUserPlaylist, addSongToHistory } =
    useMusicAPIUtils();
  const { showArtistV2, NavigateSong } = useSongUtils();
  const songInfor = useSelector((state) => state.music.currentSong);
  // const audio = document.getElementById("audio");  
  const audioRef = useRef();
  const [playlistList, setPlaylistList] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  // This song will be send to duration bar if it is playing
  const songInforObj = {
    id: id,
    songName: songName,
    artists: artists.map((artist) => artist),
    songDuration: songInfor.songDuration,
    songCover: songCover,
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
  // const songDuration = GetSongDuration(songLink);

  function displayMenu(e, songId) {
    console.log("PlaylistList", playlistList);
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
      {contextHolder}
      {/* Context Menu */}
      <Menu id={`songOption_${songInforObj.id}`}>
        <Item onClick={refreshPlaylist}>Refresh</Item>
        <Item
          onClick={() => {
            dispatch(removeSongFromQueue(songInforObj.id));
          }}
        >
          Remove from Queue
        </Item>
        <Separator />
        <Submenu label="Add to playlist">
          {playlistList &&
            playlistList.map((playlist) => (
              <Item
                key={playlist.id}
                onClick={() => {
                  addSongToPlaylist(songInforObj.id, playlist.id).then(
                    (result) => {
                      if (result.success) {
                        messageApi.open({
                          type: "success",
                          content: `Added ${songInforObj.songName} #${songInforObj.id} to ${playlist.playlistName} #${playlist.id}`,
                        });
                      } else {
                        messageApi.open({
                          type: "error",
                          content: `Failed to add song: ${result.error}`,
                        });
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

      <div className="relative flex flex-row items-center p-2 my-1 text-sm bg-white rounded-md cursor-pointer hover:bg-slate-200 xl:text-base">
        {/* Icon Music / */}
        <div className="flex items-center justify-center mx-2 font-bold xl:w-12 xl:h-12 xl:mx-3 text-primary ">
          <span>
            {order && isPlaying == false ? (
              order
            ) : (
              <MusicIcon></MusicIcon>
            )}
          </span>
        </div>
        <img
          className="object-cover w-12 h-12 mr-3 rounded-lg xl:w-14 xl:h-14"
          alt="Album cover"
          src={songCover ? songCover : DefaultArt}
        />
        {/* // Audio element */}
        <audio ref={audioRef} src={songInforObj.songData}></audio>
        <div className="text-[#2E3271] xl:text-base font-semibold">
          <h2 className="text-primary" onClick={() => NavigateSong(songInforObj.id)}>{songInforObj.songName}</h2>
          <h2 className="text-sm text-[#7C8DB5B8] mt-1">
            {artists && showArtistV2(artists)}
            {!artists && <span>Null</span>}
          </h2>
        </div>
        <div className="absolute flex flex-row items-center gap-1 right-4 xl:gap-10">
          <button
            className="p-1 hover:opacity-60 rounded-2xl"
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

export default SongItemQueue;
