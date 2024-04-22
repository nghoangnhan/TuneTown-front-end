import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Modal } from "antd";
import Repost from "../../components/Forum/Repost";
import { addSongToQueue, setCurrentSong, setCurrentTime, setIsPlaying, } from "../../redux/slice/music";
import DefaultArt from "../../assets/img/logo/logo.png";
import { Menu, Item, Separator, Submenu, useContextMenu } from "react-contexify";
import { message } from "antd";
import useSongUtils from "../../utils/useSongUtils";
import { useMusicAPIUtils } from "../../utils/useMusicAPIUtils";
import PropTypes from "prop-types";
import useIconUtils from "../../utils/useIconUtils";

const SongItem = ({ song, songOrder, songListen }) => {
  const { id, songName, artists, poster, songData, lyric } = song;
  const { show } = useContextMenu();
  const dispatch = useDispatch();
  const userId = localStorage.getItem("userId");
  const { addSongToPlaylist, getUserPlaylist,
    addSongToHistory, combineData } = useMusicAPIUtils();
  const { ListenIcon, RepostButton,
    DownloadButton, ShareButton, PlayButton } = useIconUtils();
  const { showArtistV2, NavigateSong, handleDownloadSong, handleShareSong } = useSongUtils();
  const isPlaying = useSelector((state) => state.music.isPlaying);
  const songInfor = useSelector((state) => state.music.currentSong);
  // const audio = document.getElementById("audio");
  const audioRef = useRef();
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

      <div className="relative flex flex-row items-center p-2 my-1 text-sm rounded-md cursor-pointer bg-backgroundSongItem hover:bg-backgroundSongItemHover dark:bg-backgroundSongItemDark hover:dark:bg-backgroundSongItemHoverDark xl:text-base"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div
          className="flex items-center justify-center mx-2 font-bold xl:w-12 xl:h-12 xl:mx-3 text-primary dark:text-primaryDarkmode "
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
        <div className="font-semibold xl:text-base">
          <h2 className="text-primary dark:text-primaryDarkmode" onClick={() => NavigateSong(songInforObj.id)}>{songInforObj.songName}</h2>
          <h2 className="mt-1 text-sm text-primaryText2 dark:text-primaryTextDark2">
            {artists && showArtistV2(artists)}
            {!artists && <span>Null</span>}
          </h2>
        </div>
        {/* // Listen Icon */}
        <div className="absolute flex flex-row items-center right-2 xl:gap-2">
          {songListen && isHovered === false && (
            <div className="flex flex-row items-center justify-center gap-1 font-semibold text-textNormal dark:text-textNormalDark">
              {songListen}
              <ListenIcon></ListenIcon>
            </div>
          )}


          {isHovered && (
            <>
              {/* Repost Song  */}
              <RepostButton handleRepostSong={handleRepostSong}></RepostButton>
              {/* Download Song */}
              <DownloadButton handleDownloadSong={() => handleDownloadSong(songInforObj, setLoading, combineData)}></DownloadButton>
              {/* Share Song */}
              <ShareButton handleShareSong={() => handleShareSong(songInforObj)}></ShareButton>
            </>
          )}
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

      {/* Modal Repost  */}
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
          <img src="/src/assets/img/logo/logo.png" alt="Loading..." width={100} height={100} className="zoom-in-out" />
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
