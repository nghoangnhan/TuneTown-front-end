import PropTypes from 'prop-types';
import { Item, Menu } from 'react-contexify';

const OptionPostItem = ({ id, refreshPlaylist }) => {
    return (
        <Menu id={id}>
            <Item onClick={refreshPlaylist}>Refresh</Item>
            <Item>Update Post</Item>
            <Item>Delete Post</Item>
        </Menu>
    );
};

OptionPostItem.propTypes = {
    id: PropTypes.string.isRequired,
    refreshPlaylist: PropTypes.func.isRequired,
};

export default OptionPostItem;