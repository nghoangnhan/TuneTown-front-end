/* eslint-disable no-unused-vars */
import { theme } from "antd";
import { Content } from "antd/es/layout/layout";
import { Outlet, useParams } from "react-router-dom";
import EditInfor from "./EditInfor";
import RegisterTopic from "./UserManagement";
import BrowserTopic from "./SongManagement";

const ContentPage = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const params = useParams();
  return (
    <Content
      className="h-screen"
      style={{
        margin: "24px 16px 0",
      }}
    >
      <div
        style={{
          padding: 24,
          minHeight: 360,
          background: colorBgContainer,
        }}
        className="h-fit"
      >
        <Outlet></Outlet>
      </div>
    </Content>
  );
};

export default ContentPage;
