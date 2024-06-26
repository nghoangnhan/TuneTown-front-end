/* eslint-disable no-unused-vars */
import axios from "axios";
import UseCookie from "../hooks/useCookie";
import useConfig from "./useConfig";
import { useDispatch } from "react-redux";
import { setChatChosen } from "../redux/slice/social";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import useUserUtils from "./useUserUtils";
import { useTranslation } from "react-i18next";

// CHAT UTILS 
export const useChatUtils = () => {
  const { getToken } = UseCookie();
  const { access_token } = getToken();
  const { Base_URL } = useConfig();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
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
  //   let interval;

  //   const handleConnect = () => {
  //     console.log("Connected to server");
  //     if (interval) {
  //       clearInterval(interval); // Clear interval on successful reconnection
  //       interval = null;
  //     }
  //   };

  //   const handleDisconnect = () => {
  //     console.log("Disconnected from server");
  //     // Reconnect to the server
  //     interval = setInterval(() => {
  //       socket.connect();
  //     }, 1000);
  //   };

  //   // Listen for connect and disconnect events
  //   socket.on("connect", handleConnect);
  //   socket.on("disconnect", handleDisconnect);

  //   // Clean up event listeners
  //   return () => {
  //     if (interval) {
  //       clearInterval(interval); // Clear interval when cleaning up
  //     }
  //     socket.off("connect", handleConnect);
  //     socket.off("disconnect", handleDisconnect);
  //   };
  // };
  const handleSocketReconnect = (socket) => {
    const handleConnect = () => {
      console.log("Connected to server");
    };

    const handleDisconnect = () => {
      console.log("Disconnected from server");
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
            id: sendUserId
          },
          receiveUserId: receiveUserId,
        },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      const messages = response.data;
      // console.log("MESSAGES", messages);
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
          // console.log("MESSAGES ", messages);
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
      if (!userId || !communityId) return;
      if (confirm(t("confirmModal.leaveCommunity")) === false) return;
      const response = await axios.post(
        `${Base_URL}/community/outCommunity?userId=${userId}&communityId=${communityId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      return response.status;
    } catch (error) {
      console.log("Error:", error);
    }
  }

  const createCommunity = async (artistId, userName) => {
    try {
      const response = await axios.post(
        `${Base_URL}/community/create`,
        {
          communityId: artistId,
          communityName: `${userName}'s community`,
          host: {
            id: artistId
          },
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
  const searchCommunityByName = async (communityName) => {
    try {
      const response = await axios.get(
        `${Base_URL}/community/searchByName?communityName=${communityName}`,
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
  }

  const deleteConversation = async (userId, sentUser) => {
    try {
      if (confirm(t("confirmModal.deleteConver")) === false) return;
      const response = await axios.delete(
        `${Base_URL}/messages`,
        {
          data: {
            userId: userId,
            sentUser: [sentUser]
          },
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      return response;
    } catch (error) {
      console.log("Error:", error);
    }
  }

  const deleteCommunity = async (communityId) => {
    try {
      if (!communityId) return;
      if (confirm(t("confirmModal.deleteCommunity")) === false) return;
      const response = await axios.delete(
        `${Base_URL}/community?hostId=${communityId}`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      return response.data;
    }
    catch (error) {
      console.log("Error:", error);
    }
  }

  const ApproveRequest = async (userId, userRequest, isApprove) => {
    // console.log("Approve Request", userId, userRequest, isApprove);
    try {
      const response = await axios.post(
        `${Base_URL}/community/approve`,
        {
          "isApprove": isApprove === true ? 1 : 0, // 1: Approve, 0: Refuse
          "host": {
            "id": userId
          },
          "approveUser": {
            "id": userRequest
          },
        },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      return response;
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const DeleteMember = async (userId, communityId) => {
    try {
      if (!userId || !communityId) return;
      if (confirm(t("confirmModal.removeUser")) === false) return;
      const response = await axios.post(
        `${Base_URL}/community/outCommunity?userId=${userId}&communityId=${communityId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      return response.status;
    } catch (error) {
      console.log("Error:", error);
    }
  }

  return {
    AcronymName,
    loadMessage,
    handleSocketReconnect,
    handleNavigate,
    getCommunityByHostId,
    joinRequest,
    outCommunity,
    createCommunity,
    searchCommunityByName,
    getCommunityByArtist,
    deleteConversation, deleteCommunity, ApproveRequest, DeleteMember
  };
};

// FORUM UTILS
export const useForumUtils = () => {
  const { getToken } = UseCookie();
  const { access_token } = getToken();
  const { Base_URL, Base_URL_FE } = useConfig();
  const userId = localStorage.getItem("userId");

  // Get All Post API
  const getAllPost = async (page) => {
    try {
      const response = await axios.get(`${Base_URL}/post?page=${page ? page : ""}`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      // console.log("POST", response.data);
      return response.data;
    } catch (error) {
      console.log("Error:", error);
    }
  };

  // Get All Post Admin
  const getAllPostAdmin = async () => {
    try {
      const response = await axios.get(`${Base_URL}/post/getPostsByAdmin`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      // console.log("POST", response.data);
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
  // const createPost = async (post) => {
  //   try {
  //     const response = await axios.post(
  //       `${Base_URL}/post/create`,
  //       {
  //         author: { id: post.author.id },
  //         content: post.content,
  //         postContent: post.content,
  //         song: { id: post.song.id },
  //         playlist: { id: post.playlist.id },
  //         likes: null,
  //         listCommetnts: null,
  //         mp3Link: ''
  //       },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${access_token}`,
  //         },
  //       }
  //     );

  //     return response.data;
  //   } catch (error) {
  //     console.log("Error:", error);
  //   }
  // };

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
      if (!postId) return;
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

  const handleSharePost = (item,) => {
    try {
      // const currentUrl = window.location.href;    
      const songUrl = `${Base_URL_FE}/forum/${parseInt(item.id)}`;
      navigator.clipboard.writeText(songUrl);
      message.success("Link copied!");
    } catch (error) {
      message.error("Error when coppying post link!!");
      console.error('Error:', error);
    }
  };

  return {
    getAllPost,
    getPostById,
    // createPost,
    updatePost,
    deletePost,
    createComment,
    createReply,
    likePost,
    AcronymPost,
    scrollToBottom,
    handleCheckLiked,
    getCommentById, handleSharePost, getAllPostAdmin
  };
};

export default useChatUtils;
