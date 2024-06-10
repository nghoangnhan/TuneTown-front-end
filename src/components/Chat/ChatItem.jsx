import PropTypes from 'prop-types';
import useIconUtils from '../../utils/useIconUtils';
import useConfig from '../../utils/useConfig';
import { useState } from 'react';

const ChatItem = ({ chat, index }) => {
    const { Check, CheckSeen } = useIconUtils();
    const { Base_AVA } = useConfig();
    const [isHover, setIsHover] = useState(false);

    // Check if chat is null
    if (!chat) return null;
    return (
        <div
            key={index}
            className={`${chat.own == true && chat.type !== 2 ? "items-end" : (chat.own == false && chat.type !== 2 ? "items-start" : (chat.type == 2 ? "items-center"
                : ""))} flex flex-col m-2 gap-2`}>
            <div className="flex flex-row items-end ">

                {/* Message */}
                {/* 2 is SYSTEM, !2 is USERS */}
                {chat.type !== 2 &&
                    <div className="flex flex-row items-center"
                        onMouseEnter={() => setIsHover(true)}
                        onMouseLeave={() => setIsHover(false)}>
                        {/* Avatar  */}
                        <div className="w-8">
                            {chat.own == false && chat.type !== 2 &&
                                <img
                                    src={`${chat.sentUserAvatar ? chat.sentUserAvatar : Base_AVA}`}
                                    alt="user"
                                    className="mt-2 bg-white rounded-full"
                                />}
                        </div>

                        <div className="flex flex-col gap-1 mx-1">
                            <h3 className="font-bold text-primary dark:text-primaryDarkmode">
                                {chat.name ? chat.name : "Unknown"}
                            </h3>
                            <div className="flex flex-row items-end gap-1">
                                <span className="max-w-xs px-2 py-1 text-base break-words border rounded-md bg-slate-200">
                                    {chat.message}
                                </span>
                                {chat.own && chat.seen == 1 && <CheckSeen />}
                                {chat.own && chat.seen == 0 && <Check />}
                            </div>
                            {isHover &&
                                <div className={`flex ${chat.own == true ? "justify-end" : "justify-start"}`}>
                                    <p className={`text-xs transition-opacity duration-1000 ease-in-out opacity-0 text-slate-400 ${isHover ? "opacity-100" : ""}`}>{chat.time}</p>
                                </div>
                            }
                        </div>
                    </div>}

                {chat.type === 2 &&
                    <div className="flex flex-col items-center justify-center">
                        <div className="flex flex-col items-center justify-center gap-2 mt-2">
                            <h3 className="font-bold text-primary dark:text-primaryDarkmode">
                                {chat.name ? chat.name : "SYSTEM MESSAGE"}
                            </h3>
                            <span className="max-w-xs px-2 py-1 text-base break-words rounded-md text-backgroundPlaylistDark dark:text-backgroundPlaylistHoverDark bg-backgroundComponentPrimary dark:bg-backgroundComponentPrimary">
                                {chat.message}
                            </span>
                        </div>
                    </div>
                }
            </div>
        </div>
    );
};

ChatItem.propTypes = {
    chat: PropTypes.object,
    index: PropTypes.number,
};

export default ChatItem;