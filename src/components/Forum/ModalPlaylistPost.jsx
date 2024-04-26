import PropTypes from 'prop-types';
import { Input, Modal } from 'antd';
import useConfig from '../../utils/useConfig';
import { useEffect, useState } from 'react';

const ModalPlaylistPost = ({ playlistRs, openModal, setOpenModalChosePlaylist, handlePlaylistItemClick }) => {
    const { Base_AVA } = useConfig();
    const [playlistOutput, setPlaylistOutput] = useState(playlistRs);
    const handleSearchPlaylist = (searchValue) => {
        setTimeout(() => {
            const searchResult = playlistRs.filter((playlist) => playlist.playlistName.toLowerCase().includes(searchValue.toLowerCase()));
            setPlaylistOutput(searchResult);
        }, 500);
    };

    useEffect(() => {
        setPlaylistOutput(playlistRs);
    }, [playlistRs]);
    return (
        <Modal
            title="Choose a playlist"
            open={openModal}
            onCancel={() => {
                setOpenModalChosePlaylist(false);
            }}
            footer={null}
        >
            {playlistRs && (
                <div className="left-0 right-0 w-full bg-white">
                    <ul className="px-4 py-2">
                        <Input type='text'
                            placeholder="Search playlist"
                            className="w-full p-2 mb-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200"
                            onChange={(e) => { handleSearchPlaylist(e.target.value) }}
                        />
                        {playlistOutput != null && playlistOutput.map((playlist) => (
                            <li
                                key={playlist.id}
                                className="flex items-center p-2 space-x-2 rounded-md cursor-pointer hover:bg-blue-100"
                                onClick={() => {
                                    handlePlaylistItemClick(playlist)
                                }}
                            >
                                <img
                                    src={`${playlist.coverArt ? playlist.coverArt : Base_AVA}`}
                                    alt="Cover Art"
                                    className="w-8 h-8 rounded-full"
                                />
                                <span>{playlist.playlistName} #{playlist.id}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </Modal>
    );
};

ModalPlaylistPost.propTypes = {
    playlistRs: PropTypes.array.isRequired,
    openModal: PropTypes.bool.isRequired,
    setOpenModalChosePlaylist: PropTypes.func.isRequired,
    handlePlaylistItemClick: PropTypes.func.isRequired,
};

export default ModalPlaylistPost;