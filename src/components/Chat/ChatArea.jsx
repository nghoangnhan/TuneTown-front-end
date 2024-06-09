import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import UseCookie from "../../hooks/useCookie";
import MessageSection from "./MessageSection";
import { useChatUtils } from "../../utils/useChatUtils";
import { setIsNewMessage, setRefreshChat } from "../../redux/slice/social";
import useIconUtils from "../../utils/useIconUtils";
import useConfig from "../../utils/useConfig";
import { Item, Menu, useContextMenu } from "react-contexify";
import { message } from "antd";
import ModalApprove from "./ModalApprove";
import ModalEditMember from "./ModalEditMember";
import { useTranslation } from "react-i18next";

const ChatArea = () => {
  const { handleSocketReconnect, loadMessage, deleteCommunity, ApproveRequest, DeleteMember, outCommunity, getCommunityByHostId } = useChatUtils();
  const { Base_URL, socket, Base_AVA } = useConfig();
  const { getToken } = UseCookie();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { BackIcon, UserGroupIcon, OptionsIcon, ExitCommunityIcon, SendIcon, UserXMark } = useIconUtils();
  const { access_token } = getToken();
  const { show } = useContextMenu();
  const userId = localStorage.getItem("userId");
  const { t } = useTranslation();
  const { chatId } = useParams();
  const converChosen = useSelector((state) => state.social.currentChat);
  const [chatInfo, setChatInfo] = useState();
  const [communityInfo, setCommunityInfo] = useState();
  const [newMessage, setNewMessage] = useState("");
  const [chatContent, setChatContent] = useState([]);
  const [openApprovedList, setOpenApprovedList] = useState(false);
  const [openEditMember, setOpenEditMember] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const sendMessage = async (sendUserId, receiveUserId, content) => {
    if (!content || content.trim() === "" || sendUserId === receiveUserId) {
      return;
    }

    try {
      const response = await axios.post(
        `${Base_URL}/messages/sendMessage`,
        {
          sendUser: { id: sendUserId },
          receiveUserId: receiveUserId,
          content: content,
        },
        {
          headers: { Authorization: `Bearer ${access_token}` },
        }
      );

      if (response.status !== 200) {
        throw new Error("Failed to send message");
      }
      setNewMessage("");
      socket.emit("send_message", {
        sendUser: { id: sendUserId },
        receiveUserId: receiveUserId,
        content: content,
      });

      await handleLoadmessage(sendUserId, receiveUserId)
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
    try {
      const res = await ApproveRequest(userId, requestId, isApprove);
      if (res.status === 200 && res.data == true) {
        message.success(t("message.approveUserSuccess"), 2);
        setRefresh(true);
        dispatch(setRefreshChat(true));
      } else if (res.status === 200 && res.data == false) {
        message.success(t("message.rejectUserSuccess"), 2);
      }
    } catch (error) {
      console.error("Error approving member:", error);
      message.error(t("message.approveUserFailed"), 2);
    }
  };

  const handleDeleteMember = async (userId, communityId) => {
    console.log("Delete Member", userId, communityId);
    try {
      const res = await DeleteMember(userId, communityId);
      if (res === 200) {
        message.success(t("message.removeUserSuccess"), 2);
        setRefresh(true);
        dispatch(setRefreshChat(true));
      }
    } catch (error) {
      console.error("Error deleting member:", error);
      message.error(t("message.removeUserFailed"), 2);
    }
  };

  const handleOutCommunity = async (userId, communityId, communityName) => {
    try {
      const res = await outCommunity(userId, communityId);
      if (res === 200) {
        message.success(`${t("message.leaveCommunity")} ${communityName} ${t("message.successfully")}`);
        dispatch(setRefreshChat(true));
        navigate("/chat");
      }
    } catch (error) {
      console.error("Error leaving community:", error);
      message.error(`${t("message.failedToLeaveCommunity")} ${communityName}`);
    }
  };

  const handleDeleteCommunity = async (communityId) => {
    try {
      const res = await deleteCommunity(communityId);
      if (res === 200) {
        message.success(t("message.deleteCommunitySuccess"), 2);
        dispatch(setRefreshChat(true));
        navigate("/chat");
      }
    } catch (error) {
      console.error("Error deleting community:", error);
      message.error(t("message.deleteCommunityFailed"), 2);
    }
  };

  const handleLoadmessage = async (userId, chatId) => {
    try {
      // console.log("handle Load Messages", userId, chatId);
      const data = await loadMessage(userId, chatId);
      // console.log("handle Load Messagesssssssssssssss", data);
      dispatch(setIsNewMessage(true));
      setChatContent(data);
      setRefresh(false);
    } catch (error) {
      console.error("Error loading messages:", error);
    }
  };

  // Load chat content when the component mounts or the chat changes
  useEffect(() => {
    if (converChosen !== null && userId !== null) {
      setChatInfo(converChosen);
      handleLoadmessage(userId, chatId);
    }
  }, [chatId, converChosen, userId, refresh]);

  // Load chat content when refresh is true
  // useEffect(() => {
  //   if (refresh == true) {
  //     handleLoadmessage(userId, chatId).then(() => {
  //       setRefresh(false);
  //     });
  //   }
  // }, [refresh, userId, chatId]);

  // Get community info when the component mounts or the chat changes
  useEffect(() => {
    if (converChosen?.communityId) {
      getCommunityByHostId(converChosen.communityId).then((res) => {
        console.log("Community Info", res);
        setCommunityInfo(res);
      });
    }
  }, [chatId, refresh, openApprovedList, openEditMember, converChosen]);

  useEffect(() => {
    if (socket) {
      handleSocketReconnect(socket);
    }
  }, [socket]);

  useEffect(() => {
    if (socket) {
      const receiveMessageHandler = async () => {
        await handleLoadmessage(userId, chatId);
        dispatch(setIsNewMessage(true));
      };

      socket.on("receive_message", receiveMessageHandler);

      return () => {
        socket.off("receive_message", receiveMessageHandler);
        socket.disconnect();
      };
    }
  }, [socket, userId, chatId]);

  return (
    <div className="">
      <div className="fixed flex flex-row items-center justify-between w-screen h-20 pl-3 bg-slate-50 dark:bg-backgroundChattingInputNavDark">
        <div className="flex flex-row items-center ">
          <BackIcon url={"/chat"}></BackIcon>
          <div className="w-10">
            <img
              src={`${chatInfo?.avatar ? chatInfo.avatar : Base_AVA}`}
              alt="user"
              className="bg-white rounded-full"
            />
          </div>
          <h2 className="z-50 flex items-center h-full pl-3 font-bold text-primary dark:text-primaryDarkmode ">
            {chatInfo?.communityName ? chatInfo?.communityName : chatInfo?.userName}
          </h2>
        </div>

        {chatInfo?.communityId === userId &&
          <div className="sticky right-0 flex flex-row items-center gap-4 px-4 text-primary dark:text-primaryDarkmode">
            <div className="cursor-pointer" onClick={setOpenEditMember}>
              <UserXMark></UserXMark>
            </div>
            <div className="cursor-pointer" onClick={setOpenApprovedList}>
              <UserGroupIcon></UserGroupIcon>
            </div>
            <div className="cursor-pointer" onClick={(e) => displayMenu(e, chatInfo.communityId)}>
              <OptionsIcon></OptionsIcon>
            </div>
          </div>
        }
        {chatInfo?.communityId !== null && chatInfo?.communityId !== userId && chatInfo?.chatId !== null && chatInfo?.chatId !== userId &&
          <div className="sticky right-0 flex flex-row items-center gap-2 px-4 text-primary dark:text-primaryDarkmode">
            <div className="cursor-pointer" onClick={() => handleOutCommunity(userId, chatInfo.chatId, chatInfo.userName)}>
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
      <div className={`fixed w-screen bottom-0 gap-3 p-3 sm:p-2 bg-slate-50 dark:bg-backgroundChattingInputNavDark`}
      >
        <div className="flex flex-row items-center justify-center w-full gap-2 sm:pr-0 md:pr-0 xl:pr-80">
          <div className="flex-grow">
            <input
              type="text"
              className="w-full p-3 rounded-md outline-none dark:text-primaryTextDark2 dark:bg-backgroundComponentDarkPrimary"
              placeholder={t("chat.inputChatPlaceholder")}
              value={newMessage}
              onChange={handleMessageChange}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  sendMessage(userId, chatId, newMessage);
                }
              }}
            />
          </div>

          <button
            className="sticky p-3 text-white rounded-md right-2 bg-primary hover:opacity-50 dark:bg-primaryDarkmode"
            onClick={() => sendMessage(userId, chatId, newMessage)}>
            <SendIcon></SendIcon>
          </button>
        </div>
      </div>

      {/*  End of chat input area */}
      <Menu id={`communityOption_${chatInfo?.communityId}`} className='contexify-menu'>
        <Item onClick={() => handleDeleteCommunity(chatInfo.communityId)}
        >
          {t("chat.deleteCommunity")}
        </Item>
      </Menu>
      {/* Approved List */}
      <ModalApprove
        openApprovedList={openApprovedList}
        setOpenApprovedList={setOpenApprovedList}
        converChosen={communityInfo}
        handleApproveRequest={handleApproveRequest}
      ></ModalApprove>
      <ModalEditMember
        openEditMember={openEditMember}
        setOpenEditMember={setOpenEditMember}
        converChosen={communityInfo}
        handleDeleteMember={handleDeleteMember}
      ></ModalEditMember>
    </div>
  );
};

export default ChatArea;
