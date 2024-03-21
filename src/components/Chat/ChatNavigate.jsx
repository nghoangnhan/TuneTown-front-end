import { useNavigate } from "react-router-dom";
import { useChatUtils } from "../../utils/chatUtils";
import { useDispatch, useSelector } from "react-redux";
import { setChatChosen } from "../../redux/slice/social";

const ChatNavigate = () => {
  const { AcronymName } = useChatUtils();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const converChosen = useSelector(
    (state) => state.social.currentChat.currentChatId
  );
  const ConverList = [
    {
      chatId: 0,
      name: "Ahmed",
      message: "hellaaaaaaaaaaaaaaaaaaaaaaaa",
      time: "12:00",
    },
    {
      chatId: 1,
      name: "B",
      message: "Hello",
      time: "12:00",
    },
  ];
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
        {ConverList.map((conver) => (
          <div
            key={conver.chatId}
            className={`${
              converChosen == conver.chatId ? "bg-slate-300" : ""
            } flex flex-row items-center hover:bg-slate-300 gap-3 p-2 cursor-pointer rounded-md`}
            onClick={() => handleChatChosen(conver.chatId)}
          >
            <div className="w-14">
              <img
                src="https://via.placeholder.com/150"
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
