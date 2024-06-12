import { Outlet } from "react-router-dom";
import ChatNavigate from "../../components/Chat/ChatNavigate";
import { useSelector } from "react-redux";
import useConfig from "../../utils/useConfig";
import AuthorizationModal from "../../components/AuthorizationModal";
import { useEffect } from "react";

const ChattingPage = () => {
  const { isMobile } = useConfig();
  const chatId = useSelector((state) => state.social.currentChat.chatId);
  const userRole = localStorage.getItem("userRole");

  useEffect(() => {
    if (userRole == "ADMIN") {
      window.location.href = "/cms";
    }
  }, [userRole]);
  return (
    <div className="bg-backgroundPrimary dark:bg-backgroundDarkPrimary">
      {/* Desktop Layout */}
      {!isMobile && (
        <div className="flex flex-row w-full h-full min-h-screen min-w-screen">
          <div className="">
            <ChatNavigate></ChatNavigate>
          </div>
          <div className="flex-auto max-w-full">
            <Outlet></Outlet>
          </div>
        </div>
      )}
      {/* End Desktop Layout */}
      {/* Mobile Layout */}
      {isMobile && chatId == undefined && chatId == null && (
        <div className="flex w-full h-full min-h-screen ">
          <ChatNavigate></ChatNavigate>
        </div>
      )}
      {
        isMobile && chatId != undefined && chatId != null &&
        <Outlet></Outlet>
      }
      {/* End Mobile Layout  */}
      <AuthorizationModal isAdmin={false}></AuthorizationModal>
    </div>
  );
};

export default ChattingPage;
