import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Modal } from "antd";
import Repost from "../../components/Forum/Repost";
import {
  addSongToQueue,
  setCurrentSong,
  setCurrentTime,
  setIsPlaying,
} from "../../redux/slice/music";
import DefaultArt from "../../assets/img/logo/logo.png";
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
import PropTypes from "prop-types";
import useIconUtils from "../../utils/useIconUtils";

const SongItem = ({ song, songOrder, songListen }) => {
  const { id, songName, artists, poster, songData, lyric } = song;
  const audioRef = useRef();
  const { show } = useContextMenu();
  const dispatch = useDispatch();
  const userId = localStorage.getItem("userId");
  const { addSongToPlaylist, getUserPlaylist, addSongToHistory, combineData } =
    useMusicAPIUtils();
  const { ListenIcon } = useIconUtils();
  const { showArtistV2, NavigateSong } = useSongUtils();
  const isPlaying = useSelector((state) => state.music.isPlaying);
  const songInfor = useSelector((state) => state.music.currentSong);
  // const audio = document.getElementById("audio");
  const [playlistList, setPlaylistList] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

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

  const handleRepostSong = async () => {
    setOpenModal(true);
  }

  const handleDownloadSong = async () => {
    setLoading(true);
    try {
      const data = await combineData(songInforObj.songName);
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

  const handleShareSong = () => {
    try{
      const currentUrl = window.location.href;
      const songUrl = `${currentUrl}/song/${songInforObj.id}`;
      navigator.clipboard.writeText(songUrl);
      message.success("Link copied!");
    } catch (error) {
      message.error("Error when coppying song link!!");
      console.error('Error:', error);
    }
  }

  const handleMouseEnter = () => {
      setIsHovered(true);
  };

  const handleMouseLeave = () => {
      setIsHovered(false);
  };

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
      <Menu id={`songOption_${songInforObj.id}`}>
        <Item onClick={refreshPlaylist}>Refresh</Item>
        <Item
          onClick={() => {
            dispatch(addSongToQueue(songInforObj));
          }}
        >
          Add to Queue
        </Item>
        <Separator />
        <Submenu label="Add to playlist">
          {playlistList &&
            playlistList?.map((playlist) => (
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

      <div className="relative flex flex-row items-center p-2 my-1 text-sm bg-white rounded-md cursor-pointer hover:bg-slate-200 xl:text-base"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div
          className="xl:w-12 xl:h-12
        mx-2 xl:mx-3  flex justify-center items-center text-[#79AC78] font-bold
        "
        >
          <span>{songOrder + 1}</span>
        </div>
        <img
          className="object-cover w-12 h-12 mr-3 rounded-lg xl:w-14 xl:h-14"
          alt="Album cover"
          src={poster ? poster : DefaultArt}
        />
        {/* // Audio element */}
        <audio ref={audioRef} src={songInforObj.songLink}></audio>
        <div className="text-[#2E3271] xl:text-base font-semibold">
          <h2 className="text-primary" onClick={() => NavigateSong(songInforObj.id)}>{songInforObj.songName}</h2>
          <h2 className="text-sm text-[#7C8DB5B8] mt-1">
            {artists && showArtistV2(artists)}
            {!artists && <span>Null</span>}
          </h2>
        </div>
        {/* // Listen Icon */}
        <div className="absolute flex flex-row items-center right-2 xl:gap-2">
          {songListen && (
            <div className="flex flex-row items-center justify-center text-[#464444] font-semibold gap-1">
              {songListen}
              <ListenIcon></ListenIcon>
            </div>
          )}
          <button
            className="p-1 hover:opacity-60 rounded-2xl"
            onClick={HandlePlay}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="#79AC78"
              className="w-6 h-6"
            >
              <path
                fillRule="evenodd"
                d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          { isHovered && (
            <>
              <button
            className="p-1 hover:opacity-60 rounded-2xl"
            onClick={handleRepostSong}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
              />
            </svg>
          </button>
          <button
            className="p-1 hover:opacity-60 rounded-2xl"
            onClick={handleDownloadSong}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
              />
            </svg>
          </button>
          <button
            className="p-1 hover:opacity-60 rounded-2xl"
            onClick={handleShareSong}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" viewBox="0 0 24 24" 
              strokeWidth="1.5" 
              stroke="currentColor" 
              className="w-6 h-6"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" 
              />
            </svg>
          </button>
            </>  
          )}
          {/* <div>{TimeConvert(songInforObj.songDuration)}</div> */}
          {/* <div>{TimeConvert(234)}</div> */}
        </div>
      </div>
      <Modal
        title="Repost"
        open={openModal}
        onCancel={() => {
          setOpenModal(false);
        }}
        footer={null}
      >
        <Repost song={songInforObj} closeModal={() => setOpenModal(false)} />
      </Modal>
      {loading && (
        <div className="overlay">
          <img src="/src/assets/img/logo/logo.png" alt="Loading..." width={100} height={100} className="zoom-in-out"/>
        </div>
      )}
    </div>
  );
};

export default SongItem;

SongItem.propTypes = {
  song: PropTypes.object,
  songId: PropTypes.string,
  songOrder: PropTypes.number,
  songIndex: PropTypes.number,
  playlistId: PropTypes.string,
  songListen: PropTypes.number,
};
