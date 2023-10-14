import { Fragment } from "react";
import { Outlet } from "react-router-dom";
import NavigationBar from "../components/NavigationBar";
import TheHeader from "../components/TheHeader";
import MusicControlBar from "../components/MusicControlBar";

const PageFull = () => {
  return (
    <Fragment>
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
