import { Outlet, useNavigate } from "react-router-dom";
import ChatNavigate from "../components/Chat/ChatNavigate";
import { useEffect, useState } from "react";
import UseCookie from "../hooks/useCookie";
import { Modal } from "antd";

const ChattingPage = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { getToken } = UseCookie();
  const { access_token } = getToken();
  const handleOK = () => {
    navigate("/");
    setOpen(false);
  };
  const handleRefresh = () => {
    window.location.reload();
  };
  const handleCancel = () => {
    setOpen(false);
  };
  // Check if the user is logged in
  useEffect(() => {
    if (access_token == null) {
      // Message to navigate to login page
      setOpen(true);
      // console.log("CheckCookie", access_token);
    } else {
      // console.log("CheckCookie", access_token);
    }
  }, [access_token]);

  return (
    <div className="flex flex-row w-full h-full min-h-screen min-w-screen">
      <ChatNavigate></ChatNavigate>
      <Outlet></Outlet>

      <Modal
        title="Authorization Error"
        open={open}
        okButtonProps={{
          onClick: handleOK,
          style: { backgroundColor: "#6fa87c", color: "white" },
        }}
        cancelButtonProps={{
          onClick: handleCancel,
        }}
        buttonProps={{
          onClick: handleRefresh,
        }}
      >
        <p>Cannot recognize user</p>
      </Modal>
    </div>
  );
};

export default ChattingPage;
