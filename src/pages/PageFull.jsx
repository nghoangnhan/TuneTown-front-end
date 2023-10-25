import { Fragment, useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import NavigationBar from "../components/NavigationBar";
import TheHeader from "../components/Header/TheHeader";
import MusicControlBar from "../components/MusicControlBar";
import userUtils from "../utils/userUtils";
import { Modal } from "antd";

const PageFull = () => {
  const [open, setOpen] = useState(false);
  const { CheckCookie } = userUtils();
  const navigate = useNavigate();
  useEffect(() => {
    if (CheckCookie() == true) {
      console.log("CheckCookie", CheckCookie());
      setOpen(false);
    } else {
      // Message to navigate to login page
      setOpen(true);
      console.log("CheckCookie", CheckCookie());
    }
  }, [CheckCookie]);
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
