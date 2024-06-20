import { Input, Modal } from "antd";
import { useState } from "react";
import PropTypes from "prop-types";
import useConfig from "../../../utils/useConfig";
import axios from "axios";
import { useTranslation } from "react-i18next";

const ModalChoseSong = ({ openModal, setOpenModalChoseSong, handleSongItemClick }) => {
    const { Base_AVA, Base_URL, auth } = useConfig();
    const [songList, setSongList] = useState();
    const { t } = useTranslation();
    const searchSongAPI = async (searchValue) => {
        try {
            const response = await axios.post(`${Base_URL}/songs/findSong?name=${searchValue}`, {}, {
                headers: {
                    Authorization: `Bearer ${auth.access_token}`,
                },
            });
            // console.log("SearchSong Response", response.data);
            return response.data;
        } catch (error) {
            console.log("Error:", error);
        }
    }

    const handleSearchSong = (searchValue) => {
        searchSongAPI(searchValue).then((res) => {
            // console.log("SearchSong", res);
            setSongList(res);
        });
    };

    if (!openModal) return null;
    return (
        <Modal
            title={t("modal.chooseaSong")}
            open={openModal}
            onCancel={() => {
                setOpenModalChoseSong(false);
            }}
            footer={null}
            centered
            className='modalStyle'
        >
            <Input type='text'
                placeholder={t("modal.search")}
                className="bg-white dark:bg-backgroundDarkPrimary dark:text-white max-h-40"
                onChange={(e) => { handleSearchSong(e.target.value) }}
            />
            {songList && (
                <div className="left-0 right-0 w-full overflow-auto max-h-96 bg-backgroundComponentPrimary dark:bg-backgroundComponentDarkPrimary">
                    <ul className="px-4 py-2">
                        {songList.map((song) => (
                            <li
                                key={song.id}
                                className="flex items-center p-2 space-x-2 rounded-md cursor-pointer bg-backgroundComponentPrimary hover:bg-backgroundPlaylistHover dark:bg-backgroundPlaylistDark dark:text-primaryTextDark2 hover:dark:bg-backgroundPlaylistHoverDark text-primaryText2 "
                                onClick={() => {
                                    handleSongItemClick(song)
                                }}
                            >
                                <img
                                    src={`${song.poster ? song.poster : Base_AVA}`}
                                    alt="Cover Art"
                                    className="w-8 h-8 rounded-full"
                                />
                                <span>{song.songName} #{song.id}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

        </Modal>
    );
};

ModalChoseSong.propTypes = {
    openModal: PropTypes.bool,
    setOpenModalChoseSong: PropTypes.func,
    handleSongItemClick: PropTypes.func,
    songList: PropTypes.array,
};

export default ModalChoseSong;