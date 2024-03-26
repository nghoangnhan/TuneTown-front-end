import axios from "axios";
import UseCookie from "../hooks/useCookie";
import { Base_URL } from "../api/config";
import { useEffect } from "react";

export const useChatUtils = () => {
  const { getToken } = UseCookie();
  const { access_token } = getToken();
  const userId = parseInt(localStorage.getItem("userId"), 10);

  // Acronym the name of the song
  const AcronymName = (nameLenght, length) => {
    if (nameLenght && nameLenght.length > 10) {
      return nameLenght.slice(0, length) + "...";
    } else {
      return nameLenght;
    }
  };

  const handleSocketReconnect = (socket) => {
    const handleConnect = () => {
      console.log("Connected to server");
    };
    const handleDisconnect = () => {
      console.log("Disconnected from server");
      // Reconnect to the server
      const interval = setInterval(() => {
        socket.connect();
      }, 1000);

      return () => clearInterval(interval);
    };

    // Listen for connect and disconnect events
    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

    // Clean up event listeners
    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
    };
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
      console.log(
        "Response fetchChatlist:",
        "sendUID",
        sendUserId,
        "RecieveUID",
        receiveUserId,
        "Message",
        messages
      );
      if (response.status !== 200) {
        throw new Error("Failed to fetch messages");
      }
      // Append the new messages to the chatContent of the found chat
      const updatedChatContent = Object.keys(messages).map((key) => {
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
      return updatedChatContent;
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };
  return { AcronymName, fetchChatlist, handleSocketReconnect };
};

export default useChatUtils;
