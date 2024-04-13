import PropTypes from "prop-types";
import { useEffect, useRef } from "react";
import defaultAva from "../../assets/img/logo/logo.png";
import { FaCheck, FaCheckDouble } from 'react-icons/fa';

const MessageSection = ({ chatContent }) => {
  console.log("Chat Content:", chatContent);
  const windownEndRef = useRef(null);
  const scollToBottom = (windownEndRef) => {
    windownEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scollToBottom(windownEndRef);
  }, [chatContent]);
  return (
    <div className="flex flex-col h-screen min-h-screen py-20 overflow-auto bg-orange-300 xl:w-full">
      {chatContent != null &&
        chatContent.map((chat, index) => (
          <div
            key={index}
            className={`${chat.own == true ? "items-end" : "items-start"
              } flex flex-col m-2 gap-2`}
          >
            <div className="flex flex-row items-end ">
              {/* Avatar  */}
              <div className="w-10">
                {chat.own == false && < img
                  src={`${chat.sentUserAvatar ? chat.sentUserAvatar : defaultAva}`}
                  alt="user"
                  className="rounded-full"
                />}
              </div>
              {/* Message */}
              <div className="flex flex-col gap-2 mx-1">
                <h3 className="font-bold text-gray-500">
                  {chat.name ? chat.name : "Unknown"}
                </h3>
                <div className="flex flex-row items-end">
                  <span className="max-w-xs p-2 text-base break-words border rounded-md bg-slate-200">
                    {chat.message}
                  </span>
                  {chat.own && chat.seen === 1 && <FaCheckDouble className="ml-1 text-gray-500" />}
                  {chat.own && chat.seen === 0 && <FaCheck className="ml-1 text-gray-500" />}
                </div>
                <div className="flex justify-end">
                  <p className="text-xs text-slate-400">{chat.time}</p></div>
              </div>
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
