import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import defaultAva from "../../assets/img/logo/logo.png";
import { useChatUtils } from "../../utils/useChatUtils";
import UseCookie from "../../hooks/useCookie";
import { setChatChosen } from "../../redux/slice/social";
import { setIsNewMessage } from "../../redux/slice/social";
import useIconUtils from "../../utils/useIconUtils";
import useConfig from "../../utils/useConfig";


const ChatNavigate = () => {
  const userId = localStorage.getItem("userId");
  const { AcronymName } = useChatUtils();
  const { getToken } = UseCookie();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { BackButton } = useIconUtils();
  const { isMobile, Base_URL } = useConfig();
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
      const sortedData = Object.values(data).sort((a, b) => {
        return (
          new Date(b.lastMessage.messageDate) -
          new Date(a.lastMessage.messageDate)
        );
      });

      const updatedConverList = sortedData.map((item) => ({
        chatId: item.user.id,
        name: item.user.userName,
        message: item.lastMessage.content,
        time: new Date(item.lastMessage.messageDate).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        avatar: item.user.avatar,
        seen: item.lastMessage.seen,
      }));
      setConverList(updatedConverList);
      console.log(updatedConverList);
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
    <div className={`${isMobile ? "w-full" : "w-80"} min-h-screen px-1 bg-gray-100 border-gray-200  h-fit`}>
      <div
        className="flex flex-row items-center justify-center gap-5 pt-6 text-lg font-bold text-center uppercase cursor-pointer"
        onClick={() => navigate("/home")}
      >
        <div>
          <img src={defaultAva} className="h-12 rounded-lg" alt="" />
        </div>
        <div className="text-[#2E3271]">TuneTown</div>
      </div>
      <div className="ml-2">
        <BackButton></BackButton>
      </div>
      <div className="flex flex-col justify-center gap-2 mt-5">
        {converList.map((conver) => (
          <div
            key={conver.chatId}
            className={`${converChosen == conver.chatId ? "bg-slate-300" : ""
              } flex flex-row items-center hover:bg-slate-300 gap-3 p-2 cursor-pointer w-full rounded-sm`}
            onClick={() => {
              console.log("Seen status:", conver.seen);
              handleChatChosen(conver.chatId, conver);
            }}
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
              <p
                className={`text-sm ${conver.seen === 0 ? "font-bold" : "font-italic"
                  }`}
              >
                {" "}
                {AcronymName(conver.message, 22)}
              </p>
            </div>
            <div className="flex justify-center">
              <p className={`text-sm w-16 ${conver.seen === 0 ? "font-bold" : ""} `}>
                {conver.time}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatNavigate;
