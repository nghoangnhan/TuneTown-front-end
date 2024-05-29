import { Fragment } from "react";
import { Outlet } from "react-router-dom";
import NavigationBar from "../NavigationBar";
import TheHeader from "../Header/TheHeader";
import MusicControlBar from "../MusicControlBar";
import FooterSection from "../FooterSection";
import AuthorizationModal from "../AuthorizationModal";

const MainPageLayout = () => {
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
      <AuthorizationModal isAdmin={false}></AuthorizationModal>
    </Fragment>
  );
};

export default MainPageLayout;
