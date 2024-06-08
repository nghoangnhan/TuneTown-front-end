import { Modal } from 'antd';
import useConfig from '../../utils/useConfig';
import PropTypes from 'prop-types';
import useIconUtils from '../../utils/useIconUtils';

const ModalEditMember = ({ openEditMember, setOpenEditMember, converChosen, handleDeleteMember }) => {
    const { Base_AVA } = useConfig();
    // console.log(converChosen);
    const { BanIcon } = useIconUtils();
    return (
        <Modal open={openEditMember} onCancel={() => setOpenEditMember(false)}
            footer={null} className="rounded-md bg-backgroundPlaylist dark:bg-backgroundPlaylistDark modalStyle" centered>
            <div className="flex flex-col items-center justify-center gap-3 p-5 bg-backgroundPlaylist dark:bg-backgroundPlaylistDark">
                <h2 className="text-2xl font-bold text-primary dark:text-primaryDarkmode">Members</h2>
                <div className="w-full overflow-auto h-96">
                    {converChosen?.joinUsers && converChosen.joinUsers.map((item) => (
                        item.id !== converChosen.userId && item.role !== "ARTIST" &&
                        <div className="flex flex-row items-center justify-between gap-2 rounded-md text-primaryText2 dark:text-primaryTextDark2 bg-backgroundComponentPrimary dark:bg-backgroundComponentDarkPrimary" key={item.id} >
                            <img src={item.avatar ? item.avatar : Base_AVA} className="rounded-full max-h-9 dark:bg-white" alt="" />
                            <h2 className="p-2 text-primaryText2 dark:text-primaryTextDark2">{item.userName}</h2>
                            <h2 className="p-2 text-primaryText2 dark:text-primaryTextDark2">{item.role}</h2>
                            <h2 className="flex gap-2 p-2">
                                <button className="w-20 px-2 py-1 border rounded-md border-primary dark:text-primaryDarkmode dark:border-primaryDarkmode text-primary hover:opacity-70"
                                    onClick={() => {
                                        handleDeleteMember(item.id, converChosen.chatId).then(() => setOpenEditMember(false)).catch((err) => console.log(err))
                                    }}>
                                    <BanIcon></BanIcon>
                                </button>
                            </h2>
                        </div>)
                    )}
                </div>
            </div>
        </Modal>
    );
};

ModalEditMember.propTypes = {
    openEditMember: PropTypes.bool,
    setOpenEditMember: PropTypes.func,
    converChosen: PropTypes.object,
    handleDeleteMember: PropTypes.func
};

export default ModalEditMember;