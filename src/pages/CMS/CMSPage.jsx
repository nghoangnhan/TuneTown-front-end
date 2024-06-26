import { Layout } from "antd";
import Sider from "antd/es/layout/Sider";
import LeftSideBar from "../../components/CMS/LeftSideBar";
import ContentPage from "../../components/CMS/pages/ContentPage";
import TheHeader from "../../components/Header/TheHeader";
import AuthorizationModal from "../../components/AuthorizationModal";
import { useEffect } from "react";

const CMSPage = () => {
  const userRole = localStorage.getItem("userRole");
  useEffect(() => {
    if (userRole != "ADMIN") {
      window.location.href = "/";
    }
  }, [userRole]);
  return (
    <div className="">
      <Layout className="">
        <Sider
          breakpoint="lg"
          collapsedWidth="0"
          onBreakpoint={(broken) => {
            // console.log(broken);
          }}
          onCollapse={(collapsed, type) => {
            // console.log(collapsed, type);
          }}
          className=""
        >
          <div className="demo-logo-vertical" />
          <LeftSideBar></LeftSideBar>
        </Sider>
        <Layout className="min-h-screen">
          <TheHeader></TheHeader>
          <ContentPage></ContentPage>
        </Layout>
      </Layout>
      <AuthorizationModal isAdmin={true}></AuthorizationModal>
    </div>
  );
};

export default CMSPage;
