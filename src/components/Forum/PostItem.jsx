import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useContextMenu } from "react-contexify";
import { useNavigate } from "react-router-dom";
import { useForumUtils } from "../../utils/useChatUtils";
import useIconUtils from "../../utils/useIconUtils";
import AudioWaveSurfer from "./AudioWaveSurfer";
import OptionPostItem from "./OptionPostItem";
import { useMusicAPIUtils } from "../../utils/useMusicAPIUtils";
import useSongUtils from "../../utils/useSongUtils";

const PostItem = ({ postContent }) => {
  const navigate = useNavigate();
  const { show } = useContextMenu();
  const [refresh, setRefresh] = useState(false);
  const userId = parseInt(localStorage.getItem("userId"));
  const {
    getPostById,
    likePost,
    handleCheckLiked,
  } = useForumUtils();
  const { ThumbsUpSolid, VerifyAccount, OptionsIcon } = useIconUtils();
  const [liked, setLiked] = useState();
  const [postDetail, setPostDetail] = useState();
  const { getListSongPlaylist } = useMusicAPIUtils();
  const [songData, setSongData] = useState(null);
  const { showArtistV2, NavigateSong, } = useSongUtils();
  const { handleSharePost } = useForumUtils();
  const { PlayButton } = useIconUtils();

  console.log("PostItem", postContent);
  // Get the time of the post
  const countTime = new Date(
    postContent?.postTime
  ).toLocaleString();
  const handGetPostById = async () => {
    await getPostById(postContent.id).then((res) => {
      console.log("Get Post By ID", res);
      setPostDetail(res);
    });
  };

  // Call this function when you want to refresh the playlist
  const refreshPlaylist = () => {
    setRefresh(!refresh);
  };

  function displayMenu(e, postId) {
    e.preventDefault();
    show({
      position: { x: e.clientX, y: e.clientY },
      event: e,
      id: `songOption_${postId}`,
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

  useEffect(() => {
    if (handleCheckLiked(postDetail?.likes)) {
      setLiked(true);
    } else {
      setLiked(false);
    }
    console.log("Liked", liked);
  }, [postDetail?.likes, likePost]);

  useEffect(() => {
    handGetPostById();
  }, [postContent.id]);

  useEffect(() => {
    if (refresh) handGetPostById();
    setRefresh(false);
  }, [refresh]);

  const getSongFromPlaylist = async (playlistId) => {
    try {
      const data = await getListSongPlaylist(playlistId);
      return data.map(item => item.song);
    } catch (error) {
      console.error("Error fetching song:", error);
      return null;
    }
  }

  useEffect(() => {
    if (postContent.playlist) {
      getSongFromPlaylist(postContent.playlist.id)
        .then(song => setSongData(song))
        .catch(error => console.error("Error:", error));
    }
  }, [postContent.playlist]);

  return (
    <div className="px-3 py-3 m-auto mx-1 mt-4 shadow-md bg-backgroundComponentPrimary dark:bg-backgroundComponentDarkPrimary rounded-2xl xl:h-fit xl:mx-3 xl:mt-5 xl:py-5 xl:px-5">
      <div className="flex flex-col justify-center">
        <div className="flex flex-row items-start justify-between">
          <div className="flex flex-col">
            {/* Artist Name  */}
            <div className="flex flex-row items-center gap-1 text-xl font-bold text-primary dark:text-primaryDarkmode">
              {postContent.author.userName}
              {postContent.author.role == "ARTIST" && (
                <VerifyAccount></VerifyAccount>
              )}
            </div>
            <div className="text-xs font-medium text-primaryText2 dark:text-primaryTextDark2">
              {countTime}
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
        {/* Audio Wave */}
        {(postContent.song || postContent.mp3Link) && (
          <div className="w-full">
            <AudioWaveSurfer song={postContent.song} mp3Link={postContent.mp3Link} />
          </div>
        )}

        {/* Playlist */}
        {songData && (
          songData.map((song) => (
            <div
              className="flex mt-10 justify-left xl:w-full xl:h-full"
              key={song.id}
            >
              <img
                src={`${song.poster ? song.poster : `https://i.pinimg.com/550x/f8/87/a6/f887a654bf5d47425c7aa5240239dca6.jpg`}`}
                alt="Song Poster"
                className="w-8 h-8"
              />
              <div className="text-[#2E3271] xl:text-base font-semibold">
                <h2 className="text-primary" onClick={() => NavigateSong(song.id)}>{song.songName}</h2>
                <h2 className="text-sm text-[#7C8DB5B8] mt-1">
                  {song.artists && showArtistV2(song.artists)}
                  {!song.artists && <span>Null</span>}
                </h2>
              </div>
              <div className="flex flex-row items-center justify-center text-[#464444] font-semibold gap-1">
                <PlayButton></PlayButton>
              </div>
            </div>
          ))
        )}
      </div>
      {/* Line section */}
      <span className="block py-2 my-1 font-bold text-center border-b-2 border-primary opacity-10"></span>

      {/* React Post  */}
      <div className="flex flex-row items-center justify-between gap-5 font-bold text-primary">
        {/* Like  */}
        <button className="flex flex-row items-center gap-2 mx-2 mt-2 font-bold text-md opacity-80 "
          onClick={handleLikePost}>
          <ThumbsUpSolid liked={liked}></ThumbsUpSolid>
          <span>{postDetail != null ? postDetail.likes.length : postContent.likes.length}</span>
        </button>

        {/* Control  */}
        <button
          className="mx-2 mt-2 font-bold cursor-pointer text-md opacity-80"
          onClick={handlePostClick}
        >
          Comment
        </button>
        <button className="mx-2 mt-2 font-bold text-md opacity-80" onClick={() => handleSharePost(postContent, false)}>
          Share
        </button>
        <button className="mx-2 mt-2 font-bold text-md opacity-80">
          Report
        </button>
      </div>
      {/* Context Menu */}
      <OptionPostItem
        postId={postContent.id}
        id={`songOption_${postContent.id}`}
        refreshPlaylist={refreshPlaylist}
      ></OptionPostItem>
    </div>
  );
};

PostItem.propTypes = {
  postContent: PropTypes.object.isRequired,
};

export default PostItem;
