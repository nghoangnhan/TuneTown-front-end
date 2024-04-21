import { useEffect, useState } from "react";
import { Avatar, Modal } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import UseCookie from "../../hooks/useCookie";
import { setUserId } from "../../redux/slice/account";
import { useDispatch } from "react-redux";
import useIconUtils from "../../utils/useIconUtils";
import useUserUtils from "../../utils/useUserUtils";
import DarkMode from "../DarkMode/DarkMode";

const TheHeader = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { ChatButton } = useIconUtils();
  const { removeToken } = UseCookie();
  const { getUserInfor } = useUserUtils();
  const userRole = localStorage.getItem("userRole");
  const userId = localStorage.getItem("userId");
  const [modalOpen, setModalOpen] = useState(false);
  const [userInfor, setUserInfor] = useState({});
  dispatch(setUserId(userId));

  const handleOnclick = (direction) => {
    navigate(`/${direction}`);
    setModalOpen(false);
  };
  // Log Out
  const LogOut = () => {
    removeToken();
    localStorage.clear();
    navigate("/");
  };

  useEffect(() => {
    getUserInfor(userId).then((res) => {
      setUserInfor(res.user);
      localStorage.setItem("userName", res.user.userName);
      console.log("The Header || UserInfor", res.user);
    });
    // HandleUserData(userIdReduce, userNameReduce, userRoleReduce);
  }, [userId]);
  return (
    <header className="w-full h-[60px] xl:w-full xl:h-[60px] py-1 gap-x-7 flex justify-center items-center font-bold bg-backgroundPrimary">
      <div className="absolute flex flex-row items-center justify-center xl:right-5 xl:mt-5 right-3">
        <div>
          <DarkMode></DarkMode>
        </div>
        <div
          className="flex items-center justify-center text-xl mt-1 mr-2 cursor-pointer text-[#505050] font-bold hover:opacity-50 rounded-lg h-10 w-10"
          onClick={() => navigate("/chat")}
        >
          <ChatButton></ChatButton>
        </div>
        {
          <div>
            <div className={`${userRole === "ADMIN" ? "text-[#f24e4e] border-[#f24e4e] font-bold" : (userRole === "USER" ? "text-primary border-primary font-bold" : (userRole === "ARTIST" ? "text-[#3f3ca0] border-[#3f3ca0] font-bold" : ""))} flex justify-center items-center p-1 border border-solid rounded-md mr-3`}>
              {userRole === "ADMIN" ? "Admin" : (userRole === "USER" ? "User" : (userRole === "ARTIST" ? "Artist" : ""))}
            </div>
          </div>
        }
        <span className="xl:block hidden mr-3 text-[#505050] dark:text-white cursor-default">
          {userInfor.userName ? userInfor.userName : "Unknown User"}
        </span>

        {userInfor.avatar && (
          <button className="cursor-pointer" onClick={() => setModalOpen(true)}>
            <Avatar
              icon={<UserOutlined />}
              className="border-[3px] border-[#2c2a2a] "
              size="large"
              src={<img src={userInfor.avatar} alt="avatar" />}
            />
          </button>
        )}
        {!userInfor.avatar && (
          <button className="cursor-pointer" onClick={() => setModalOpen(true)}>
            <Avatar icon={<UserOutlined />} size="large" />
          </button>
        )}
      </div>
      <Modal
        title="Options"
        centered
        open={modalOpen}
        onOk={() => setModalOpen(false)}
        okButtonProps={{ style: { backgroundColor: "#45cc79" } }}
        onCancel={() => setModalOpen(false)}
        footer={null}
        className="text-[#359254] font-bold flex flex-row justify-center items-center"
      >
        {userRole != "ADMIN" && (
          <div
            onClick={() => handleOnclick("editUser")}
            className="flex justify-center items-center text-blue-950 hover:text-white font-semibold hover:bg-[#45cc79] bg-[#f1f1ef] rounded-lg mt-3 h-10"
          >
            <button>Edit User Information</button>
          </div>
        )}
        {userRole == "ARTIST" && (
          <div>
            <div
              onClick={() => handleOnclick("upload")}
              className="flex justify-center items-center text-blue-950 hover:text-white font-semibold hover:bg-[#45cc79] bg-[#f1f1ef] rounded-lg mt-3 h-10 "
            >
              <button>Upload Song</button>
            </div>
            <div
              onClick={() => handleOnclick("artistCMS")}
              className="flex justify-center items-center text-blue-950 hover:text-white font-semibold hover:bg-[#45cc79] bg-[#f1f1ef] rounded-lg mt-3 h-10 "
            >
              <button>Song Management</button>
            </div>
          </div>
        )}

        {userRole != "ADMIN" && (
          <div
            onClick={() => handleOnclick("history")}
            className="flex justify-center items-center text-blue-950 hover:text-white font-semibold hover:bg-[#45cc79] bg-[#f1f1ef] rounded-lg mt-3 h-10"
          >
            <button>Listen History</button>
          </div>
        )}
        <div
          onClick={LogOut}
          className="flex justify-center items-center text-blue-950 hover:text-white font-semibold hover:bg-[#45cc79] bg-[#f1f1ef] rounded-lg mt-3 h-10"
        >
          <button>Log Out</button>
        </div>
      </Modal>
    </header>
  );
};

export default TheHeader;
