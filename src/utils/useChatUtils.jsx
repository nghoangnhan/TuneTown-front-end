/* eslint-disable no-unused-vars */
import axios from "axios";
import UseCookie from "../hooks/useCookie";
import useConfig from "./useConfig";
import { useDispatch } from "react-redux";
import { setChatChosen } from "../redux/slice/social";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import useUserUtils from "./useUserUtils";

export const useChatUtils = () => {
  const { getToken } = UseCookie();
  const { access_token } = getToken();
  const { Base_URL } = useConfig();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userId = parseInt(localStorage.getItem("userId"), 10);
  const { getUserInfor } = useUserUtils();

  // Acronym the name of the song
  const AcronymName = (nameLenght, length) => {
    if (nameLenght && nameLenght.length > 10) {
      return nameLenght.slice(0, length) + "...";
    } else {
      return nameLenght;
    }
  };

  // const handleSocketReconnect = (socket) => {
  //   const handleConnect = () => {
  //     console.log("Connected to server");
  //     clearInterval(reconnectInterval);
  //   };

  //   const handleDisconnect = () => {
  //     console.log("Disconnected from server");
  //     // Reconnect to the server
  //     socket.connect();
  //   };

  //   // Set up event listeners for connection and disconnection
  //   socket.on("connect", handleConnect);
  //   socket.on("disconnect", handleDisconnect);

  //   // Function to start the reconnect process
  //   const startReconnect = () => {
  //     console.log("Reconnecting to server...");
  //     socket.connect();
  //   };

  //   // Set up a reconnect interval
  //   let reconnectInterval;

  //   const reconnect = () => {
  //     if (!socket.connected) {
  //       console.log("Attempting to reconnect...");
  //       startReconnect();
  //     }
  //   };

  //   // Start the reconnect interval
  //   reconnectInterval = setInterval(reconnect, 1000);

  //   // Return a cleanup function
  //   return () => {
  //     clearInterval(reconnectInterval);
  //     socket.off("connect", handleConnect);
  //     socket.off("disconnect", handleDisconnect);
  //   };
  // };

  const handleSocketReconnect = (socket) => {
    // Help me fix this function
    const handleConnect = () => {
      console.log("Connected to server");
    };
    const handleDisconnect = () => {
      console.log("Disconnected from server");
      // Reconnect to the server
      const interval = setInterval(() => {
        socket.connect();
      }, 1000);

      return () => clearInterval(interval);
    };

    // Listen for connect and disconnect events
    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

    // Clean up event listeners
    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
    };
  };


  // Use chatID to fetch chat content from server
  const loadMessage = async (sendUserId, receiveUserId) => {
    try {
      const response = await axios.post(
        `${Base_URL}/messages/loadMessage`,
        {
          sendUser: {
            id: parseInt(sendUserId)
          },
          receiveUserId: parseInt(receiveUserId),
        },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      const messages = response.data;
      console.log("MESSAGES", messages);
      if (response.status !== 200) {
        throw new Error("Failed to fetch messages");
      }

      // Extract the necessary information from the regular message response
      const updatedChatContent = [];
      for (const key in messages) {
        const message = messages[key];
        // If community
        if (message.community) {
          const isSystemMessage = message.message.receiveUserId === message.community.id;
          console.log("MESSAGES ", messages);
          for (const msg of message.community.communityMessages) {
            const own = userId === msg.sendUser.id;
            const name = msg.type == 2 ? "SYSTEM MESSAGE" : (own ? " " : msg.sendUser.userName);
            updatedChatContent.push({
              id: message.community.id,
              name: name,
              own: own,
              message: msg.content,
              time: new Date(msg.messageDate).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
              avatar: "",
              sentUserAvatar: msg.sendUser.avatar,
              seen: msg.seen,
              type: msg.type
            });
          }
        }
        else {
          const own = userId === message.message.sendUser.id;
          const name = own ? " " : message.sentUser.userName;
          updatedChatContent.push({
            id: message.sentUser.id,
            name: name,
            own: own,
            message: message.message.content,
            time: new Date(message.message.messageDate).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            avatar: message.message.sendUser.avatar,
            sentUserAvatar: message.sentUser.avatar,
            seen: message.message.seen,
            type: message.message.type
          });
        }
      }
      // console.log("UPDATE ", updatedChatContent);
      return updatedChatContent;
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };
  const handleNavigate = (path, artistDetail) => {
    dispatch(
      setChatChosen({
        chatId: path,
        name: artistDetail.name,
        avatar: artistDetail.avatar,
      })
    );
    navigate(`/chat/${path}`);
  };
  const getCommunityByHostId = async (hostId) => {
    try {
      const response = await axios.get(
        `${Base_URL}/community/getByHostId?hostId=${hostId}`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.log("Error:", error);
    }
  };
  const joinRequest = async (userId, communityId) => {
    try {
      const response = await axios.post(
        `${Base_URL}/community/joinRequest?userId=${userId}&communityId=${communityId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.log("Error:", error);
    }
  };
  const outCommunity = async (userId, communityId) => {
    try {
      const response = await axios.post(
        `${Base_URL}/community/outCommunity?userId=${userId}&communityId=${communityId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.log("Error:", error);
    }
  };
  const createCommunity = async (artistId) => {
    try {
      const response = await axios.post(
        `${Base_URL}/community/create`,
        {
          communityId: artistId,
          communityName: "Your community",
          hosts: [{
            id: artistId
          }],
          joinUsers: [{
            id: artistId
          }],
          approveRequests: null,
          communityAvatar: ''
        },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.log("Error:", error);
    }
  };
  const getCommunityByArtist = async (artistId) => {
    try {
      const response = await axios.get(
        `${Base_URL}/community/getByHostId?hostId=${artistId}`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.log("Error:", error);
    }
  };
  return {
    AcronymName,
    loadMessage,
    handleSocketReconnect,
    handleNavigate,
    getCommunityByHostId,
    joinRequest,
    outCommunity,
    createCommunity,
    getCommunityByArtist
  };
};

export const useForumUtils = () => {
  const { getToken } = UseCookie();
  const { access_token } = getToken();
  const { Base_URL } = useConfig();
  const userId = parseInt(localStorage.getItem("userId"), 10);

  // Get All Post API
  const getAllPost = async () => {
    try {
      const response = await axios.get(`${Base_URL}/post`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });

      return response.data;
    } catch (error) {
      console.log("Error:", error);
    }
  };

  // Get Post By ID API
  const getPostById = async (postId) => {
    try {
      const response = await axios.get(
        `${Base_URL}/post/getById?postId=${postId}`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.log("Error:", error);
    }
  };

  // Create Post API
  const createPost = async (post) => {
    try {
      const response = await axios.post(
        `${Base_URL}/post`,
        {
          author: { id: post.author },
          content: post.content,
          postContent: post.content,
          song: { id: post.song },
          playlist: { id: post.playlist },
          likes: 0,
          dislikes: 0,
          listCommetnts: null,
        },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const updatePost = async (post) => {
    try {
      const response = await axios.put(
        `${Base_URL}/post`,
        {
          "id": post.postId,
          "author": {
            "id": post.authorId,
          },
          "content": post.postContent,
          "song": {
            "id": post.songId
          },
          "playlist": {
            "id": post.playistId
          }
        },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.log("Error:", error);
    }
  };


  const deletePost = async (postId) => {
    try {
      const response = await axios.delete(
        `${Base_URL}/post?postId=${postId}`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      if (response.status === 200) {
        message.success("Delete post successfully!");
        return true;
      }
      message.error("Delete post failed!");
      return false;
    }
    catch (error) {
      console.log("Error:", error);
    }
  }


  // Create Comment API
  const createComment = async (value) => {
    try {
      const response = await axios.post(
        `${Base_URL}/post/addComment?postId=${value.postId}`,
        {
          author: { id: value.author },
          content: value.content,
          likes: 0,
          dislikes: 0,
          reply: null,
        },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.log("Error:", error);
    }
  };

  // Create Comment API
  const createReply = async (value) => {
    try {
      const response = await axios.post(
        `${Base_URL}/post/addReply?postId=${value.postId}&commentId=${value.commentId}`,
        {
          author: { id: value.author },
          content: value.content,
          likes: 0,
          dislikes: 0,
          reply: null,
        },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const likePost = async (value) => {
    try {
      const response = await axios.post(
        `${Base_URL}/post/likePost?userId=${value.userId}&postId=${value.postId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const getCommentById = async (value) => {
    try {
      const response = await axios.get(
        `${Base_URL}/post/comment/getById?commentId=${value}`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const AcronymPost = (nameLenght, length) => {
    if (nameLenght && nameLenght.length > 10) {
      return nameLenght.slice(0, length) + "...";
    } else {
      return nameLenght;
    }
  };

  const scrollToBottom = (windownEndRef) => {
    windownEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleCheckLiked = (likes) => {
    if (!likes) return;
    return !!likes.find((like) => like.id === userId);
  };
  const handleSharePost = (item, inside) => {
    try {
      const currentUrl = window.location.href;
      if (inside == true) {
        const songUrl = `${currentUrl}`;
        navigator.clipboard.writeText(songUrl);
        message.success("Link copied!");
      }
      else {
        const songUrl = `${currentUrl}/${item.id}`;
        navigator.clipboard.writeText(songUrl);
        message.success("Link copied!");
      }
    } catch (error) {
      message.error("Error when coppying post link!!");
      console.error('Error:', error);
    }
  };

  return {
    getAllPost,
    getPostById,
    createPost,
    updatePost,
    deletePost,
    createComment,
    createReply,
    likePost,
    AcronymPost,
    scrollToBottom,
    handleCheckLiked,
    getCommentById, handleSharePost,
  };
};

export default useChatUtils;
