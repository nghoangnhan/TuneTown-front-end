import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import UseCookie from "../../hooks/useCookie";
import axios from "axios";
import { Base_URL } from "../../api/config";
import MessageSection from "./MessageSection";

const ChatArea = () => {
  // const userId = localStorage.getItem("userId");
  const userId = parseInt(localStorage.getItem("userId"), 10);

  console.log("Chat Area Mounted");
  const chatId = useParams().chatId;
  const { getToken } = UseCookie();
  const { access_token } = getToken();
  const [newMessage, setNewMessage] = useState("");
  const [chatContent, setChatContent] = useState([]);

  const handleMessageChange = (event) => {
    setNewMessage(event.target.value);
  };

  // Use chatID to fetch chat content from server
  const fetchChatlist = async (sendUserId, receiveUserId) => {
    try {
      const response = await axios.post(
        `${Base_URL}/messages/loadMessage`,
        {
          sendUserId: sendUserId,
          receiveUserId: receiveUserId,
        },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      const messages = response.data;
      console.log("Response load message:", messages); // Log the entire response object
      console.log("Current User", userId);
      if (response.status !== 200) {
        throw new Error("Failed to fetch messages");
      }
      // Append the new messages to the chatContent of the found chat
      setChatContent((prevChatContent) => {
        if (prevChatContent !== null) {
          prevChatContent = []; // Initialize with empty array if null
        }
        prevChatContent = Object.keys(messages).map((key) => {
          const message = messages[key];
          const own = userId === message.message.sendUserId;
          const name = own ? message.user.userName : message.sentUser.userName;
          return {
            id: message.sentUser.id,
            name: name,
            own: userId === message.message.sendUserId,
            message: message.message.content,
            time: new Date(message.message.messageDate).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            avatar: message.user.avatar,
            sentUserAvatar: message.sentUser.avatar,
          };
        });
        return prevChatContent;
      });
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const sendMessage = async (sendUserId, receiveUserId, content) => {
    try {
      const response = await axios.post(
        `${Base_URL}/messages/sendMessage`,
        {
          sendUserId: sendUserId,
          receiveUserId: receiveUserId,
          content: content,
        },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      console.log("Response:", response.data);
      fetchChatlist(sendUserId, receiveUserId);
      // Clear the message input
      setNewMessage("");
    } catch (error) {
      console.error("Error sending messages:", error);
    }
  };

  useEffect(() => {
    console.log(chatId);
    console.log("ChatArea Mounted");
    fetchChatlist(userId, chatId);
  }, [chatId]);

  return (
    <div className="w-4/5">
      <div className="h-20 bg-slate-50 w-full pl-3 flex flex-row items-center fixed">
        <div className="w-10">
          <img
            src="https://via.placeholder.com/150"
            alt="user"
            className="rounded-full"
          />
        </div>
        {/* <h2 className="flex items-center h-full font-bold pl-3 text-black z-50">
          {otherPersonName}
        </h2> */}
      </div>

      {/* Load message content */}
      <MessageSection
        chatContent={chatContent !== null ? chatContent : []}
      ></MessageSection>
      {/* Load message content */}

      {/* Chat input area */}
      <div className="h-20 bg-slate-200 w-full pl-3 flex flex-row items-center bottom-0 fixed">
        <div className="w-[1050px] h-12 mx-2">
          <input
            type="text"
            className="w-full rounded-md p-3"
            placeholder="Type a message..."
            value={newMessage}
            onChange={handleMessageChange}
          />
        </div>
        <div className="w-[130px] p-2">
          <button
            className="bg-slate-300 w-full rounded-md p-3"
            onClick={() => sendMessage(userId, chatId, newMessage)}
          >
            Send
          </button>
        </div>
      </div>
      {/*  End of chat input area */}
    </div>
  );
};

export default ChatArea;
