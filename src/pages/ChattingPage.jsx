import { Outlet } from "react-router-dom";
import ChatNavigate from "../components/Chat/ChatNavigate";
// import ChatNavigate from "../components/Chat/ChatNavigate";
// import ChatArea from "../components/Chat/ChatArea";
const ChattingPage = () => {
  return (
    <div className="flex flex-row min-h-screen h-full min-w-screen w-full">
      <ChatNavigate></ChatNavigate>
      <Outlet></Outlet>
    </div>
  );
};

export default ChattingPage;
