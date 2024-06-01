import PropTypes from "prop-types";
import PostItem from "./PostItem";
import LazyLoad from "react-lazyload";
import Loading from "../Loading";
const PostSection = ({ postList }) => {
  if (!postList) return null;
  return (
    <div className="flex flex-col xl:flex-row">
      <div className="flex-1">
        {postList && postList?.map((post, index) => (
          <LazyLoad key={index} height={10} once={true}
            placeholder={<Loading />}>
            <PostItem key={index} postContent={post}></PostItem>
          </LazyLoad>
        ))}
      </div>
    </div>
  );
};

PostSection.propTypes = {
  postList: PropTypes.array.isRequired,
};

export default PostSection;
