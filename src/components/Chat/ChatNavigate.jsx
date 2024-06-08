import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import defaultAva from "../../assets/img/logo/logo.png";
import UseCookie from "../../hooks/useCookie";
import { setChatChosen, setRefreshChat } from "../../redux/slice/social";
import { setIsNewMessage } from "../../redux/slice/social";
import useIconUtils from "../../utils/useIconUtils";
import useConfig from "../../utils/useConfig";
import { useForm } from "antd/es/form/Form";
import { Form, Input } from "antd";
import useDebounce from "../../hooks/useDebounce";
import ListChatSection from "./ListChatSection";
import useChatUtils from "../../utils/useChatUtils";

const ChatNavigate = () => {
  const userId = localStorage.getItem("userId");
  const { searchCommunityByName } = useChatUtils();
  const { getToken } = UseCookie();
  const [form] = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { BackButton } = useIconUtils();
  const { isMobile, Base_URL } = useConfig();
  const { access_token } = getToken();
  const refreshChatList = useSelector((state) => state.social.refreshChatList);
  const converChosen = useSelector((state) => state.social.currentChat);
  const isNewMessage = useSelector((state) => state.social.isNewMessage);
  const [keywordsInput, setKeywordsInput] = useState("");
  const [converList, setConverList] = useState([]);
  const [converListRaw, setChatListRaw] = useState([]);
  const [chatRs, setChatRs] = useState([]);
  const keywordsInputDebounce = useDebounce(keywordsInput, 500);

  const fetchChatList = async () => {
    try {
      const response = await axios.get(
        `${Base_URL}/messages/loadChatList?userId=${userId}`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      const data = await response.data;
      console.log("Fetch Chat List: ", data)
      setChatListRaw(data);

      const sortedData = Object.values(data).sort((a, b) => {
        return (
          new Date(b.lastMessage.messageDate) -
          new Date(a.lastMessage.messageDate)
        );
      });

      const updatedConverList = sortedData.map((item) => {
        let userName = '';
        let message = '';
        let sendId = '';
        let avatar = '';
        const own = userId === item.lastMessage.sendUser.id;
        const userNameParts = item.lastMessage.sendUser.userName.split(" ");
        const userNameFirstWord = userNameParts[0];
        if (!item.community) {
          // If the item contains user information
          userName = item.user.userName;
          sendId = item.user.id;
          avatar = item.user.avatar;
          message = (item.lastMessage.type == 0 && own ? "You: " : " ") + item.lastMessage.content;
        } else {
          // If the item contains community information
          userName = item.community.communityName;
          // Assuming the last message content is retrieved from the lastMessage object
          message = (item.lastMessage.type == 1 && !own ? userNameFirstWord + ": " : " ") + item.lastMessage.content;
          avatar = item.community.communityAvatar;
          sendId = item.community.id;
        }

        return {
          chatId: sendId,
          userName: userName,
          message: message,
          sendId: sendId,
          time: new Date(item.lastMessage.messageDate).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          avatar: avatar,
          seen: item.lastMessage.seen,
          // Add communityId if available
          communityId: item.community ? item.community.communityId : null,
          communityName: item.community ? item.community.communityName : "",
          communityAvatar: item.community ? item.community.communityAvatar : "",
          communityHost: item.community ? item.community.host : "",
          approveRequests: item.community ? item.community.approveRequests : [],
          hosts: item.community ? item.community.hosts : {},
          joinUsers: item.community ? item.community.joinUsers : [],
        };
      });

      setConverList(updatedConverList);
      console.log("Chat Navigate 94 Converlist ", updatedConverList);
    } catch (error) {
      console.error("Error fetching chat list:", error);
    }
  };

  const searchUserByName = async (keywords) => {
    try {
      const response = await axios.get(
        `${Base_URL}/users/getListByName?userName=${keywords}`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      // Handle network errors or other exceptions
      console.error("Error search user:", error.message);
    }
  };

  const searchCommunity = async (keywords) => {
    try {
      const data = searchCommunityByName(keywords);
      return data;
    } catch (error) {
      // Handle network errors or other exceptions
      console.error("Error search community:", error.message);
    }
  };

  const handleSearch = async (keywords) => {
    // Checkk if keywords is empty
    if (keywords === "") return;
    const userList = await searchUserByName(keywords);
    // Remove self from list
    const filteredUserList = userList.filter(user => user.id !== userId);
    const communityList = await searchCommunity(keywords);
    if (filteredUserList?.length === 0 && communityList?.length === 0) return;
    else {
      setChatRs([...filteredUserList, ...communityList]);
    }
  };

  const handleChatItemClick = async (chat) => {
    console.log("Chat Item Click", chat);
    if (!chat.userName) {
      chat.userName = chat.communityName;
    }
    dispatch(setChatChosen(chat));
    navigate(`/chat/${chat.id}`);
    setKeywordsInput('');
  }

  useEffect(() => {
    if (keywordsInputDebounce === "") {
      setChatRs(null);
    }
    if (keywordsInputDebounce) {
      handleSearch(keywordsInputDebounce);
    }
  }, [keywordsInputDebounce]);

  useEffect(() => {
    fetchChatList();
  }, [userId])

  useEffect(() => {
    if (refreshChatList === true) {
      fetchChatList().then(() => {
        dispatch(setRefreshChat(false));
      });
    }
    fetchChatList();
  }, [converChosen.seen, refreshChatList]);

  useEffect(() => {
    if (isNewMessage == true) {
      fetchChatList().then(() => {
        dispatch(setIsNewMessage(false));
      });
    }
    fetchChatList();
  }, [isNewMessage]);

  return (
    <div className={`${isMobile ? "w-full" : "w-80"} sticky top-0 min-h-screen px-1 bg-backgroundComponentPrimary dark:bg-backgroundComponentDarkPrimary border-gray-200  h-fit`}>
      <div
        className="flex flex-row items-center justify-center gap-5 pt-6 text-lg font-bold text-center uppercase cursor-pointer"
        onClick={() => navigate("/")}
      >
        <div>
          <img src={defaultAva} className="h-12 bg-white rounded-full" alt="Logo TuneTown" />
        </div>
        <div className="text-primary dark:text-primaryDarkmode">TuneTown</div>
      </div>

      <div className="relative ">
        <Form className="flex flex-row items-center justify-center gap-3 mt-6" form={form}>
          <Form.Item
            name="search"
            rules={[
              {
                required: false,
              },
            ]}
          >
            <Input
              name="keywords"
              placeholder="Search..."
              onChange={(e) => setKeywordsInput(e.target.value)}
              className="w-full text-lg rounded-md text-primaryText dark:text-primaryTextDark2 "
            />
          </Form.Item>
          {/* <Form.Item>
            <DarkMode></DarkMode>
          </Form.Item> */}
        </Form>
        {/* Render userResults absolutely positioned below the search input */}
        {chatRs && (
          <div className="absolute left-0 right-0 shadow-md bg-backgroundComponentPrimary dark:bg-backgroundComponentDarkPrimary2 top-full">
            <ul className="px-4 py-1">
              {chatRs.map((chat) => (
                <li key={chat.id} className="flex items-center p-2 space-x-2 rounded-md cursor-pointer hover:bg-backgroundPlaylistHover dark:hover:bg-backgroundPlaylistHoverDark"
                  onClick={() => handleChatItemClick(chat)}>
                  <img src={`${chat.avatar ? chat.avatar : defaultAva}`} alt="Chat Avatar" className="w-8 h-8 bg-white rounded-full" />
                  <span className="text-primaryText2 dark:text-primaryTextDark2">{chat.userName ? chat.userName : chat.communityName}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="ml-2">
        <BackButton url={"/"}></BackButton>
      </div>

      {/* Chat List  */}
      <div>
        <ListChatSection chatList={converList} chatListRaw={converListRaw} converChosen={converChosen} ></ListChatSection>
      </div>
    </div>
  );
};

export default ChatNavigate;
