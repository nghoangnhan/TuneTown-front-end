import { Fragment, useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import NavigationBar from "../components/NavigationBar";
import TheHeader from "../components/Header/TheHeader";
import MusicControlBar from "../components/MusicControlBar";
import { Modal } from "antd";
import UseCookie from "../hooks/useCookie";

const PageFull = () => {
  const { getToken } = UseCookie();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

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
    const { access_token } = getToken();
    if (access_token == null) {
      // Message to navigate to login page
      setOpen(true);
      console.log("CheckCookie", access_token);
    } else {
      console.log("CheckCookie", access_token);
    }
  }, [getToken]);
  return (
    <Fragment>
      <Modal
        title="Warning Authorization"
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
      <div>
        <div className="flex flex-col">
          <div className="xl:flex xl:flex-row">
            <div className="xl:w-2/12">
              <NavigationBar></NavigationBar>
            </div>
            <div className="xl:w-10/12">
              <div className="flex flex-col">
                <TheHeader></TheHeader>
                <Outlet></Outlet>
              </div>
            </div>
          </div>
          <div className="z-50">
            <MusicControlBar></MusicControlBar>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default PageFull;
