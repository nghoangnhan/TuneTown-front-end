import { EditOutlined, UserOutlined, GlobalOutlined, PlayCircleOutlined, GroupOutlined } from "@ant-design/icons";
import { Menu } from "antd";
import { useNavigate } from "react-router-dom";
import UseCookie from "../../hooks/useCookie";
import useIconUtils from "../../utils/useIconUtils";

const LeftSideBar = () => {
  const navigate = useNavigate();
  // const dispatch = useDispatch();
  // const { Base_AVA  } = useConfig();
  const { removeToken } = UseCookie();

  function getItem(label, key, icon, children) {
    return { label, key, icon, children };
  }
  const siderItems = [
    getItem("Profile Edit", "profile", <EditOutlined />),
    getItem("User Management", "usermanagement", <UserOutlined />),
    getItem("Post Management", "postmanagement", <GlobalOutlined />),
    getItem("Song Management", "songmanagement", <PlayCircleOutlined />),
    getItem("Playlist Management", "playlistmanagement", <GroupOutlined />),
  ];
  const handleContents = (data) => {
    switch (data.key) {
      case "profile":
        navigate(`/cms/${data.key}`);
        break;
      case "usermanagement":
        navigate(`/cms/${data.key}`);
        break;

      case "songmanagement":
        navigate(`/cms/${data.key}`);
        break;
      case "logout":
        removeToken();
        navigate("/");
        break;
      default:
        break;
    }
  };
  return (
    <Menu
      className="w-full h-full pt-14 dark:bg-backgroundComponentDarkPrimary text-primaryText2 dark:text-primaryTextDark2 bg-backgroundComponentPrimary"
      mode="inline"
      defaultSelectedKeys={["0"]}
      items={siderItems}
      onClick={(e) => handleContents(e)}
    >
    </Menu>
  );
};

export default LeftSideBar;
