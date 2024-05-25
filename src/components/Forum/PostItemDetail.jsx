import { useNavigate, useParams } from "react-router-dom";
import { useForumUtils } from "../../utils/useChatUtils";
import { useEffect, useRef, useState } from "react";
import PostItemComment from "./PostItemComment";
import { useDispatch, useSelector } from "react-redux";
import { setIsReply } from "../../redux/slice/social.js";
import useIconUtils from "../../utils/useIconUtils.jsx";
import AudioWaveSurfer from "./AudioWaveSurfer.jsx";
import useConfig from "../../utils/useConfig";
import { useMusicAPIUtils } from "../../utils/useMusicAPIUtils";
import { useSongUtils } from "../../utils/useSongUtils";
import OptionPostItem from "./OptionPostItem.jsx";
import { useContextMenu } from "react-contexify";


const PostItemDetail = () => {
  const { postId } = useParams();
  const { getPostById, createComment, createReply, scrollToBottom, likePost, handleCheckLiked, handleSharePost } = useForumUtils();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { show } = useContextMenu();
  const { BackButton, ThumbsUpSolid, VerifyAccount, OptionsIcon, SendIcon } = useIconUtils();
  const { Base_AVA } = useConfig();
  const userId = localStorage.getItem("userId");
  const commentRef = useRef(null);
  const windownEndRef = useRef(null);
  const [refresh, setRefresh] = useState(false);
  const [postContent, setPostContent] = useState();
  const [liked, setLiked] = useState();
  const isReplying = useSelector((state) => state.social.isReplying);
  const replyCommentId = useSelector((state) => state.social.replyComment.replyCommentId);
  const replyComment = useSelector((state) => state.social.replyComment)
  const [songPlaylist, setSongPlaylist] = useState(null);
  const { getListSongPlaylist } = useMusicAPIUtils();
  const { showArtistV2, NavigateSong } = useSongUtils();

  const countTime = new Date(
    postContent?.postTime || Date.now()
  ).toLocaleString();

  const handGetPostById = async () => {
    await getPostById(postId).then((res) => {
      setPostContent(res);
    });
  };

  const handleCreateComment = async () => {
    if (commentRef.current.value === "") return;
    if (isReplying == false) {
      const comment = {
        postId: parseInt(postId),
        author: userId,
        content: commentRef.current.value,
      };
      console.log("Create Comment", comment);
      await createComment(comment).then((res) => {
        setRefresh(true);
        console.log("Create Comment", res);
        commentRef.current.value = "";
        scrollToBottom(windownEndRef);
      });
    } else if (isReplying == true) {
      const reply = {
        author: userId,
        content: commentRef.current.value,
        postId: parseInt(postId),
        commentId: replyCommentId,
      };
      console.log("Create Reply", reply);
      await createReply(reply).then((res) => {
        setRefresh(true);
        console.log("Create Reply", res);
        commentRef.current.value = "";
      });
    }
  };

  const handleLikePost = async () => {
    await likePost({ userId: userId, postId: postContent.id }).then(() => {
      setRefresh(true);
    });
  };

  useEffect(() => {
    handGetPostById();
  }, [postId]);

  useEffect(() => {
    if (handleCheckLiked(postContent?.likes)) {
      setLiked(true);
    } else {
      setLiked(false);
    }
  }, [postContent?.likes, likePost]);

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

  function displayMenu(e, postId) {
    e.preventDefault();
    show({
      position: { x: e.clientX, y: e.clientY },
      event: e,
      id: `postOption_${postId}`,
    });
  }

  console.log("PostItemDetail PostContent ", postContent)
  useEffect(() => {
    if (postContent && postContent.playlist) {
      getSongFromPlaylist(postContent.playlist.id)
        .then(song => {
          setSongPlaylist(song)
        })
        .catch(error => console.error("Error:", error));
    }
  }, [postContent]);

  if (!postContent) return null;

  return (
    <div className="h-auto min-h-screen px-1 pt-5 pb-24 text-headingText dark:text-headingTextDark bg-backgroundPrimary dark:bg-backgroundDarkPrimary">
      <div className="px-5 py-2">
        <div className="mb-2">
          <BackButton ></BackButton>
        </div>
        <div className="mb-2 text-4xl font-bold">Post Detail</div>
      </div>
      <div className="px-3 py-3 m-auto mt-4 shadow-md bg-backgroundComponentPrimary dark:bg-backgroundComponentDarkPrimary font-montserrat rounded-2xl max-xl:w-fit xl:h-fit xl:mx-5 xl:mt-8 xl:py-5 xl:px-5 ">
        <div className="flex flex-row items-start justify-between mb-4">
          <div className="flex flex-col ">
            <div className="flex flex-row items-center gap-1 text-xl font-bold">
              {postContent.author.userName}
              {postContent.author.role == "ARTIST" && (
                <VerifyAccount></VerifyAccount>
              )}
            </div>
            <div className="text-xs font-medium text-primaryText2 dark:text-primaryTextDark2">{countTime}</div>
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

        {/* Post Content */}
        <div className="mb-10 text-md">{postContent?.content}</div>

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
          <div className="flex flex-row items-center gap-2 mt-2 justify-evenly">
            {/* PlaylistInfo  */}
            <div className="flex flex-row items-center justify-center gap-1 cursor-pointer" onClick={() => navigate(`/detail-playlist/${postContent.playlist.id}`)}>
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
              <div className="grid grid-cols-3 gap-x-10 gap-y-8">
                {songPlaylist.slice(0, 6).map((song, index) => (
                  <div key={index} className="flex flex-row items-center justify-center gap-1 cursor-pointer" onClick={() => NavigateSong(song.id)}>
                    <img className="w-8 h-8 rounded-md max-w-8 max-h-8" src={song.poster ? song.poster : Base_AVA} alt="Cover Art Song" />
                    <div>
                      <div className="text-sm font-bold text-primary dark:text-primaryDarkmode">{song.songName}</div>
                      <div className="text-xs text-primaryText2 dark:text-primaryTextDark2">{showArtistV2(song.artists)}</div></div>
                  </div>
                ))}
              </div>
            }
          </div>
        )}
        {/* Control Reaction */}
        <div className="flex flex-row items-center justify-center gap-5 mt-2 font-bold text-primary dark:text-primaryDarkmode">
          {/* Like  */}
          <button className="flex flex-row items-center gap-2 mx-2 mt-2 font-bold text-md opacity-80"
            onClick={handleLikePost}>
            <div className="text-primary dark:text-primaryDarkmode">
              <ThumbsUpSolid liked={liked}></ThumbsUpSolid>
            </div>
            <span>{postContent.likes.length}</span>
          </button>
          {/* Share  */}
          <button className="mx-2 mt-2 font-bold text-md opacity-80" onClick={() => {
            handleSharePost(postContent)
          }}>
            Share
          </button>
        </div>
      </div>
      <span className="block py-2 font-bold text-center border-b-2 border-primary opacity-10"></span>

      {/* Comment section */}
      <div className="mt-5">
        {/* Post Comment */}
        <PostItemComment postContent={postContent}></PostItemComment>

        {/* Input Comment */}
        <div className="flex flex-row items-center justify-center gap-2 px-4 mt-5">
          <input
            ref={commentRef}
            onKeyDown={(e) => e.key === "Enter" && handleCreateComment()}
            type="text"
            placeholder={"Write a comment"}
            defaultValue={isReplying ? `@${replyComment.userName} ` : ''}
            className="w-full p-2 border-2 input:border-[#52aa61] text-primaryText2  rounded-lg"
          />
          {isReplying && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24"
              viewBox="0 -960 960 960"
              width="24"
              className="cursor-pointer fill-primaryText2 dark:fill-primaryTextDark2"
              onClick={() => {
                dispatch(setIsReply(false));
              }}
            >
              <path d="m336-280 144-144 144 144 56-56-144-144 144-144-56-56-144 144-144-144-56 56 144 144-144 144 56 56ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
            </svg>
          )}
          <button
            className="px-4 py-2 font-bold text-white rounded-lg bg-primary hover:bg-primaryHoverOn"
            onClick={handleCreateComment}
          >
            <SendIcon></SendIcon>
          </button>
        </div>
        <div ref={windownEndRef}></div>
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

export default PostItemDetail;
