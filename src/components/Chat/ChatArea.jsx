import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import UseCookie from "../../hooks/useCookie";
import MessageSection from "./MessageSection";
import defaultAva from "../../assets/img/logo/logo.png";
import { useChatUtils } from "../../utils/useChatUtils";
import { setIsNewMessage, setRefreshChat } from "../../redux/slice/social";
import useIconUtils from "../../utils/useIconUtils";
import useConfig from "../../utils/useConfig";
import { Item, Menu, useContextMenu } from "react-contexify";
import { message } from "antd";
import ModalApprove from "./ModalApprove";

const ChatArea = () => {
  const { handleSocketReconnect, loadMessage, deleteCommunity, ApproveRequest, outCommunity } = useChatUtils();
  const { Base_URL, socket } = useConfig();
  const { getToken } = UseCookie();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { BackIcon, UserGroupIcon, OptionsIcon, ExitCommunityIcon } = useIconUtils();
  const { access_token } = getToken();
  const { show } = useContextMenu();
  const userId = parseInt(localStorage.getItem("userId"), 10);
  const chatId = useParams().chatId;
  const converChosen = useSelector((state) => state.social.currentChat);
  const [chatInfo, setChatInfo] = useState();
  const [newMessage, setNewMessage] = useState("");
  const [chatContent, setChatContent] = useState([]);
  const [openApprovedList, setOpenApprovedList] = useState(false);

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
          sendUser: {
            id: sendUserId
          },
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
        sendUser: {
          id: sendUserId
        },
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

  const displayMenu = (e, communityId) => {
    e.preventDefault();
    show({
      position: { x: e.clientX, y: e.clientY + 20 },
      event: e,
      id: `communityOption_${communityId}`,
    });
  }

  const handleMessageChange = (event) => {
    setNewMessage(event.target.value);
  };

  const handleApproveRequest = async (userId, requestId, isApprove) => {
    await ApproveRequest(userId, requestId, isApprove).then((res) => {
      if (res.status === 200) {
        message.success(`Approved successfully user ${requestId}`);
        dispatch(setRefreshChat(true));
        setOpenApprovedList(false);
      }
      else {
        message.error(`Failed to approve user ${requestId}`);
        console.log("Error approve request:", res);
      }
    }
    );
  }
  const handleOutCommunity = async (userId, communityId) => {
    await outCommunity(userId, communityId).then((res) => {
      if (res.status === 200) {
        message.success(`Out community successfully user ${communityId}`);
        dispatch(setRefreshChat(true));
        navigate("/chat");
      }
      else {
        message.error(`Failed to out community user ${communityId}`);
        console.log("Error out community:", res);
      }
    });
  }
  useEffect(() => {
    if (converChosen !== null && userId != null) {
      setChatInfo(converChosen);
      console.log("CHATINFO ", chatInfo);
      loadMessage(userId, chatId).then((data) => {
        setChatContent(data);
      });
    }
  }, [converChosen, userId, chatId]);

  useEffect(() => {
    if (socket) {
      handleSocketReconnect(socket);
    }
  }, [socket]);

  useEffect(() => {
    if (socket) {
      socket.on("receive_message", (message) => {
        console.log("Received message:", message);
        loadMessage(userId, chatId).then((data) => {
          setChatContent(data);
        });
        dispatch(setIsNewMessage(true));
      })
    }

    // // Ngắt kết nối khi component unmounts
    // return () => {
    //   socket.disconnect();
    // };
  }, [socket]);

  return (
    <div className="xl:w-4/5">
      <div className="fixed flex flex-row items-center justify-between w-full h-20 pl-3 bg-slate-50 dark:bg-backgroundChattingInputNavDark">
        <div className="flex flex-row items-center ">
          <BackIcon></BackIcon>
          <div className="w-10">
            <img
              src={`${chatInfo?.avatar ? chatInfo.avatar : defaultAva}`}
              alt="user"
              className="bg-white rounded-full"
            />
          </div>
          <h2 className="z-50 flex items-center h-full pl-3 font-bold text-primary dark:text-primaryDarkmode">
            {chatInfo?.userName ? chatInfo.userName : "Unknown"}
          </h2>
        </div>

        {chatInfo?.communityId === userId &&
          <div className="sticky right-0 flex flex-row items-center gap-2 px-4 text-primary dark:text-primaryDarkmode">
            <div className="cursor-pointer" onClick={setOpenApprovedList}>
              <UserGroupIcon></UserGroupIcon>
            </div>
            <div className="cursor-pointer" onClick={(e) => displayMenu(e, chatInfo.communityId)}>
              <OptionsIcon></OptionsIcon>
            </div>
          </div>
        }
        {chatInfo?.communityId !== null && chatInfo?.communityId !== userId &&
          <div className="sticky right-0 flex flex-row items-center gap-2 px-4 text-primary dark:text-primaryDarkmode">
            <div className="cursor-pointer" onClick={() => handleOutCommunity(userId, chatInfo.communityId)}>
              <ExitCommunityIcon></ExitCommunityIcon>
            </div>
          </div>
        }
      </div>

      {/* Load message content */}
      <div className="w-full min-w-full">
        <MessageSection
          chatContent={chatContent !== null ? chatContent : []}
        ></MessageSection>
      </div>
      {/* Load message content */}

      {/* Chat input area */}
      <div className="fixed bottom-0 flex flex-row items-center w-full h-20 pl-3 bg-slate-200 dark:bg-backgroundChattingInputNavDark">
        <div className="w-[1050px] h-12 mx-2">
          <input
            type="text"
            className="w-full p-3 rounded-md text-primaryText2 "
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
            className="w-full p-3 text-white rounded-lg bg-primary hover:opacity-50 dark:bg-primaryDark"
            onClick={() => sendMessage(userId, chatId, newMessage)}
          >
            Send
          </button>
        </div>
      </div>
      {/*  End of chat input area */}
      <Menu id={`communityOption_${chatInfo?.communityId}`} className='contexify-menu'>
        <Item
          onClick={() => {
            deleteCommunity(chatInfo?.communityId).then(() => {
              dispatch(setRefreshChat(true));
              navigate("/chat");
            });
          }}
        >
          Delete Community
        </Item>
      </Menu>
      {/* Approved List */}
      <ModalApprove
        openApprovedList={openApprovedList}
        setOpenApprovedList={setOpenApprovedList}
        converChosen={converChosen}
        handleApproveRequest={handleApproveRequest}
      ></ModalApprove>

    </div>
  );
};

export default ChatArea;
