import PropTypes from "prop-types";
import { useEffect, useRef } from "react";
import defaultAva from "../../assets/img/logo/logo.png";
import useIconUtils from "../../utils/useIconUtils";

const MessageSection = ({ chatContent }) => {
  const { Check, CheckSeen } = useIconUtils();
  const windownEndRef = useRef(null);
  const scollToBottom = (windownEndRef) => {
    windownEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scollToBottom(windownEndRef);
  }, [chatContent]);
  return (
    <div className="flex flex-col w-full h-screen min-h-screen py-20 overflow-auto bg-backgroundChat dark:bg-backgroundChattingDark">
      {chatContent != null &&
        chatContent.map((chat, index) => (
          <div
            key={index}
            className={`${chat.own == true && chat.type !== 2 ? "items-end" : (chat.own == false && chat.type !== 2 ? "items-start" : (chat.type == 2 ? "items-center"
              : ""))} flex flex-col m-2 gap-2`}>
            <div className="flex flex-row items-end ">
              {/* Avatar  */}
              <div className="w-10">
                {chat.own == false && chat.type !== 2 &&
                  <img
                    src={`${chat.sentUserAvatar ? chat.sentUserAvatar : defaultAva}`}
                    alt="user"
                    className="bg-white rounded-full"
                  />}
              </div>

              {/* Message */}
              {/* 2 is SYSTEM, !2 is USERS */}
              {chat.type !== 2 && <div className="flex flex-col gap-2 mx-1">
                <h3 className="font-bold text-primary dark:text-primaryDarkmode">
                  {chat.name ? chat.name : "Unknown"}
                </h3>
                <div className="flex flex-row items-end gap-1">
                  <span className="max-w-xs px-2 py-1 text-base break-words border rounded-md bg-slate-200">
                    {chat.message}
                  </span>
                  {chat.own && chat.seen === 1 && <CheckSeen className="ml-1 text-primary dark:text-primaryDarkmode" />}
                  {chat.own && chat.seen === 0 && <Check className="ml-1 text-primary dark:text-primaryDarkmode" />}
                </div>
                <div className="flex justify-end">
                  <p className="text-xs text-slate-400">{chat.time}</p>
                </div>
              </div>}
              {
                chat.type === 2 && <div className="flex flex-col items-center justify-center">
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
        ))}
      <div ref={windownEndRef} />
    </div>
  );
};

MessageSection.propTypes = {
  chatContent: PropTypes.array,
};

export default MessageSection;
