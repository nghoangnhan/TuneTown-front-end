import { useParams } from "react-router-dom";
import { useForumUtils } from "../../utils/useChatUtils";
import { useEffect, useRef, useState } from "react";
import PostItemComment from "./PostItemComment";
import { useDispatch, useSelector } from "react-redux";
import { setIsReply } from "../../redux/slice/social.js";
import useIconUtils from "../../utils/useIconUtils.jsx";
import AudioWaveSurfer from "./AudioWaveSurfer.jsx";

const PostItemDetail = () => {
  const { postId } = useParams();
  const { getPostById, createComment, createReply, scrollToBottom, likePost, handleCheckLiked, handleSharePost } = useForumUtils();
  const dispatch = useDispatch();
  const userId = parseInt(localStorage.getItem("userId"));
  const commentRef = useRef(null);
  const windownEndRef = useRef(null);
  const [refresh, setRefresh] = useState(false);
  const [postContent, setPostContent] = useState();
  const [liked, setLiked] = useState();
  const { BackButton, ThumbsUpSolid, VerifyAccount } = useIconUtils();
  const isReplying = useSelector((state) => state.social.isReplying);
  const replyCommentId = useSelector((state) => state.social.replyComment.replyCommentId);
  const replyComment = useSelector((state) => state.social.replyComment)

  const countTime = new Date(
    postContent?.postTime || Date.now()
  ).toLocaleString();

  const handGetPostById = async () => {
    await getPostById(postId).then((res) => {
      console.log("Get Post By ID", res);
      setPostContent(res);
    });
  };

  const handleCreateComment = async () => {
    if (commentRef.current.value === "") return;
    if (isReplying == false) {
      const comment = {
        postId: parseInt(postId),
        author: parseInt(userId),
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
        author: parseInt(userId),
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
    console.log("Liked", liked);
  }, [postContent?.likes, likePost]);

  useEffect(() => {
    if (refresh) handGetPostById();
    setRefresh(false);
  }, [refresh]);

  // useEffect(() => {
  //   scrollToBottom(windownEndRef);
  // }, [postContent]);

  if (!postContent) return null;

  return (
    <div className="h-auto min-h-screen px-1 pt-5 pb-24 text-headingText dark:text-headingTextDark bg-backgroundPrimary dark:bg-backgroundDarkPrimary">
      <div className="px-5 py-2">
        <div className="mb-2">
          <BackButton ></BackButton></div>
        <div className="mb-2 text-4xl font-bold">Post Detail</div>
      </div>
      <div className="pt-3 pb-3 pl-3 pr-3 m-auto mt-4 shadow-md bg-backgroundComponentPrimary dark:bg-backgroundComponentDarkPrimary font-montserrat rounded-2xl max-xl:w-fit xl:h-fit xl:ml-5 xl:mr-5 xl:mt-8 xl:pt-5 xl:pl-5 xl:pr-5 xl:pb-5">
        <div className="flex flex-row items-center gap-1 text-xl font-bold">
          {postContent.author.userName}
          {postContent.author.role == "ARTIST" && (
            <VerifyAccount></VerifyAccount>
          )}
        </div>
        <div className="text-xs font-medium text-primaryText2 dark:text-primaryTextDark2">{countTime}</div>

        {/* Post Content */}
        <div className="text-md">{postContent?.content}</div>
        <div className="text-primary">
          <AudioWaveSurfer song={postContent?.song?.songData}></AudioWaveSurfer>
        </div>
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
            handleSharePost(postContent.id, true)
          }}>
            Share
          </button>
        </div>

        <span className="block py-2 font-bold text-center border-b-2 border-primary opacity-10"></span>

        {/* Comment section */}
        <div className="mt-5">
          {/* Post Comment */}
          <PostItemComment postContent={postContent}></PostItemComment>

          {/* Input Comment */}
          <div className="flex flex-row items-center justify-center gap-2 mt-5">
            <input
              ref={commentRef}
              onKeyDown={(e) => e.key === "Enter" && handleCreateComment()}
              type="text"
              placeholder={"Write a comment"}
              defaultValue={isReplying ? `@${replyComment.userName} ` : ''}
              className="w-full p-2 border-2 input:border-[#52aa61] text-primaryText2 dark:text-primaryTextDark2 rounded-lg"
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
              Send
            </button>
          </div>
          <div ref={windownEndRef}></div>
        </div>
      </div>
    </div>
  );
};

export default PostItemDetail;
