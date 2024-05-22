import { useEffect, useState } from "react";
import { Avatar, Modal } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import UseCookie from "../../hooks/useCookie";
import { setUserId } from "../../redux/slice/account";
import { useDispatch, useSelector } from "react-redux";
import useIconUtils from "../../utils/useIconUtils";
import useUserUtils from "../../utils/useUserUtils";
import DarkMode from "../DarkMode/DarkMode";
import useConfig from "../../utils/useConfig";
import { useTranslation } from "react-i18next";

const TheHeader = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { ChatButton } = useIconUtils();
  const { removeToken } = UseCookie();
  const { getUserInfor } = useUserUtils();
  const { Base_AVA } = useConfig();
  const refreshAccount = useSelector((state) => state.account.refreshAccount);
  const userRole = localStorage.getItem("userRole");
  const userId = localStorage.getItem("userId");
  const [modalOpen, setModalOpen] = useState(false);
  const [userInfor, setUserInfor] = useState({});
  dispatch(setUserId(userId));
  const { t } = useTranslation();

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

  useEffect(() => {
    if (refreshAccount === true) {
      getUserInfor(userId).then((res) => {
        setUserInfor(res.user);
        localStorage.setItem("userName", res.user.userName);
        // console.log("The Header || UserInfor", res.user);
      });
    }
  }, [refreshAccount]);

  return (
    <header className="sticky top-0 z-50 w-full h-[60px] xl:w-full py-1 gap-x-7 flex justify-center items-center font-bold bg-backgroundPrimary dark:bg-backgroundDarkPrimary">
      <div className="absolute flex flex-row items-center justify-center mt-2 xl:right-5 right-3">
        {/* <div>
          <DarkMode></DarkMode>
        </div> */}
        <div
          className="flex items-center justify-center w-10 h-10 mt-1 mr-2 text-xl font-bold rounded-lg cursor-pointer text-iconText dark:text-iconTextDark hover:text-iconTextHover dark:hover:text-iconTextHoverDark dark:hover:bg-iconBackgroundDark"
          onClick={() => navigate("/chat")}
        >
          <ChatButton></ChatButton>
        </div>
        {
          <div>
            <div
              className={`${userRole === "ADMIN"
                ? "text-[#f24e4e] dark:text-[#ff5050] border-[#f24e4e] dark:border-[#ff5050] font-bold"
                : userRole === "USER"
                  ? "text-primary dark:text-primaryDarkmode border-primary dark:border-primaryDarkmode font-bold"
                  : userRole === "ARTIST"
                    ? "text-[#3f3ca0] dark:text-[#7061ff] border-[#3f3ca0] dark:border-[#7061ff] font-bold"
                    : ""
                } flex justify-center items-center p-1 border border-solid rounded-md mr-3`}
            >
              {userRole === "ADMIN"
                ? "Admin"
                : userRole === "USER"
                  ? "User"
                  : userRole === "ARTIST"
                    ? "Artist"
                    : ""}
            </div>
          </div>
        }
        <span className="hidden mr-3 cursor-default xl:block text-primaryText2 dark:text-white">
          {userInfor.userName ? userInfor.userName : "Unknown User"}
        </span>

        {userInfor.avatar && (
          <button className="cursor-pointer" onClick={() => setModalOpen(true)}>
            <Avatar
              icon={<UserOutlined />}
              className="border-[3px] border-primaryText2 dark:border-primaryTextDark2 "
              size="large"
              src={
                <img
                  src={userInfor.avatar ? userInfor.avatar : Base_AVA}
                  alt="avatar"
                />
              }
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
        title={t("accountOptions.title")}
        centered
        open={modalOpen}
        onOk={() => setModalOpen(false)}
        okButtonProps={{ style: { backgroundColor: "#45cc79" } }}
        onCancel={() => setModalOpen(false)}
        footer={null}
        className="inset-0 flex font-bold modalStyle"
      >
        <div className="w-full h-full text-[#359254]">
          {userRole != "ADMIN" && (
            <div>
              <div
                onClick={() => handleOnclick("my-profile")}
                className="flex items-center justify-center h-10 mt-3 font-semibold rounded-lg dark:text-primaryTextDark2 text-primaryText2 hover:opacity-70 bg-backgroundPlaylistHover dark:bg-backgroundSongItemHoverDark"
              >
                <button>{t("accountOptions.myProfile")}</button>
              </div>
              <div
                onClick={() => handleOnclick("history")}
                className="flex items-center justify-center h-10 mt-3 font-semibold rounded-lg dark:text-primaryTextDark2 text-primaryText2 hover:opacity-70 bg-backgroundPlaylistHover dark:bg-backgroundSongItemHoverDark"
              >
                <button>{t("accountOptions.listenHistory")}</button>
              </div>
            </div>
          )}
          {userRole == "ARTIST" && (
            <div>
              {/* <div
              onClick={() => handleOnclick("upload")}
              className="flex items-center justify-center h-10 mt-3 font-semibold rounded-lg dark:text-primaryTextDark2 text-primaryText2 hover:opacity-70 bg-backgroundPlaylistHover dark:bg-backgroundSongItemHoverDark "
            >
              <button>Upload Song</button>
            </div> */}
              <div
                onClick={() => handleOnclick("artistCMS")}
                className="flex items-center justify-center h-10 mt-3 font-semibold rounded-lg dark:text-primaryTextDark2 text-primaryText2 hover:opacity-70 bg-backgroundPlaylistHover dark:bg-backgroundSongItemHoverDark "
              >
                <button>{t("accountOptions.songManagement")}</button>
              </div>
            </div>
          )}
          <div
            onClick={() => handleOnclick("settings")}
            className="flex items-center justify-center h-10 mt-3 font-semibold rounded-lg dark:text-primaryTextDark2 text-primaryText2 hover:opacity-70 bg-backgroundPlaylistHover dark:bg-backgroundSongItemHoverDark"
          >
            <button>{t("accountOptions.settings")}</button>
          </div>
          <div
            onClick={LogOut}
            className="flex items-center justify-center h-10 mt-3 font-semibold rounded-lg dark:text-primaryTextDark2 text-primaryText2 hover:opacity-70 bg-backgroundPlaylistHover dark:bg-backgroundSongItemHoverDark"
          >
            <button>{t("accountOptions.signOut")}</button>
          </div>
        </div>
      </Modal>
    </header>
  );
};

export default TheHeader;
