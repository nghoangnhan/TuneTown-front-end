import PropTypes from "prop-types";
import PostItem from "./PostItem";
const PostSection = ({ postList }) => {
  console.log("PostSection", postList);
  if (!postList) return null;
  return (
    <div className="flex flex-col xl:flex-row">
      <div className="flex-1">
        {postList?.map((post) => (
          <PostItem key={post.id} postContent={post}></PostItem>
        ))}
      </div>
    </div>
  );
};

PostSection.propTypes = {
  postList: PropTypes.array.isRequired,
};

export default PostSection;
