/* eslint-disable no-unused-vars */
import { theme } from "antd";
import { Content } from "antd/es/layout/layout";
import { Outlet, useParams } from "react-router-dom";
import EditInfor from "./EditInforCMS";
import RegisterTopic from "./UserManagement";
import BrowserTopic from "./SongManagement";
import FooterSection from "../../FooterSection";

const ContentPage = () => {
  const params = useParams();
  return (
    <Content
      className=" bg-backgroundPrimary dark:bg-backgroundDarkPrimary text-primaryText2 dark:text-primaryTextDark2"
    >
      <div
        style={{
          padding: 24,
          minHeight: 360,
        }}
      >
        <Outlet></Outlet>
        <FooterSection></FooterSection>
      </div>
    </Content>
  );
};

export default ContentPage;
