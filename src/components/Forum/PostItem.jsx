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
import useConfig from "../../utils/useConfig";

const PostItem = ({ postContent }) => {
  const navigate = useNavigate();
  const { show } = useContextMenu();
  const userId = parseInt(localStorage.getItem("userId"));
  const { Base_AVA } = useConfig();
  const { getPostById, likePost, handleCheckLiked, handleSharePost } = useForumUtils();
  const { ThumbsUpSolid, VerifyAccount, OptionsIcon } = useIconUtils();
  const { showArtistV2, NavigateSong, NavigatePlaylist } = useSongUtils();
  const [liked, setLiked] = useState();
  const [postDetail, setPostDetail] = useState();
  const { getListSongPlaylist } = useMusicAPIUtils();
  const [songPlaylist, setSongPlaylist] = useState(null);
  const [refresh, setRefresh] = useState(false);

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

  const getSongFromPlaylist = async (playlistId) => {
    try {
      const data = await getListSongPlaylist(playlistId);
      return data.map(item => item.song);
    } catch (error) {
      console.error("Error fetching song:", error);
      return null;
    }
  }

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
        .then(song => {
          setSongPlaylist(song)
        })
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
          <div className="flex flex-row items-center justify-center gap-2 mt-2">
            <div className="items-center rounded-md dark:bg-white ">
              <img className="rounded-md max-w-20 max-h-20 w-fit h-fit" src={postContent.song?.poster ? postContent.song.poster : Base_AVA} alt="Cover Art Song" />
            </div>
            <div className="w-full">
              <AudioWaveSurfer song={postContent.song} mp3Link={postContent.mp3Link} />
            </div></div>
        )}

        {/* Playlist */}
        {postContent.playlist && (
          <div className="flex flex-row items-center justify-start gap-2 mt-2">
            {/* PlaylistInfo  */}
            <div className="flex flex-row items-center justify-center gap-1 cursor-pointer">
              <div className="rounded-md dark:bg-white">
                <img className="rounded-md max-w-14 max-h-14 w-fit h-fit" src={postContent.playlist.coverArt ? postContent.playlist.coverArt : Base_AVA} alt="Cover Art Playlist" />
              </div>
              <div >
                <h2 className="text-lg font-bold text-primary dark:text-primaryDarkmode">{postContent.playlist.playlistName}</h2>
                <h2 className="text-base text-primaryText2 dark:text-primaryTextDark">
                  {postContent.playlist.user.userName ? postContent.playlist.user.userName : "Unknown User"}
                </h2>
              </div>
            </div>
            {/* Song Playlist */}
            {songPlaylist &&
              <div className="grid grid-cols-3 gap-x-10 gap-y-4">
                {songPlaylist.slice(0, 6).map((song, index) => (
                  <div key={index} className="flex flex-row items-center justify-center gap-1 cursor-pointer" onClick={() => NavigateSong(song.id)}>
                    <img className="rounded-md max-w-8 max-h-8 w-fit h-fit" src={song.poster ? song.poster : Base_AVA} alt="Cover Art Song" />
                    <div>
                      <div className="text-sm font-bold text-primary dark:text-primaryDarkmode">{song.songName}</div>
                      <div className="text-xs text-primaryText2 dark:text-primaryTextDark2">{showArtistV2(song.artists)}</div></div>
                  </div>
                ))}
              </div>
            }
          </div>
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
        id={`songOption_${postContent.id}`}
        postId={postContent.id}
        postContent={postContent}
        owned={postContent.author.id === userId}
      ></OptionPostItem>
    </div>
  );
};

PostItem.propTypes = {
  postContent: PropTypes.object.isRequired,
};

export default PostItem;
