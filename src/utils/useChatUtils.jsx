/* eslint-disable no-unused-vars */
import axios from "axios";
import UseCookie from "../hooks/useCookie";
import useConfig from "./useConfig";
import { useDispatch } from "react-redux";
import { setChatChosen } from "../redux/slice/social";
import { useNavigate } from "react-router-dom";

export const useChatUtils = () => {
  const { getToken } = UseCookie();
  const { access_token } = getToken();
  const { Base_URL } = useConfig();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userId = parseInt(localStorage.getItem("userId"), 10);

  // Acronym the name of the song
  const AcronymName = (nameLenght, length) => {
    if (nameLenght && nameLenght.length > 10) {
      return nameLenght.slice(0, length) + "...";
    } else {
      return nameLenght;
    }
  };

  const handleSocketReconnect = (socket) => {
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
          sendUserId: parseInt(sendUserId),
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
      // Append the new messages to the chatContent of the found chat
      const updatedChatContent = Object.keys(messages).map((key) => {
        const message = messages[key];
        const own = userId === message.message.sendUserId;
        const name = own ? message.user.userName : message.sentUser.userName;
        return {
          id: message.sentUser.id,
          name: name,
          own: userId === message.message.sendUserId,
          message: message.message.content,
          time: new Date(message.message.messageDate).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          avatar: message.user.avatar,
          sentUserAvatar: message.sentUser.avatar,
          seen: message.message.seen
        };
      });
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
  return { AcronymName, loadMessage, handleSocketReconnect, handleNavigate };
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
        `${Base_URL}/post/updatePost?postId=${post.postId}`,
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
    getCommentById,
  };
};

export default useChatUtils;
