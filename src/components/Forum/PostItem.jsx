import PropTypes from "prop-types";
import { useState } from "react";
import { Item, Menu, useContextMenu } from "react-contexify";
import { useNavigate } from "react-router-dom";
const PostItem = ({ postContent }) => {
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
  const navigate = useNavigate();
  const { show } = useContextMenu();
  const [refresh, setRefresh] = useState(false);
  const countTime = new Date(Post?.postTime || Date.now()).toLocaleString();

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

  return (
    <div className="bg-[#FFFFFFCC] font-montserrat shadow-md rounded-2xl max-xl:w-fit m-auto xl:h-fit xl:mr-5 xl:mt-8 mt-4 pt-3 xl:pt-5 pl-3 xl:pl-5 pr-3 xl:pr-5 pb-3 xl:pb-5">
      <div className="flex flex-row items-start justify-between">
        <div>
          <div className="flex flex-row items-center gap-1 text-xl font-bold">
            {Post.author.userName}
            {Post.author.role == "ARTIST" && (
              <span className="">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="18"
                  viewBox="0 -960 960 960"
                  width="18"
                  fill="#40cf62"
                >
                  <path d="m436-350 233-234-47-47-183 183-101-101-49 49 147 150Zm44.063 291Q331.105-96.81 234.552-230.909 138-365.007 138-522.837v-252.601L480-903l343 127.595v252.242q0 157.953-96.989 292.153Q629.021-96.81 480.063-59Z" />
                </svg>
              </span>
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24"
              viewBox="0 -960 960 960"
              width="24"
              fill="currentColor"
            >
              <path d="M480-160q-33 0-56.5-23.5T400-240q0-33 23.5-56.5T480-320q33 0 56.5 23.5T560-240q0 33-23.5 56.5T480-160Zm0-240q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm0-240q-33 0-56.5-23.5T400-720q0-33 23.5-56.5T480-800q33 0 56.5 23.5T560-720q0 33-23.5 56.5T480-640Z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Line section */}
      <span className="block py-2 my-1 font-bold text-center border-b-2 border-primary opacity-10"></span>

      {/* React Post  */}
      <div className="flex flex-row items-center justify-between gap-5 font-bold text-primary">
        <button className="flex flex-row items-center gap-2 mx-2 mt-2 font-bold text-md opacity-80">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24"
            viewBox="0 -960 960 960"
            width="24"
            fill="#40cf62"
          >
            <path d="M720-120H280v-520l280-280 50 50q7 7 11.5 19t4.5 23v14l-44 174h258q32 0 56 24t24 56v80q0 7-2 15t-4 15L794-168q-9 20-30 34t-44 14Zm-360-80h360l120-280v-80H480l54-220-174 174v406Zm0-406v406-406Zm-80-34v80H160v360h120v80H80v-520h200Z" />
          </svg>
          <span>{Post.likes.length}</span>
        </button>
        <button
          className="mx-2 mt-2 font-bold cursor-pointer text-md opacity-80"
          onClick={handlePostClick}
        >
          Reply
        </button>
        <button className="mx-2 mt-2 font-bold text-md opacity-80">
          Share
        </button>
        <button className="mx-2 mt-2 font-bold text-md opacity-80">
          Report
        </button>
      </div>
      {/* Context Menu */}
      <Menu id={`songOption_${Post.id}`}>
        <Item onClick={refreshPlaylist}>Refresh</Item>
        <Item>Update Post</Item>
        <Item>Delete Post</Item>
      </Menu>
    </div>
  );
};

PostItem.propTypes = {
  postContent: PropTypes.object.isRequired,
};

export default PostItem;
