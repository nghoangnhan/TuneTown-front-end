import PropTypes from 'prop-types';
import { Item, Menu, useContextMenu } from 'react-contexify';
import useConfig from '../../utils/useConfig';
import { setChatChosen } from '../../redux/slice/social';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import useChatUtils from '../../utils/useChatUtils';

// eslint-disable-next-line no-unused-vars
const ListChatSection = ({ chatList, converChosen, chatListRaw }) => {
    const { Base_AVA } = useConfig();
    const navigate = useNavigate();
    const { show } = useContextMenu();
    const dispatch = useDispatch();
    const { AcronymName } = useChatUtils();
    const userId = parseInt(localStorage.getItem("userId"), 10);

    // Handle chat chosen
    const handleChatChosen = async (conver) => {
        console.log("ChatNavigate handleChatChosen", conver);
        dispatch(setChatChosen(conver));
        if (!conver.communityId || conver.communityId === null) {
            // Private message
            navigate(`/chat/${conver.chatId}`);
        }
        else {
            // Artist community
            navigate(`/chat/community/${conver.communityId}`);
        }
    };

    const displayMenu = (e, converId) => {
        e.preventDefault();
        show({
            position: { x: e.clientX, y: e.clientY },
            event: e,
            id: `converOption_${converId}`,
        });
    }

    return (
        <div className="flex flex-col justify-center gap-2 mt-5">
            {chatList.map((conver) => (
                <div
                    onContextMenu={(e) => displayMenu(e, conver.chatId)}
                    key={conver.chatId}
                    className={`${converChosen.chatId == conver.chatId ? "bg-slate-200 dark:bg-backgroundChattingHoverDark" : ""
                        } flex flex-row items-center  dark:bg-backgroundPlaylistDark hover:opacity-60 gap-3 p-2 cursor-pointer w-full rounded-sm`}
                    onClick={() => {
                        handleChatChosen(conver);
                    }}
                >

                    <Menu id={`converOption_${conver.chatId}`} className='contexify-menu'>
                        <Item
                            onClick={() => {
                                console.log("Delete conversation");
                            }}
                        >
                            Delete Conversation
                        </Item>
                    </Menu>

                    <div className="w-14">
                        <img
                            src={conver.avatar ? conver.avatar : Base_AVA}
                            alt="user"
                            className="bg-white rounded-full"
                        />
                    </div>
                    <div className="w-3/4 text-primaryText2 dark:text-primaryTextDark2">
                        <h3 className="text-base font-bold">{AcronymName(conver.userName, 17)}</h3>
                        <p className={`text-sm ${conver.seen === 0 && conver.sendId !== userId ? "font-bold" : "font-thin"}`}>
                            {AcronymName(conver.message, 22)}
                        </p>
                    </div>
                    <div className="flex justify-center text-primaryText2 dark:text-primaryTextDark2">
                        <p className={`text-sm w-16 ${conver.seen === 0 && conver.sendId !== userId ? "font-bold" : ""} `}>
                            {conver.time}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
};

ListChatSection.propTypes = {
    chatList: PropTypes.array,
    converChosen: PropTypes.object,
    chatListRaw: PropTypes.array,
};

export default ListChatSection;