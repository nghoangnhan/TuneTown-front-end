import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import UseCookie from "../../hooks/useCookie";
import { Base_URL, socket } from "../../api/config";
import MessageSection from "./MessageSection";
import defaultAva from "../../assets/img/logo/logo.png";
import { useChatUtils } from "../../utils/useChatUtils";
import { setIsNewMessage } from "../../redux/slice/social";
import useIconUtils from "../../utils/useIconUtils";

const ChatArea = () => {
  // const userId = localStorage.getItem("userId");
  const { handleSocketReconnect, loadMessage } = useChatUtils();
  const { getToken } = UseCookie();
  const dispatch = useDispatch();
  const { BackIcon } = useIconUtils();
  const { access_token } = getToken();
  const userId = parseInt(localStorage.getItem("userId"), 10);
  const chatId = useParams().chatId;
  const converChosen = useSelector((state) => state.social.currentChat);
  const [newMessage, setNewMessage] = useState("");
  const [chatContent, setChatContent] = useState([]);

  const sendMessage = async (sendUserId, receiveUserId, content) => {
    // Check if the message is empty or the sender is the receiver
    if (!content || content.trim() === "" || sendUserId === receiveUserId) {
      return;
    }
    // Send the message to the server
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
      console.log("Response sendMessage:", response.data);
      if (response.status !== 200) {
        throw new Error("Failed to send message");
      }
      // Clear the message input
      setNewMessage("");
      // Emit the message to the server
      socket.emit("send_message", {
        sendUserId: sendUserId,
        receiveUserId: receiveUserId,
        content: content,
      });

      // Update the chat list
      loadMessage(userId, chatId).then((data) => {
        setChatContent(data);
      });

      // Set isNewMessage to true
      dispatch(setIsNewMessage(true));
    } catch (error) {
      console.error("Error sending messages:", error);
    }
  };

  const handleMessageChange = (event) => {
    setNewMessage(event.target.value);
  };

  useEffect(() => {
    if (userId != null) {
      loadMessage(userId, chatId).then((data) => {
        setChatContent(data);
      });
    }
  }, [userId, chatId]);

  useEffect(() => {
    if (converChosen != null) {
      loadMessage(userId, chatId).then((data) => {
        setChatContent(data);
      });
    }
  }, [converChosen]);

  useEffect(() => {
    handleSocketReconnect(socket);
  }, [socket]);

  useEffect(() => {
    socket.on("receive_message", (message) => {
      console.log("Received message:", message);
      loadMessage(userId, chatId).then((data) => {
        setChatContent(data);
      });
      dispatch(setIsNewMessage(true));
    });

    // // Ngắt kết nối khi component unmounts
    // return () => {
    //   socket.disconnect();
    // };
  }, [socket]);

  return (
    <div className="xl:w-4/5">
      <div className="fixed flex flex-row items-center w-full h-20 pl-3 bg-slate-50">
        <BackIcon></BackIcon>
        <div className="w-10">
          <img
            src={`${converChosen.avatar ? converChosen.avatar : defaultAva}`}
            alt="user"
            className="rounded-full"
          />
        </div>
        <h2 className="z-50 flex items-center h-full pl-3 font-bold text-black">
          {converChosen.userName ? converChosen.userName : "Unknown"}
        </h2>
      </div>

      {/* Load message content */}
      <MessageSection
        chatContent={chatContent !== null ? chatContent : []}
      ></MessageSection>
      {/* Load message content */}

      {/* Chat input area */}
      <div className="fixed bottom-0 flex flex-row items-center w-full h-20 pl-3 bg-slate-200">
        <div className="w-[1050px] h-12 mx-2">
          <input
            type="text"
            className="w-full p-3 rounded-md"
            placeholder="Type a message..."
            value={newMessage}
            onChange={handleMessageChange}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                sendMessage(userId, chatId, newMessage);
              }
            }}
          />
        </div>
        <div className="w-[130px] p-2">
          <button
            className="w-full p-3 rounded-md bg-slate-300"
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
