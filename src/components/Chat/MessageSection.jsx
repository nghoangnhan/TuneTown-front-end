import PropTypes from "prop-types";
import { useEffect, useRef } from "react";
import defaultAva from "../../assets/img/logo/logo.png";

const MessageSection = ({ chatContent }) => {
  console.log("Chat Content:", chatContent);
  const messagesEndRef = useRef(null);
  const scollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scollToBottom();
  }, [chatContent]);
  return (
    <div className="flex flex-col h-screen min-h-screen py-20 overflow-auto bg-orange-300 xl:w-full">
      {chatContent.map((chat, index) => (
        <div
          key={index}
          className={`${
            chat.own == true ? "items-end" : "items-start"
          } flex flex-col m-2 gap-2`}
        >
          <div className="flex flex-row items-end ">
            <div className="w-10">
              <img
                src={
                  chat.own
                    ? chat.avatar || defaultAva
                    : chat.sentUserAvatar || defaultAva
                }
                alt="user"
                className="rounded-full"
              />
            </div>
            <div className="mx-2">
              <h3 className="text-gray-500">
                {chat.name ? chat.name : "Unknown"}
              </h3>
              <div className="max-w-xs p-1 text-base break-words border rounded-md bg-slate-200">
                {chat.message}
              </div>
            </div>
            <div>
              <p className="text-sm text-slate-400">{chat.time}</p>
            </div>
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

MessageSection.propTypes = {
  chatContent: PropTypes.array,
};

export default MessageSection;
