import PropTypes from 'prop-types';
import { Item, Menu } from 'react-contexify';
import { useForumUtils } from '../../utils/useChatUtils';
import { useDispatch } from 'react-redux';
import { setRefreshPost } from '../../redux/slice/social';
import { Modal, message } from 'antd';
import { useState } from 'react';
import UpdatePost from './UpdatePost';

const OptionPostItem = ({ id, postId, owned, postContent }) => {
    const { deletePost } = useForumUtils();
    const dispatch = useDispatch();

    const [openModalUpdate, setOpenModalUpdate] = useState(false);
    console.log(postContent)
    const onCancel = () => {
        setOpenModalUpdate(false);
    };
    const handleDeletePost = async (postId) => {
        if (!owned) {
            message.error("You are not authorized to delete this post")
            return
        }
        if (!window.confirm("Are you sure you want to delete this post?")) {
            return;
        }
        await deletePost(postId).then(() => {
            dispatch(setRefreshPost(true));
        });
    };

    const handleOpenModalUpdate = () => {
        if (!owned) {
            message.error("You are not authorized to update this post")
            return
        }
        setOpenModalUpdate(true);
    }
    return (
        <div>
            <Menu id={id} className='contexify-menu'>
                <Item onClick={() => dispatch(setRefreshPost(true))}>Refresh</Item>
                {owned == true && <Item onClick={() => handleOpenModalUpdate()}>Update Post</Item>}
                {owned == true && <Item onClick={() => handleDeletePost(postId)}>Delete Post</Item>}
            </Menu>
            <Modal open={openModalUpdate} onCancel={onCancel}
                footer={null} title="Update Post">
                <UpdatePost postContent={postContent}
                    setOpenModalUpdate={setOpenModalUpdate}
                ></UpdatePost>
            </Modal>
        </div>
    );
};

OptionPostItem.propTypes = {
    id: PropTypes.string.isRequired,
    postId: PropTypes.number.isRequired,
    owned: PropTypes.bool.isRequired,
    postContent: PropTypes.object.isRequired
};

export default OptionPostItem;