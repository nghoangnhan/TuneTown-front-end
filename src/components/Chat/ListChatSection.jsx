import PropTypes from 'prop-types';
import { Item, Menu, useContextMenu } from 'react-contexify';
import useConfig from '../../utils/useConfig';
import { setChatChosen, setRefreshChat } from '../../redux/slice/social';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import useChatUtils from '../../utils/useChatUtils';
import { message } from 'antd';
import { useTranslation } from 'react-i18next';

// eslint-disable-next-line no-unused-vars
const ListChatSection = ({ chatList, converChosen, chatListRaw }) => {
    const { Base_AVA } = useConfig();
    const navigate = useNavigate();
    const { show } = useContextMenu();
    const dispatch = useDispatch();
    const { AcronymName, deleteConversation } = useChatUtils();
    const userId = localStorage.getItem("userId");
    const { t } = useTranslation();
    // console.log("ListChatSection chatList", chatList);
    // Handle chat chosen
    const handleChatChosen = async (conver) => {
        // console.log("ChatNavigate handleChatChosen", conver);
        const converDetail = {
            chatId: conver.chatId,
            userName: conver.userName,
            avatar: conver.avatar,
            communityId: conver.communityId,
            communityName: conver.communityName,
            communityAvatar: conver.communityAvatar,
            communityHost: conver.communityHost,
            approveRequests: conver.approveRequests,
            hosts: conver.hosts,
            joinUsers: conver.joinUsers,
        };
        // console.log("ChatNavigate handleChatChosen", converDetail);

        dispatch(setChatChosen(converDetail));
        if (!conver.communityId) {
            // Private message
            navigate(`/chat/${conver.chatId}`);
        } else {
            // Artist community
            navigate(`/chat/community/${conver.chatId}`);
        }
    };

    const handleDeleteConversation = async (userId, sendUser) => {
        if (!userId || !sendUser) {
            message.error("Invalid user data");
            return;
        }
        await deleteConversation(userId, sendUser).then((res) => {
            if (res.status !== 200) {
                message.error("Failed to delete conversation. Please try again later.");
                return;
            }
            message.success("Delete conversation successfully");
            navigate("/chat");
            dispatch(setRefreshChat(true));
        }).catch(error => {
            console.error("Failed to delete conversation:", error);
            message.error("Failed to delete conversation. Please try again later.");
        });
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
            {chatList.map((conver, index) => (
                <div
                    onContextMenu={(e) => displayMenu(e, index)}
                    key={index}
                    className={`flex flex-row items-center gap-3 p-2 cursor-pointer w-full rounded-sm
                    ${converChosen.communityId !== null && converChosen.communityId === conver.communityId ? "bg-slate-200 dark:bg-backgroundChattingHoverDark" : (converChosen.chatId !== null && conver.chatId === converChosen.chatId ? "bg-slate-200 dark:bg-backgroundChattingHoverDark" : "")} `}
                    onClick={() => handleChatChosen(conver)
                    }
                >

                    <Menu id={`converOption_${index}`} className='contexify-menu'>
                        <Item
                            onClick={() => {
                                handleDeleteConversation(userId, conver.chatId);
                            }}
                        >
                            {t("chat.deleteConversation")}
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