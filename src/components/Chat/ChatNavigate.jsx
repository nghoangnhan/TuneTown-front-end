import { useNavigate } from "react-router-dom";
import { useChatUtils } from "../../utils/useChatUtils";
import { useDispatch, useSelector } from "react-redux";
import { setChatChosen } from "../../redux/slice/social";
import { Base_URL } from "../../api/config";
import { useEffect, useState } from "react";
import UseCookie from "../../hooks/useCookie";
import axios from "axios";
import defaultAva from "../../assets/img/logo/logo.png";

const ChatNavigate = () => {
  const userId = localStorage.getItem("userId");
  const { AcronymName } = useChatUtils();
  const { getToken } = UseCookie();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { access_token } = getToken();
  const [converList, setConverList] = useState([]);
  const converChosen = useSelector((state) => state.social.currentChat.chatId);

  console.log("Conver Chosen:", converList);
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
      const sortedData = Object.values(data).sort((a, b) => {
        return new Date(b.lastMessage.messageDate) - new Date(a.lastMessage.messageDate);
      });

      const updatedConverList = sortedData.map((item) => ({
        chatId: item.user.id,
        name: item.user.userName,
        message: item.lastMessage.content,
        time: new Date(item.lastMessage.messageDate).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit"
        }),
        avatar: item.user.avatar,
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
    fetchChatList();
  }, []);

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
        {converList.map((conver) => (
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
