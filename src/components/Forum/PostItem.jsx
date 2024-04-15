import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useContextMenu } from "react-contexify";
import { useNavigate } from "react-router-dom";
import { useForumUtils } from "../../utils/useChatUtils";
import useIconUtils from "../../utils/useIconUtils";
import AudioWaveSurfer from "./AudioWaveSurfer";
import OptionPostItem from "./OptionPostItem";

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
  const Post = {
    id: postContent.id,
    author: postContent.author,
    title: postContent.title,
    content: postContent.content,
    time: postContent.time,
    comments: postContent.comments,
    likes: postContent.likes,
    dislikes: postContent.dislikes,
  };
  console.log("PostItem", postContent);
  // Get the time of the post
  const countTime = new Date(Post?.postTime || Date.now()).toLocaleString();
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

  function displayMenu(e, songId) {
    e.preventDefault();
    show({
      position: { x: e.clientX, y: e.clientY },
      event: e,
      id: `songOption_${songId}`,
    });
  }

  const handlePostClick = () => {
    navigate(`/forum/${Post.id}`);
  };

  const handleLikePost = async () => {
    await likePost({ userId: userId, postId: Post?.id }).then(() => {
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

  return (
    <div className="bg-[#FFFFFFCC] font-montserrat shadow-md rounded-2xl max-xl:w-fit m-auto xl:h-fit xl:mr-5 xl:mt-8 mt-4 pt-3 xl:pt-5 pl-3 xl:pl-5 pr-3 xl:pr-5 pb-3 xl:pb-5">
      <div className="flex flex-col justify-center">
        <div className="flex flex-row items-start justify-between">
          <div className="flex flex-col">
            {/* Artist Name  */}
            <div className="flex flex-row items-center gap-1 text-xl font-bold">
              {Post.author.userName}
              {Post.author.role == "ARTIST" && (
                <VerifyAccount></VerifyAccount>
              )}
            </div>
            <div className="text-xs font-medium text-[#3d419783]">
              {countTime.toLocaleString()}
            </div>
            <div
              className="cursor-pointer mt-2 text-base text-[#3a3a3d]"
              onClick={handlePostClick}
            >
              {Post.content}
            </div>
          </div>
          {/* Post Option */}
          <div>
            <button
              className="top-2 right-2"
              onClick={(e) => displayMenu(e, Post.id)}
            >
              <OptionsIcon></OptionsIcon>
            </button>
          </div>
        </div>
        {/* Audio Wave */}
        <div className="w-full">
          <AudioWaveSurfer></AudioWaveSurfer>
        </div>
      </div>
      {/* Line section */}
      <span className="block py-2 my-1 font-bold text-center border-b-2 border-primary opacity-10"></span>

      {/* React Post  */}
      <div className="flex flex-row items-center justify-between gap-5 font-bold text-primary">
        {/* Like  */}
        <button className="flex flex-row items-center gap-2 mx-2 mt-2 font-bold text-md opacity-80"
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
        <button className="mx-2 mt-2 font-bold text-md opacity-80">
          Share
        </button>
        <button className="mx-2 mt-2 font-bold text-md opacity-80">
          Report
        </button>
      </div>
      {/* Context Menu */}
      <OptionPostItem
        id={`songOption_${Post.id}`}
        refreshPlaylist={refreshPlaylist}
      ></OptionPostItem>
    </div>
  );
};

PostItem.propTypes = {
  postContent: PropTypes.object.isRequired,
};

export default PostItem;
