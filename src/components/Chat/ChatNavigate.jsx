import { useNavigate } from "react-router-dom";
import { useChatUtils } from "../../utils/chatUtils";
import { useDispatch, useSelector } from "react-redux";
import { setChatChosen } from "../../redux/slice/social";
import { Base_URL } from "../../api/config";
import React, { useEffect, useState } from 'react';
import UseCookie from "../../hooks/useCookie";
import axios from "axios";

const ChatNavigate = () => {
  const userId = localStorage.getItem("userId");
  const { AcronymName } = useChatUtils();
  const { getToken } = UseCookie();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { access_token } = getToken();
  const converChosen = useSelector(
    (state) => state.social.currentChat.currentChatId
  );
  const [converList, setConverList] = useState([]);
  useEffect(() => {
    const fetchChatList = async () => {
      try {
        ///////////// TODO: userId = current user login
        const response = await axios.get(`${Base_URL}/messages/loadChatList?userId=${userId}`, {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        });
        const data = await response.data;
        const sortedKeys = Object.keys(data).sort((a, b) => b - a);
        // Convert object keys to array and map each item to the desired format
        const updatedConverList = sortedKeys.map(key => ({
          chatId: data[key].user.id,
          name: data[key].user.userName,
          message: data[key].lastMessage.content,
          time: new Date(data[key].lastMessage.messageDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          avatar: data[key].user.avatar,
        }));
        setConverList(updatedConverList);
      } catch (error) {
        console.error('Error fetching chat list:', error);
      }
    };

    fetchChatList();
  }, []);
  const handleChatChosen = (chatId) => {
    console.log(chatId);
    dispatch(setChatChosen(chatId));
    navigate(`/chat/${chatId}`);
  };
  return (
    <div className="xl:w-1/6 min-h-screen h-fit bg-gray-100  border-gray-200 px-1">
      <div
        className="text-center pt-6 uppercase font-bold text-lg flex flex-row justify-center items-center gap-5 cursor-pointer"
        onClick={() => navigate("/home")}
      >
        <div>
          <img
            src="src\assets\img\logo\logo.png"
            className="h-12 rounded-lg"
            alt=""
          />
        </div>
        <div className="text-[#2E3271]">TuneTown</div>
      </div>

      <button
        onClick={() => window.history.back("/")}
        className="bg-[#2f9948] hover:bg-[#40cf62] rounded-md my-5 ml-2"
      >
        <div className="text-white font-bold px-2 py-1">{"<"} Back</div>
      </button>

      <div className="flex flex-col justify-center gap-2 mt-2">
        {converList.map((conver) => (
          <div
            key={conver.chatId}
            className={`${
              converChosen == conver.chatId ? "bg-slate-300" : ""
            } flex flex-row items-center hover:bg-slate-300 gap-3 p-2 cursor-pointer rounded-md`}
            onClick={() => handleChatChosen(conver.chatId)}
          >
            <div className="w-14">
              <img
                src={conver.avatar}
                alt="user"
                className="rounded-full"
              />
            </div>
            <div className="w-3/4">
              <h3 className="font-bold text-lg">{conver.name}</h3>
              <p className="text-base"> {AcronymName(conver.message, 12)}</p>
            </div>
            <div>
              <p className="text-slate-400">{conver.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatNavigate;
