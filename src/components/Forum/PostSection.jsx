import PropTypes from "prop-types";
import PostItem from "./PostItem";
import LazyLoad from "react-lazyload";
import Loading from "../Loading";
const PostSection = ({ postList, isForum }) => {
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
        {
          isForum == true && postList?.length === 0 && (
            <div className="mt-20 text-3xl font-bold text-center text-primary dark:text-primaryDarkmode bg-backgroundPrimary dark:bg-backgroundDarkPrimary">
              Follow some users to see their posts here!
            </div>
          )
        }
      </div>
    </div>
  );
};

PostSection.propTypes = {
  postList: PropTypes.array.isRequired,
  isForum: PropTypes.bool,
};

export default PostSection;
