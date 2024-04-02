import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import defaultAva from "../../assets/img/logo/logo.png";
import { useChatUtils } from "../../utils/useChatUtils";
import UseCookie from "../../hooks/useCookie";
import { setChatChosen } from "../../redux/slice/social";
import { Base_URL } from "../../api/config";
import { setIsNewMessage } from "../../redux/slice/social";

const ChatNavigate = () => {
  const userId = localStorage.getItem("userId");
  const { AcronymName } = useChatUtils();
  const { getToken } = UseCookie();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { access_token } = getToken();
  const [converList, setConverList] = useState([]);
  const converChosen = useSelector((state) => state.social.currentChat.chatId);
  const isNewMessage = useSelector((state) => state.social.isNewMessage);

  const fetchChatList = async () => {
    try {
      //  userId = current user login
      const response = await axios.get(
        `${Base_URL}/messages/loadChatList?userId=${userId}`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      console.log("Chat List Response:", response.data);
      const data = await response.data;
      const sortedKeys = Object.keys(data).sort((a, b) => b - a);
      // Convert object keys to array and map each item to the desired format
      const updatedConverList = sortedKeys.map((key) => ({
        chatId: data[key].user.id,
        name: data[key].user.userName,
        message: data[key].lastMessage.content,
        time: new Date(data[key].lastMessage.messageDate).toLocaleTimeString(
          [],
          { hour: "2-digit", minute: "2-digit" }
        ),
        avatar: data[key].user.avatar,
      }));
      setConverList(updatedConverList);
    } catch (error) {
      console.error("Error fetching chat list:", error);
    }
  };

  // Handle chat chosen
  const handleChatChosen = (chatId, conver) => {
    console.log(chatId + " " + conver.name + " " + conver.message);
    dispatch(setChatChosen(conver));
    navigate(`/chat/${chatId}`);
  };

  useEffect(() => {
    if (isNewMessage == true) {
      fetchChatList().then(() => {
        dispatch(setIsNewMessage(false));
      });
    }
    fetchChatList();
  }, [isNewMessage]);

  return (
    <div className="min-h-screen px-1 bg-gray-100 border-gray-200 w-80 h-fit">
      <div
        className="flex flex-row items-center justify-center gap-5 pt-6 text-lg font-bold text-center uppercase cursor-pointer"
        onClick={() => navigate("/home")}
      >
        <div>
          <img src={defaultAva} className="h-12 rounded-lg" alt="" />
        </div>
        <div className="text-[#2E3271]">TuneTown</div>
      </div>

      <button
        onClick={() => navigate("/home")}
        className="bg-[#2f9948] hover:bg-[#40cf62] rounded-md my-5 ml-2"
      >
        <div className="px-2 py-1 font-bold text-white">{"<"} Back</div>
      </button>

      <div className="flex flex-col justify-center gap-2 mt-2">
        {converList
          .sort((a, b) => new Date(b.time) - new Date(a.time))
          .map((conver) => (
            <div
              key={conver.chatId}
              className={`${
                converChosen == conver.chatId ? "bg-slate-300" : ""
              } flex flex-row items-center hover:bg-slate-300 gap-3 p-2 cursor-pointer w-full rounded-sm`}
              onClick={() => handleChatChosen(conver.chatId, conver)}
            >
              <div className="w-14">
                <img
                  src={conver.avatar ? conver.avatar : defaultAva}
                  alt="user"
                  className="rounded-full"
                />
              </div>
              <div className="w-3/4">
                <h3 className="text-base font-bold">
                  {AcronymName(conver.name, 17)}
                </h3>
                <p className="text-sm"> {AcronymName(conver.message, 22)}</p>
              </div>
              <div>
                <p className="text-sm text-slate-400">{conver.time}</p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default ChatNavigate;
