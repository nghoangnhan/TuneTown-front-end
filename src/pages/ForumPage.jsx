import { Modal } from "antd";
import CreatePost from "../components/Forum/CreatePost";
import PostSection from "../components/Forum/PostSection";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import SongChart from "../components/HomePage/SongChart";
import { useForumUtils } from "../utils/useChatUtils";

const ForumPage = () => {
  const { getAllPost } = useForumUtils();
  const [listPost, setListPost] = useState();
  const [openModal, setOpenModal] = useState(false);
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
    <div className="h-auto min-h-screen text-[#59c26d] bg-[#ecf2fd] pt-5 pb-24 px-1">
      <div className="flex flex-row">
        <div className="flex-1 p-5">
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
        <div className="">
          <SongChart></SongChart>
        </div>
      </div>
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