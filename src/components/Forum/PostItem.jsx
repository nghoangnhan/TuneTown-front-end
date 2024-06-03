import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useContextMenu } from "react-contexify";
import { useNavigate } from "react-router-dom";
import { useForumUtils } from "../../utils/useChatUtils";
import useIconUtils from "../../utils/useIconUtils";
import OptionPostItem from "./OptionPostItem";
import { useMusicAPIUtils } from "../../utils/useMusicAPIUtils";
import useSongUtils from "../../utils/useSongUtils";
import useConfig from "../../utils/useConfig";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { addPlaylistSongToQueue, setCurrentSong, setCurrentTime, setIsPlaying } from "../../redux/slice/music";

const PostItem = ({ postContent }) => {
  const navigate = useNavigate();
  const { show } = useContextMenu();
  const userId = localStorage.getItem("userId");
  const { Base_AVA } = useConfig();
  const { getPostById, likePost, handleCheckLiked, handleSharePost } =
    useForumUtils();
  const dispatch = useDispatch();
  const { ThumbsUpSolid, OptionsIcon, PlayButton, UserCheck } = useIconUtils();
  const { showArtistV2, NavigateSong } = useSongUtils();
  const [liked, setLiked] = useState();
  const [postDetail, setPostDetail] = useState();
  const { getListSongPlaylist } = useMusicAPIUtils();
  const [songPlaylist, setSongPlaylist] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const { t } = useTranslation();

  // Get the time of the post
  const countTime = new Date(postContent?.postTime).toLocaleString();
  const handGetPostById = async () => {
    await getPostById(postContent.id).then((res) => {
      // console.log("Get Post By ID", res);
      setPostDetail(res);
    });
  };

  const getSongFromPlaylist = async (playlistId) => {
    try {
      const data = await getListSongPlaylist(playlistId);
      return data.map((item) => item.song);
    } catch (error) {
      console.error("Error fetching song:", error);
      return null;
    }
  };

  function displayMenu(e, postId) {
    e.preventDefault();
    show({
      position: { x: e.clientX, y: e.clientY },
      event: e,
      id: `postOption_${postId}`,
    });
  }

  const handlePostClick = () => {
    navigate(`/forum/${postContent.id}`);
  };

  const handleLikePost = async () => {
    await likePost({ userId: userId, postId: postContent?.id }).then(() => {
      setRefresh(true);
    });
  };

  const handleAddSongToQueue = (songList) => {
    console.log("handleAddSongToQueue", songList);
    dispatch(setCurrentTime(0));
    dispatch(
      setCurrentSong({
        id: songList[0]?.id,
        songName: songList[0]?.songName,
        artists: songList[0]?.artists.map((artist) => artist),
        songDuration: songList[0]?.songDuration || 200,
        songCover: songList[0]?.poster,
        songData: songList[0]?.songData,
      })
    );

    dispatch(setIsPlaying(true));
    const queueSongs = songList.slice(1, songList.length).map((song) => ({
      id: song?.id,
      songName: song?.songName,
      artists: song?.artists.map((artist) => artist),
      songDuration: song?.songDuration || 200,
      songCover: song?.poster,
      songData: song?.songData,
    }));
    console.log(queueSongs);
    dispatch(addPlaylistSongToQueue(queueSongs));
  };


  useEffect(() => {
    if (handleCheckLiked(postDetail?.likes)) {
      setLiked(true);
    } else {
      setLiked(false);
    }
  }, [postDetail?.likes, likePost]);

  useEffect(() => {
    handGetPostById();
  }, [postContent.id]);

  useEffect(() => {
    if (refresh) handGetPostById();
    setRefresh(false);
  }, [refresh]);

  useEffect(() => {
    if (postContent.playlist) {
      getSongFromPlaylist(postContent.playlist.id)
        .then((song) => {
          setSongPlaylist(song);
          console.log("Song Playlist", song);
        })
        .catch((error) => console.error("Error:", error));
    }
  }, [postContent.playlist]);

  return (
    <div className="px-2 py-3 m-auto mx-1 mt-4 shadow-md bg-backgroundComponentPrimary dark:bg-backgroundPlaylistDark rounded-2xl xl:h-fit xl:mt-5 xl:py-5 xl:px-5">
      <div className="flex flex-col justify-center">
        <div className="flex flex-row items-start justify-between">
          <div className="flex flex-col">
            <div className="flex flex-row items-center gap-2 cursor-pointer" onClick={() => navigate(
              postContent.author.id === userId ? "/my-profile" : `/artist/${postContent.author.id}`
            )}>
              <div>
                <img
                  className="w-10 h-10 rounded-full"
                  src={postContent.author?.avatar ? postContent.author.avatar : Base_AVA}
                  alt="Avatar"
                />
              </div>
              <div className="flex flex-col">
                {/* Artist Name  */}
                <div className="flex flex-row items-center gap-1 text-xl font-bold text-primary dark:text-primaryDarkmode">
                  {postContent.author?.userName}
                  {postContent.author?.role == "ARTIST" && (
                    <div className="text-lg">
                      <UserCheck ></UserCheck>
                    </div>
                  )}
                </div>
                <div className="text-xs font-medium text-primaryText2 dark:text-primaryTextDark2">
                  {countTime}
                </div>
              </div>
            </div>
            <div
              className="mt-2 text-base cursor-pointer text-textNormal dark:text-textNormalDark"
              onClick={handlePostClick}
            >
              {postContent.content}
            </div>
          </div>
          {/* Post Option */}
          <div>
            <button
              className="top-2 right-2 text-iconText dark:text-iconTextDark"
              onClick={(e) => displayMenu(e, postContent.id)}
            >
              <OptionsIcon></OptionsIcon>
            </button>
          </div>
        </div>

        {/* Song Content */}
        {(postContent.song || postContent.mp3Link) && (
          <div className="flex flex-row items-center justify-between p-2 mt-2 rounded-md hover:dark:bg-backgroundSongItemDark">
            <div className="flex flex-row gap-2">
              <div className="items-center rounded-md ">
                <img
                  className="w-16 h-16 rounded-md"
                  src={
                    postContent.song?.poster ? postContent.song.poster : Base_AVA
                  }
                  alt="Cover Art Song"
                />
              </div>

              {/* Show song Infor   */}
              <div className="flex flex-col items-start gap-1">
                <div className="text-lg font-bold cursor-pointer text-primary dark:text-primaryDarkmode hover:underline" onClick={
                  () => {
                    if (postContent.song) {
                      NavigateSong(postContent.song.id);
                    }
                  }
                }>
                  {postContent.song.songName}
                </div>
                <div className="text-base text-primaryText2 dark:text-primaryTextDark2">
                  {showArtistV2(postContent.song.artists)}
                </div>
              </div>
            </div>
            <div className="cursor-pointer hover:opacity-70" onClick={() => dispatch(setCurrentSong(
              {
                id: postContent.song.id,
                songName: postContent.song.songName,
                artists: postContent.song.artists.map((artist) => artist),
                songDuration: postContent.song.songDuration || 200,
                songCover: postContent.song.poster,
                songData: postContent.song.songData,
              }
            ))}>
              <PlayButton color={true} />
            </div>
          </div>
        )}

        {/* Playlist */}
        {postContent.playlist && (
          <div>
            <span className="block py-2 my-1 font-bold text-center border-b-2 border-primary opacity-10" />
            <div className="flex flex-row items-start justify-start gap-4 mt-4">
              {/* PlaylistInfo  */}
              <div
                className="flex flex-row items-center gap-4 cursor-pointer min-w-fit justify-evenly"
              >
                <div className="relative inline-block rounded-full dark:bg-white">
                  <img
                    className="transition duration-300 ease-in-out transform rounded-md max-w-14 max-h-14 w-fit h-fit "
                    src={
                      postContent.playlist.coverArt
                        ? postContent.playlist.coverArt
                        : Base_AVA
                    }
                    alt="Cover Art Playlist"
                  />
                  <div className="absolute inset-0 z-10 flex items-center justify-center transition-opacity duration-300 opacity-0 hover:opacity-100"
                    onClick={() => handleAddSongToQueue(songPlaylist)}
                  >
                    <PlayButton color={true} className="text-3xl text-white" />
                  </div>
                </div>

                <div className="w-fit" onClick={() =>
                  navigate(`/detail-playlist/${postContent.playlist.id}`)}>
                  <h2 className="text-lg font-bold text-primary dark:text-primaryDarkmode">
                    {postContent.playlist.playlistName}
                  </h2>
                  <h2 className="text-base text-primaryText2 dark:text-primaryTextDark">
                    {postContent.playlist.user.userName
                      ? postContent.playlist.user.userName
                      : "Unknown User"}
                  </h2>
                </div>
              </div>

              {/* Song Playlist */}
              {songPlaylist && (
                <div className="flex flex-col w-full gap-1 overflow-auto max-h-32">
                  {songPlaylist.slice(0, 6).map((song, index) => (
                    <div
                      key={index}
                      className={`flex flex-row items-center justify-start w-full gap-2 p-1 px-2 rounded-md cursor-pointer bg-backgroundPlaylistHover dark:bg-backgroundPlaylistHoverDark hover:opacity-70`}
                      style={{ pointerEvents: song.status == 0 ? 'none' : 'auto', opacity: song.status == 0 ? 0.5 : 1 }}
                    >
                      <div className="w-14 h-14 ">
                        <img
                          className="object-cover min-w-[48px] min-h-[48px] w-full h-full bg-white rounded-md"
                          src={song.poster ? song.poster : Base_AVA}
                          alt="Cover Art Song"
                        />
                      </div>
                      <div className="flex flex-col w-full gap-1" onClick={() => NavigateSong(song.id)}>
                        <div className="text-sm font-bold text-primary dark:text-primaryDarkmode hover:underline">
                          {song.songName}
                        </div>
                        <div className="text-xs text-primaryText2 dark:text-primaryTextDark2">
                          {showArtistV2(song.artists)}
                        </div>
                      </div>
                      {/* Hover Show Play Icon  */}
                      <div className="flex flex-row items-center justify-end w-full mr-4 opacity-0 hover:opacity-100"
                        onClick={() => dispatch(setCurrentSong(
                          {
                            id: song.id,
                            songName: song.songName,
                            artists: song.artists.map((artist) => artist),
                            songDuration: song.songDuration || 200,
                            songCover: song.poster,
                            songData: song.songData,
                          }
                        ))}
                      >
                        <PlayButton color={true} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Line section */}
      <span className="block py-2 my-1 font-bold text-center border-b-2 border-primary dark:border-primaryDarkmode opacity-10" />

      {/* React Post  */}
      <div className="flex flex-row items-center justify-between gap-5 font-bold text-primary dark:text-primaryDarkmode">
        {/* Like  */}
        <button
          className="flex flex-row items-center gap-2 mx-2 mt-2 font-bold text-md opacity-80 "
          onClick={handleLikePost}
        >
          <ThumbsUpSolid liked={liked}></ThumbsUpSolid>
          <span>
            {postDetail != null
              ? postDetail.likes.length
              : postContent.likes.length}
          </span>
        </button>

        {/* Control  */}
        <button
          className="mx-2 mt-2 font-bold cursor-pointer text-md opacity-80"
          onClick={handlePostClick}
        >
          {t("forum.comment")}
        </button>
        <button
          className="mx-2 mt-2 font-bold text-md opacity-80"
          onClick={() => handleSharePost(postContent, false)}
        >
          {t("forum.share")}
        </button>
      </div>
      {/* Context Menu */}
      <OptionPostItem
        id={`postOption_${postContent.id}`}
        postId={postContent.id}
        postContent={postContent}
      ></OptionPostItem>
    </div>
  );
};

PostItem.propTypes = {
  postContent: PropTypes.object.isRequired,
};

export default PostItem;
