import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addSongToQueue, setCurrentSong, setCurrentTime, setIsPlaying, } from "../../redux/slice/music";
import DefaultArt from "../../assets/img/CoverArt/starboy.jpg";
import { Menu, Item, Separator, Submenu, useContextMenu, } from "react-contexify";
import { message } from "antd";
import { setRefreshPlaylist } from "../../redux/slice/playlist";
import axios from "axios";
import UseCookie from "../../hooks/useCookie";
import { useMusicAPIUtils } from "../../utils/useMusicAPIUtils";
import useSongUtils from "../../utils/useSongUtils";
import PropTypes from "prop-types";
import useConfig from "../../utils/useConfig";
import useIconUtils from "../../utils/useIconUtils";

const SongItemPlaylist = ({
  song,
  songId,
  songOrder,
  songIndex,
  playlistId,
}) => {
  const { getToken } = UseCookie();
  const { access_token } = getToken();
  const { Base_URL } = useConfig();
  const { id, songName, artists, poster, songData, lyric } = song;
  const { show } = useContextMenu();
  const userId = localStorage.getItem("userId");
  const { PlayButton } = useIconUtils();
  const {
    addSongToPlaylist,
    getUserPlaylist,
    deleteSongInPlaylist,
    addSongToHistory,
  } = useMusicAPIUtils();
  const { showArtistV2, TimeConvert, NavigateSong } = useSongUtils();
  const dispatch = useDispatch();
  const audioRef = useRef();
  const isPlaying = useSelector((state) => state.music.isPlaying);
  const songInfor = useSelector((state) => state.music.currentSong);
  const [playlistList, setPlaylistList] = useState([]);
  const draggableSong = useSelector((state) => state.playlist.draggable);
  const refreshPlaylist = useSelector(
    (state) => state.playlist.refreshPlaylist
  );
  const [dragOver, setDragOver] = useState(null);

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
    console.log("PlaylistList", playlistList);
    e.preventDefault();
    show({
      position: { x: e.clientX, y: e.clientY },
      event: e,
      id: `songOption_${songId}`,
    });
  }

  // When the song is deleted, refresh the playlist
  const handleDeleteSong = () => {
    deleteSongInPlaylist(songId, localStorage.getItem("myPlaylistId")).then(
      (response) => {
        console.log("Delete song response", response);
        if (response === 200) {
          message.success(`Deleted ${songInforObj.songName} in playlist`);
          // Trigger a re-render by updating the refresh state
          dispatch(setRefreshPlaylist(true));
        } else {
          message.error(`Failed to delete song: ${response.error}`);
        }
      }
    );
  };

  // Sort
  async function handleSort(item, over) {
    const response = await axios.post(
      `${Base_URL}/playlistSongs/orderSong?songOrder=${item}&playlistId=${playlistId}
    &anotherSongOrder=${over}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    if (response.status === 200) {
      message.success(`Order ${item} to ${over}`);
      dispatch(setRefreshPlaylist(true));
      getUserPlaylist(userId).then((data) => setPlaylistList(data));
    } else {
      message.error(`Failed to order song: ${response.error}`);
    }
  }

  useEffect(() => {
    console.log("SongId", songId);
    getUserPlaylist(userId).then((data) => setPlaylistList(data));
    if (refreshPlaylist == true) {
      getUserPlaylist(userId).then((data) => {
        setPlaylistList(data);
        dispatch(setRefreshPlaylist(false));
      });
    }
  }, [refreshPlaylist]);
  return (
    <div onContextMenu={(e) => displayMenu(e, songInforObj.id)}>
      {/* Context Menu */}
      <Menu id={`songOption_${songInforObj.id}`}>
        <Item onClick={refreshPlaylist}>Refresh</Item>
        <Item
          onClick={() => {
            dispatch(addSongToQueue(songInforObj));
          }}
        >
          Add to Queue
        </Item>
        <Item
          onClick={() => {
            handleDeleteSong();
          }}
        >
          Delete Song
        </Item>
        <Separator />
        <Submenu label="Add to playlist">
          {playlistList.map((playlist) => (
            <Item
              key={playlist.id}
              onClick={() => {
                addSongToPlaylist(songInforObj.id, playlist.id).then(
                  (result) => {
                    if (result.success) {
                      message.success(
                        `Added ${songInforObj.songName} #${songInforObj.id} to ${playlist.playlistName} #${playlist.id}`
                      );
                    } else {
                      message.error(`Failed to add song: ${result.error}`);
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

      <div
        className="relative flex flex-row items-center p-2 my-1 text-sm bg-white cursor-pointer text-primary hover:bg-slate-200 rounded-xl xl:text-base"
        draggable={draggableSong}
        onDragStart={(e) => {
          e.dataTransfer.setData("text/plain", songOrder);
        }}
        onDragEnter={() => {
          setDragOver(songIndex + 1);
        }}
        onDragOver={(e) => {
          e.preventDefault();
        }}
        onDrop={(e) => {
          e.preventDefault();
          const draggedItem = e.dataTransfer.getData("text/plain");
          handleSort(draggedItem, dragOver);
        }}
      >
        {
          <div className="flex items-center justify-center mx-2 font-bold xl:w-12 xl:h-12 xl:mx-3 text-primary">
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
        <div className="font-semibold text-primary xl:text-base">
          <h2 className="" onClick={() => NavigateSong(songInforObj.id)}>{songInforObj.songName}</h2>
          <h2 className="mt-1 text-sm text-primaryLight">
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
          <div>{TimeConvert(234)}</div>
          {draggableSong == true && <button>=</button>}
        </div>
      </div>
    </div>
  );
};

export default SongItemPlaylist;
SongItemPlaylist.propTypes = {
  song: PropTypes.object.isRequired,
  songId: PropTypes.string.isRequired,
  songOrder: PropTypes.number.isRequired,
  songIndex: PropTypes.number.isRequired,
  playlistId: PropTypes.string.isRequired,
};
