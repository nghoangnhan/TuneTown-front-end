import { Fragment, useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import NavigationBar from "../NavigationBar";
import TheHeader from "../Header/TheHeader";
import MusicControlBar from "../MusicControlBar";
import { Modal } from "antd";
import UseCookie from "../../hooks/useCookie";
import FooterSection from "../FooterSection";

const MainPageLayout = () => {
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
  useEffect(() => {
    if (access_token == null) {
      // Message to navigate to login page
      setOpen(true);
      console.log("CheckCookie", access_token);
    } else {
      console.log("CheckCookie", access_token);
    }
  }, [access_token]);
  return (
    <Fragment>
      <div className="flex flex-col bg-backgroundComponentPrimary dark:bg-backgroundComponentDarkPrimary">
        <div className="xl:flex xl:flex-row">
          <div className="sticky h-full xl:w-2/12 min-h-fit bg-backgroundComponentPrimary dark:bg-backgroundComponentDarkPrimary">
            <NavigationBar></NavigationBar>
          </div>
          <div className="xl:w-10/12">
            <div className="flex flex-col pb-12 min-h-fit">
              <TheHeader></TheHeader>
              <Outlet></Outlet>
              <FooterSection></FooterSection>
            </div>
          </div>
        </div>
        <div className="sticky z-50">
          <MusicControlBar></MusicControlBar>
        </div>
      </div>

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
    </Fragment>
  );
};

export default MainPageLayout;
