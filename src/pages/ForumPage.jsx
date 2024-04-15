import { Modal } from "antd";
import CreatePost from "../components/Forum/CreatePost";
import PostSection from "../components/Forum/PostSection";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import SongChart from "../components/HomePage/SongChart";
import { useForumUtils } from "../utils/useChatUtils";
import useConfig from "../utils/useConfig";

const ForumPage = () => {
  const { getAllPost } = useForumUtils();
  const [listPost, setListPost] = useState();
  const [openModal, setOpenModal] = useState(false);
  const { isMobile } = useConfig();


  const handleGetAllPost = async () => {
    await getAllPost().then((res) => {
      console.log("GetAllPost", res);
      setListPost(res);
    });
  };
  useEffect(() => {
    handleGetAllPost();
  }, []);

  return (
    <div className="h-auto min-h-screen text-[#59c26d] bg-[#ecf2fd] pt-5 pb-40 px-2">
      {/* Desktop  */}
      {!isMobile &&
        <div className="flex flex-row">
          <div className="flex-1 py-3">
            <div className="mb-2 text-4xl font-bold">Forum</div>
            <div className="text-xl font-bold">Welcome to the Forum!</div>
            <button
              className="px-4 py-2 mt-5 font-bold text-white transition duration-200 ease-in-out rounded-lg bg-primary hover:bg-primaryHoverOn"
              onClick={() => setOpenModal(true)}
            >
              Create a Post
            </button>
            <PostSection postList={listPost?.postList}></PostSection>
          </div>
          <SongChart inForum={true}></SongChart>
        </div>
      }

      {/* Mobile  */}
      {isMobile &&
        <div className="flex flex-col">
          <div className="p-2">
            <div className="mb-2 text-4xl font-bold">Forum</div>
            <div className="text-xl font-bold">Welcome to the Forum!</div>
            <button
              className="px-4 py-2 mt-5 font-bold text-white transition duration-200 ease-in-out rounded-lg bg-primary hover:bg-primaryHoverOn"
              onClick={() => setOpenModal(true)}
            >
              Create a Post
            </button>
            <PostSection postList={listPost?.postList}></PostSection>
          </div>
          <SongChart></SongChart>
        </div>
      }

      {/* Post Option  */}
      <Modal
        title="Create a Post"
        open={openModal}
        onCancel={() => {
          setOpenModal(false);
        }}
        footer={null}
      >
        <CreatePost />
      </Modal>
    </div>
  );
};

ForumPage.propTypes = {
  postList: PropTypes.array.isRequired,
};

export default ForumPage;
