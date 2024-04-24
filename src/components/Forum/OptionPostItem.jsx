import PropTypes from 'prop-types';
import { Item, Menu } from 'react-contexify';
import { useForumUtils } from '../../utils/useChatUtils';
import { useDispatch } from 'react-redux';
import { setRefreshPost } from '../../redux/slice/social';

const OptionPostItem = ({ id, postId, owned, refreshPlaylist }) => {
    const { deletePost } = useForumUtils();
    const dispatch = useDispatch();
    const handleDeletePost = async (postId) => {
        await deletePost(postId).then(() => {
            dispatch(setRefreshPost(true));
        });
    };
    console.log("OptionPostItem", id);
    return (
        <Menu id={id}>
            <Item onClick={refreshPlaylist}>Refresh</Item>
            <Item>Update Post</Item>
            <Item onClick={() => handleDeletePost(postId)}>Delete Post</Item>
        </Menu>
    );
};

OptionPostItem.propTypes = {
    id: PropTypes.string.isRequired,
    refreshPlaylist: PropTypes.func.isRequired,
    postId: PropTypes.number.isRequired,
    owned: PropTypes.bool.isRequired,
};

export default OptionPostItem;