import { useParams } from "react-router-dom";
import { useChatUtils } from "../../utils/chatUtils";
import { useEffect, useState } from "react";

const ChatArea = () => {
  const { AcronymName } = useChatUtils();
  const chatId = useParams().chatId;
  const [chatContent, setChatContent] = useState([]);

  // Use chatID to fetch chat content from server
  // For now, I will use this dummy data
  const Chatlist = [
    {
      chatId: 0,
      chatContent: [
        {
          id: 1,
          name: "Ahmed",
          own: false,
          message: "Hello",
          time: "12:00",
        },
        {
          id: 2,
          name: "Ahmed",
          own: false,
          message: "Hellooooo",
          time: "12:08",
        },
        {
          id: 3,
          name: "Nam",
          own: true,
          message: "OK",
          time: "12:08",
        },
        {
          id: 4,
          name: "Nam",
          own: true,
          message: "OK",
          time: "12:08",
        },
        {
          id: 5,
          name: "Nam",
          own: true,
          message: "OK",
          time: "12:08",
        },
        {
          id: 6,
          name: "Nam",
          own: true,
          message: "OK",
          time: "12:08",
        },
        {
          id: 7,
          name: "Nam",
          own: true,
          message: "OK",
          time: "12:08",
        },
        {
          id: 8,
          name: "Nam",
          own: true,
          message: "OK",
          time: "12:08",
        },
        {
          id: 9,
          name: "Nam",
          own: true,
          message: "OK",
          time: "12:08",
        },
        {
          id: 10,
          name: "Nam",
          own: true,
          message: "OK",
          time: "12:08",
        },
      ],
    },
    {
      chatId: 1,
      chatContent: [
        {
          id: 1,
          name: "Ahmed",
          own: false,
          message: "Hello",
          time: "12:00",
        },
        {
          id: 2,
          name: "Nam",
          own: true,
          message: "Not okkk",
          time: "12:08",
        },
        {
          id: 3,
          name: "Nam",
          own: true,
          message: "okkk",
          time: "12:08",
        },
      ],
    },
  ];
  const otherPersonName = Chatlist[chatId].chatContent.find(
    (content) => content.own == false
  ).name;

  useEffect(() => {
    console.log(chatId);
    console.log("ChatArea Mounted");
  }, []);

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
        <h2 className="flex items-center h-full font-bold pl-3 text-black z-50">
          {otherPersonName}
        </h2>
      </div>

      <div className="flex flex-col min-h-screen xl:w-full bg-orange-300 py-20">
        {Chatlist[chatId].chatContent.map((chat) => (
          <div
            key={chat.id}
            className={`${
              chat.own == true ? "items-end" : "items-start"
            } flex flex-col m-2 gap-2`}
          >
            <h3 className="font-bold text-lg">
              {chat.own == true ? "me" : chat.name}
            </h3>
            <div className="flex flex-row items-center">
              <div className="w-10">
                <img
                  src="https://via.placeholder.com/150"
                  alt="user"
                  className="rounded-full"
                />
              </div>
              <div className="w-fit p-2">
                <p className="text-base border rounded-md bg-slate-200 p-2">
                  {AcronymName(chat.message, 12)}
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
            type="
          text"
            className="w-full rounded-md p-3"
            placeholder="Type a message..."
          />
        </div>

        <div className="w-1/6 p-2">
          <button className="bg-slate-300 w-full rounded-md p-3">Send</button>
        </div>
      </div>

      {
        // End of chat input area
      }
    </div>
  );
};

export default ChatArea;
