import PropTypes from "prop-types";
import { setIsReply } from "../../redux/slice/social.js";
import { useDispatch } from "react-redux";
import { setReplyCommentId } from "../../redux/slice/social.js";

const PostItemComment = ({ postContent }) => {
  const dispatch = useDispatch();

  const handleReply = (comment) => {
    dispatch(setIsReply(true));
    dispatch(setReplyCommentId(comment.id));
  };

  // Component code here
  return (
    <div>
      {postContent != null &&
        postContent?.comments?.map((comment) => (
          <div key={comment.id} className="pl-5 mt-4">
            <div className="flex flex-col ">
              <div className="flex flex-col items-start justify-start gap-1 p-2 rounded-lg bg-slate-200 w-fit">
                <div className="text-base font-bold text-[#52aa61]">
                  {comment.author.userName}
                </div>
                <div className="text-sm rounded-lg ">{comment.content}</div>
              </div>
              <div className="flex flex-row justify-start items-center gap-1 text-[#52aa61]">
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
                  <div key={reply.id}>
                    <div className="flex flex-col">
                      <div className="flex flex-col items-start justify-start gap-1 p-2 rounded-lg bg-slate-200 w-fit">
                        <div className="text-base font-bold text-[#52aa61]">
                          {reply.author.userName}
                        </div>
                        <div className="text-sm rounded-lg ">
                          {reply.content}
                        </div>
                      </div>
                      <div className="flex flex-row justify-start items-center gap-1 text-[#52aa61]">
                        <button className="mx-2 mt-1 text-xs font-semibold opacity-80">
                          Like
                        </button>
                        <button className="mx-2 mt-1 text-xs font-semibold opacity-80">
                          Reply
                        </button>
                        <span className="mx-2 mt-1 text-xs font-semibold opacity-80">
                          {reply.commentDate.toLocaleString()?.split("T")[0]}
                        </span>
                      </div>
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
