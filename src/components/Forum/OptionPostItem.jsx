import PropTypes from "prop-types";
import { Item, Menu } from "react-contexify";
import { useForumUtils } from "../../utils/useChatUtils";
import { useDispatch } from "react-redux";
import { setRefreshPost } from "../../redux/slice/social";
import { Modal, message } from "antd";
import { useState } from "react";
import UpdatePost from "./UpdatePost";
import { useTranslation } from "react-i18next";

const OptionPostItem = ({ id, postId, postContent }) => {
  const { deletePost } = useForumUtils();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const userId = localStorage.getItem("userId");
  const [openModalUpdate, setOpenModalUpdate] = useState(false);
  // console.log(postContent);
  const onCancel = () => {
    setOpenModalUpdate(false);
  };
  const handleDeletePost = async (postId) => {
    if (postContent.author.id != userId) {
      message.error("You are not authorized to delete this post");
      return;
    }
    if (!window.confirm("Are you sure you want to delete this post?")) {
      return;
    }
    await deletePost(postId).then(() => {
      dispatch(setRefreshPost(true));
    });
  };

  const handleOpenModalUpdate = () => {
    if (postContent.author.id != userId) {
      message.error("You are not authorized to update this post");
      return;
    }
    setOpenModalUpdate(true);
  };
  return (
    <div>
      <Menu id={id} className="contexify-menu">
        <Item onClick={() => dispatch(setRefreshPost(true))}>
          {t("forum.refresh")}
        </Item>
        {postContent.author.id == userId && (
          <Item onClick={() => handleOpenModalUpdate()}>
            {t("forum.updatePost")}
          </Item>
        )}
        {postContent.author.id == userId && (
          <Item onClick={() => handleDeletePost(postId)}>
            {t("forum.deletePost")}
          </Item>
        )}
      </Menu>
      <Modal
        open={openModalUpdate}
        onCancel={onCancel}
        footer={null}
        centered
        title="Update Post"
        className="modalStyle"
      >
        <UpdatePost
          postContent={postContent}
          setOpenModalUpdate={setOpenModalUpdate}
        ></UpdatePost>
      </Modal>
    </div>
  );
};

OptionPostItem.propTypes = {
  id: PropTypes.string.isRequired,
  postId: PropTypes.number.isRequired,
  postContent: PropTypes.object.isRequired,
};

export default OptionPostItem;
