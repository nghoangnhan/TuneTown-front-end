import PropTypes from "prop-types";
import { useEffect, useRef } from "react";
import ChatItem from "./ChatItem";

const MessageSection = ({ chatContent }) => {

  const windownEndRef = useRef(null);
  const scollToBottom = (windownEndRef) => {
    windownEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scollToBottom(windownEndRef);
  }, [chatContent]);
  return (
    <div className="flex flex-col w-full h-screen min-h-screen py-20 overflow-auto bg-backgroundChat dark:bg-backgroundChattingDark" >
      {chatContent != null &&
        chatContent.map((chat, index) => (
          <ChatItem key={index} index={index} chat={chat}></ChatItem>
        ))}
      <div ref={windownEndRef} />
    </div>
  );
};

MessageSection.propTypes = {
  chatContent: PropTypes.array,
};

export default MessageSection;
