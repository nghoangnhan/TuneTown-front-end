import { EditOutlined, UserOutlined, GlobalOutlined, PlayCircleOutlined, GroupOutlined } from "@ant-design/icons";
import { Menu } from "antd";
import { useNavigate } from "react-router-dom";
import UseCookie from "../../hooks/useCookie";

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
    getItem("User Management", "user-management", <UserOutlined />),
    getItem("Post Management", "post-management", <GlobalOutlined />),
    getItem("Song Management", "song-management", <PlayCircleOutlined />),
    getItem("Playlist Management", "playlist-management", <GroupOutlined />),
  ];
  const handleContents = (data) => {
    switch (data.key) {
      case "profile":
        navigate(`/cms/${data.key}`);
        break;
      case "user-management":
        navigate(`/cms/${data.key}`);
        break;
      case "song-management":
        navigate(`/cms/${data.key}`);
        break;
      case "playlist-management":
        navigate(`/cms/${data.key}`);
        break;
      case "post-management":
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
