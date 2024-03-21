import { useParams } from "react-router-dom";
import { useChatUtils } from "../../utils/chatUtils";
import React, { useEffect, useState } from 'react';
import UseCookie from "../../hooks/useCookie";
import axios from "axios";
import { Base_URL } from "../../api/config";

const ChatArea = () => {
  const userId = parseInt(localStorage.getItem("userId"), 10);
  const { AcronymName } = useChatUtils();
  const chatId = useParams().chatId;
  const { getToken } = UseCookie();
  const { access_token } = getToken();
  const [newMessage, setNewMessage] = useState('');
  const [chatContent, setChatContent] = useState([]);

  const handleMessageChange = (event) => {
    setNewMessage(event.target.value);
  };

  // Use chatID to fetch chat content from server
  const fetchChatlist = async (sendUserId, receiveUserId) => {
    try {
      const response = await axios.post(`${Base_URL}/messages/loadMessage`, 
      {
        sendUserId: sendUserId,
        receiveUserId: receiveUserId
      },
      {
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      }
      );
      console.log('Response:', response.data); // Log the entire response object
      console.log(sendUserId, receiveUserId);
      if (response.status !== 200) {
        throw new Error('Failed to fetch messages');
      }
  
      const messages = response.data;
      console.log("Current User" ,userId);
      // Append the new messages to the chatContent of the found chat
      setChatContent(prevChatContent => {
        if (prevChatContent !== null) {
          prevChatContent = []; // Initialize with empty array if null
        }
        prevChatContent = Object.keys(messages).map(key => {
          const message = messages[key];
          return {
            id: message.sentUser.id,
            name: message.sentUser.userName,
            own: userId === message.message.sendUserId,
            message: message.message.content,
            time: new Date(message.message.messageDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            avatar: message.user.avatar,
            sentUserAvatar: message.sentUser.avatar,
          };
        })
        return prevChatContent;
      }
      );
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = async (sendUserId, receiveUserId, content) => {
    try {
      const response = await axios.post(`${Base_URL}/messages/sendMessage`, 
      {
        sendUserId: sendUserId,
        receiveUserId: receiveUserId,
        content: content
      },
      {
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      }
      );
      console.log('Response:', response.data);
      fetchChatlist(sendUserId, receiveUserId);
        // Clear the message input
      setNewMessage('');
    } catch (error) {
      console.error('Error sending messages:', error);
    }
  };

  useEffect(() => {
    console.log(chatId);
    console.log("ChatArea Mounted");
    fetchChatlist(userId, chatId);
  }, [chatId]);

  return (
    <div className="w-full">
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

      <div className="flex flex-col min-h-screen xl:w-full bg-orange-300 py-20">
      {chatContent.map((chat, index) => (
        <div
          key={index}
          className={`${
            chat.own === true ? "items-end" : "items-start"
          } flex flex-col m-2 gap-2`}
        >
          <div className="flex flex-row items-center">
            <div className="w-10">
              <img
                src={chat.sentUserAvatar}
                alt="user"
                className="rounded-full"
              />
            </div>
            <div className="w-fit p-2">
              <p className="text-base border rounded-md bg-slate-200 p-2">
                {chat.message}
              </p>
            </div>
            <div>
              <p className="text-slate-400">{chat.time}</p>
            </div>
          </div>
        </div>
      ))}
      </div>

      {
        // Chat input area
      }

      <div className="h-20 bg-slate-200 w-full max-w-screen-xl pl-3 flex flex-row items-center bottom-0 fixed">
        <div className="w-5/6 h-12 mx-2">
          <input
            type="text"
            className="w-full rounded-md p-3"
            placeholder="Type a message..."
            value={newMessage}
            onChange={handleMessageChange}
          />
        </div>

        <div className="w-1/6 p-2">
          <button className="bg-slate-300 w-full rounded-md p-3" onClick={() => sendMessage(userId, chatId, newMessage)}>Send</button>
        </div>
      </div>

      {
        // End of chat input area
      }
    </div>
  );
};

export default ChatArea;
