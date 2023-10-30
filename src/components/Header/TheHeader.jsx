import { useEffect, useState } from "react";
import { Avatar, Modal } from "antd";
// import { NavLink } from "react-router-dom";
import { UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import UseCookie from "../../hooks/useCookie";
import { Base_Ava } from "../../api/config";
import { setUserId } from "../../redux/slice/account";
import { useDispatch } from "react-redux";

const TheHeader = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [modalOpen, setModalOpen] = useState(false);
  const { removeToken } = UseCookie();
  const srcAva = Base_Ava;

  const userId = localStorage.getItem("userId");
  dispatch(setUserId(userId));
  const userName = localStorage.getItem("userName");
  const userRole = localStorage.getItem("userRole");

  console.log("The Header || UserInfor", userId, userName, userRole);

  const handleOnclick = (direction) => {
    navigate(`/${direction}`);
    setModalOpen(false);
  };
  // Log Out
  const LogOut = () => {
    removeToken();
    navigate("/");
  };
  useEffect(() => {
    // HandleUserData(userIdReduce, userNameReduce, userRoleReduce);
  }, []);
  return (
    <header className="w-full h-[60px] xl:w-full xl:h-[60px] py-1 gap-x-7 flex justify-center items-center font-bold bg-[#ecf2fd]">
      <div className="xl:right-5 xl:mt-5 right-3 absolute flex flex-row justify-center items-center">
        {
          <div>
            {userRole === "ADMIN" && (
              <div className="text-[#f24e4e] font-bold flex flex-row justify-center items-center p-1 border border-[#f24e4e] border-solid rounded-md mr-3">
                Admin
              </div>
            )}
            {userRole === "USER" && (
              <div className="text-[#359254] font-bold flex flex-row justify-center items-center p-1 border border-[#359254] border-solid rounded-md mr-3">
                User
              </div>
            )}
            {userRole === "ARTIST" && (
              <div className="text-[#3f3ca0] font-bold flex flex-row justify-center items-center p-1 border border-[#3f3ca0] border-solid rounded-md mr-3">
                Artist
              </div>
            )}
          </div>
        }
        <span className="xl:block hidden mr-3 text-[#505050] cursor-default">
          {userName ? userName : "Unknown User"}
        </span>

        {srcAva && (
          <button className="cursor-pointer" onClick={() => setModalOpen(true)}>
            <Avatar
              icon={<UserOutlined />}
              className="border-[3px] border-[#2c2a2a] "
              size="large"
              src={<img src={srcAva} alt="avatar" />}
            />
          </button>
        )}
        {!srcAva && (
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
        className="text-[#359254] font-bold flex flex-row justify-center items-center"
      >
        {userRole == "ARTIST" && (
          <div
            onClick={() => handleOnclick("upload")}
            className="flex justify-center items-center text-blue-950 hover:text-white font-semibold hover:bg-[#45cc79] bg-[#f1f1ef] rounded-lg mt-3 h-10 "
          >
            <button>Upload Song</button>
          </div>
        )}
        <div
          onClick={() => handleOnclick("editUser")}
          className="flex justify-center items-center text-blue-950 hover:text-white font-semibold hover:bg-[#45cc79] bg-[#f1f1ef] rounded-lg mt-3 h-10  "
        >
          <button>Edit User Information</button>
        </div>
        <div className="flex justify-center items-center text-blue-950 hover:text-white font-semibold hover:bg-[#45cc79] bg-[#f1f1ef] rounded-lg mt-3 h-10  ">
          <button onClick={LogOut}>Log Out</button>
        </div>
      </Modal>
    </header>
  );
};

export default TheHeader;
