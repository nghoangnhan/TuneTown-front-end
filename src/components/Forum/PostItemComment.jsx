import PropTypes from "prop-types";
import { setIsReply } from "../../redux/slice/social.js";
import { useDispatch } from "react-redux";
import { setReplyCommentId } from "../../redux/slice/social.js";
import { setReplyComment } from "../../redux/slice/social.js";
import { useForumUtils } from "../../utils/useChatUtils";

const PostItemComment = ({ postContent }) => {
  const dispatch = useDispatch();
  const { getCommentById } = useForumUtils();
  const handleGetCommentById = async (commentId) => {
    await getCommentById(commentId).then((res) => {
      console.log("Get comment by id: ", res);
      dispatch(setReplyComment(res));
    });
  };

  const handleReply = (comment) => {
    dispatch(setIsReply(true));
    dispatch(setReplyCommentId(comment.id));
    handleGetCommentById(comment.id);
  };

  // Component code here
  return (
    <div className="mx-4">
      {postContent?.comments != null &&
        postContent?.comments?.map((comment) => (
          <div key={comment.id} className="mx-3">
            <div className="flex flex-col ">

              <div className="flex flex-row gap-2">
                <img src={comment.author?.avatar} className="w-10 h-10 rounded-full" alt="" />
                <div className="flex flex-col items-start justify-start w-full gap-1 p-2 rounded-lg bg-backgroundPlaylist text-primaryText2 dark:text-primaryTextDark2 dark:bg-backgroundPlaylistHoverDark">
                  <div className="text-base font-bold text-primary dark:text-primaryDarkmode">
                    {comment.author.userName}
                  </div>
                  <div className="w-full p-1 text-sm break-words whitespace-normal rounded-md">
                    {comment.content}
                  </div>
                </div>
              </div>

              <div className="flex flex-row items-center justify-start gap-1 text-primary dark:text-primaryDarkmode">
                <button className="mx-2 mt-1 text-xs font-semibold opacity-80">
                  Like
                </button>
                <button
                  className="mx-2 mt-1 text-xs font-semibold opacity-80"
                  onClick={() => handleReply(comment)}
                >
                  Reply
                </button>
                <span className="mx-2 mt-1 text-xs font-semibold opacity-80">
                  {comment.commentDate.toLocaleString()?.split("T")[0]}
                </span>
              </div>

            </div>
            {/* Reply section */}
            <div className="pl-5 mt-4 space-y-2">
              {comment?.reply &&
                comment?.reply?.map((reply) => (
                  <div className="flex flex-col my-3" key={reply.id}>

                    <div className="flex flex-row gap-2">
                      <img src={reply.author?.avatar} className="w-10 h-10 rounded-full" alt="" />
                      <div className="flex flex-col items-start justify-start gap-1 p-2 rounded-lg bg-backgroundPlaylist text-primaryText2 dark:text-primaryTextDark2 dark:bg-backgroundPlaylistHoverDark w-fit">
                        <div className="text-base font-bold text-primary dark:text-primaryDarkmode">
                          {reply.author.userName}
                        </div>
                        <div className="text-sm rounded-lg ">
                          {reply.content}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-row items-center justify-start gap-1 text-primary dark:text-primaryDarkmode">
                      <button className="mx-2 mt-1 text-xs font-semibold opacity-80">
                        Like
                      </button>
                      <button
                        className="mx-2 mt-1 text-xs font-semibold opacity-80"
                        onClick={() => handleReply(reply)}
                      >
                        Reply
                      </button>
                      <span className="mx-2 mt-1 text-xs font-semibold opacity-80">
                        {reply.commentDate.toLocaleString()?.split("T")[0]}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
    </div>
  );
};
PostItemComment.propTypes = {
  postContent: PropTypes.object.isRequired,
};

export default PostItemComment;
