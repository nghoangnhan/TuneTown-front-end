import { Modal } from "antd";
import CreatePost from "../../components/Forum/CreatePost";
import PostSection from "../../components/Forum/PostSection";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import SongChart from "../../components/HomePage/SongChart";
import ArtistChart from "../../components/HomePage/ArtistChart";
import { useForumUtils } from "../../utils/useChatUtils";
import useConfig from "../../utils/useConfig";
import { useDispatch, useSelector } from "react-redux";
import { setRefreshPost } from "../../redux/slice/social";
import { useTranslation } from "react-i18next";

const ForumPage = () => {
  const { getAllPost } = useForumUtils();
  const [postList, setPostList] = useState({ postList: [] });
  const [totalPage, setTotalPage] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [openModal, setOpenModal] = useState(false);
  // const [postDetail, setPostDetail] = useState();
  const [postPage, setPostPage] = useState(1);
  const { isMobile } = useConfig();
  const dispatch = useDispatch();
  const refreshPost = useSelector((state) => state.social.refreshPost);
  const { t } = useTranslation();

  const handleGetAllPost = async () => {
    await getAllPost(postPage).then((res) => {
      setCurrentPage(res.currentPage);
      setTotalPage(res.totalPages);
      dispatch(setRefreshPost(false));
      if (res.currentPage > 1 && currentPage < totalPage) {
        setPostList((prevPostList) => ({
          postList: [...prevPostList.postList, ...res.postList],
        }));
      } else if (res.currentPage === 1) {
        setPostList(res);
      }
    });
  };

  useEffect(() => {
    handleGetAllPost();
  }, [refreshPost, postPage]);

  if (!postList) return null;
  return (
    <div className="h-auto min-h-screen px-2 pt-5 pb-40 text-primary dark:text-primaryDarkmode bg-backgroundPrimary dark:bg-backgroundDarkPrimary">
      {/* Desktop  */}
      {!isMobile && (
        <div className="flex flex-row">
          <div className="flex-1 px-2 py-3">
            {/* <div className="mb-2 text-4xl font-bold">Forum</div>
            <div className="text-xl font-bold">Welcome to the Forum!</div> */}
            <button
              className="px-4 py-2 mt-5 font-bold text-white transition duration-200 ease-in-out rounded-lg bg-primary hover:bg-primaryHoverOn"
              onClick={() => setOpenModal(true)}
            >
              {t("forum.createAPost")}
            </button>
            <PostSection isForum={true} postList={postList?.postList}></PostSection>
            {postList.currentPage < postList.totalPages && <div className="flex justify-center w-full">
              <button onClick={
                () => {
                  setPostPage(postPage + 1);
                }} className="px-2 py-2 my-5 border rounded-md hover:opacity-70 border-primary dark:border-primaryDarkmode text-primary dark:text-primaryDarkmode">
                Load More
              </button>
            </div>}
          </div>
          <div className="mt-[60px]">
            <SongChart inForum={true}></SongChart>
            <ArtistChart></ArtistChart>
          </div>
          {/* <PlaylistSection playlistTitle={"Maybe You Want!"}></PlaylistSection> */}
        </div>
      )}

      {/* Mobile  */}
      {isMobile && (
        <div className="flex flex-col">
          <div className="p-2">
            {/* <div className="mb-2 text-4xl font-bold">Forum</div>
            <div className="text-xl font-bold">Welcome to the Forum!</div> */}
            <button
              className="px-4 py-2 mt-5 font-bold text-white transition duration-200 ease-in-out rounded-lg bg-primary hover:bg-primaryHoverOn"
              onClick={() => setOpenModal(true)}
            >
              {t("forum.createAPost")}
            </button>
            <PostSection isForum={true} postList={postList?.postList}></PostSection>
            {currentPage < totalPage && <div className="flex justify-center w-full">
              <button onClick={
                () => {
                  setPostPage(postPage + 1);
                  handleGetAllPost();
                }} className="px-2 py-2 my-5 border rounded-md hover:opacity-70 border-primary dark:border-primaryDarkmode text-primary dark:text-primaryDarkmode">
                Load More
              </button>
            </div>}
          </div>
          <SongChart></SongChart>
          <ArtistChart></ArtistChart>
        </div>
      )}

      {/* Post Option  */}
      <Modal
        title="Share your thoughts!"
        open={openModal}
        centered
        onCancel={() => {
          setOpenModal(false);
        }}
        className="modalStyle"
        footer={null}
      >
        <CreatePost setOpenModalCreate={setOpenModal} />
      </Modal>
    </div>
  );
};

ForumPage.propTypes = {
  postList: PropTypes.array,
};

export default ForumPage;
