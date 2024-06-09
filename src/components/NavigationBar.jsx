import { NavLink, useNavigate } from "react-router-dom";
import useIconUtils from "../utils/useIconUtils";
import useConfig from "../utils/useConfig";
import { useTranslation } from "react-i18next";

const NavigationBar = () => {
  const navigate = useNavigate();
  const { isMobile, Base_AVA } = useConfig();
  const { HomeIcon, SearchIcon, EarthIcon, PlaylistIcon } = useIconUtils();
  const { t } = useTranslation();
  return (
    <div>
      {/* Navigation Laptop  */}
      {!isMobile && (
        <div className="justify-center hidden h-full min-h-screen xl:flex bg-backgroundComponentPrimary dark:bg-backgroundComponentDarkPrimary">
          <div className="max-xl:w-64 xl:fixed">
            <div
              className="flex flex-row items-center justify-center gap-5 pt-6 text-lg font-bold text-center uppercase cursor-pointer"
              onClick={() => navigate("/")}
            >
              <div>
                <img
                  src={Base_AVA}
                  className="h-12 bg-white rounded-full"
                  alt=""
                />
              </div>
              <div className="text-headingText dark:text-headingTextDark">
                TuneTown
              </div>
            </div>
            <div className="mt-8">
              <div className="flex flex-col items-center justify-center gap-2 mt-7">
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    isActive
                      ? "h-fit w-fit min-w-[220px] p-2  bg-gradient-to-r from-[#6aca72] to-[#32b95b] font-bold hover:opacity-80 text-textNavbarNormal text-center rounded-lg"
                      : "h-fit w-fit min-w-[220px] p-2  font-bold hover:text-[#6aca72] text-textNavbar dark:text-textNavbarDark text-center rounded-lg"
                  }
                >
                  <span className="mr-2">
                    <HomeIcon></HomeIcon>
                  </span>
                  {t("nav.home")}
                </NavLink>
                <NavLink
                  to="/search"
                  className={({ isActive }) =>
                    isActive
                      ? "h-fit w-fit min-w-[220px] p-2  bg-gradient-to-r from-[#6aca72] font-bold to-[#32b95b] hover:opacity-80 text-textNavbarNormal text-center rounded-lg"
                      : "h-fit w-fit min-w-[220px] p-2  font-bold hover:text-[#6aca72] text-textNavbar dark:text-textNavbarDark text-center rounded-lg"
                  }
                >
                  <span className="mr-2">
                    <SearchIcon></SearchIcon>
                  </span>
                  {t("nav.search")}
                </NavLink>
                <NavLink
                  to="/forum"
                  className={({ isActive }) =>
                    isActive
                      ? "h-fit w-fit min-w-[220px] p-2  bg-gradient-to-r from-[#6aca72] to-[#32b95b] font-bold hover:opacity-80 text-textNavbarNormal text-center rounded-lg"
                      : "h-fit w-fit min-w-[220px] p-2  hover:text-[#6aca72] font-bold text-textNavbar dark:text-textNavbarDark text-center rounded-lg"
                  }
                >
                  <span className="mr-2">
                    <EarthIcon></EarthIcon>
                  </span>
                  {t("nav.forum")}
                </NavLink>
                <NavLink
                  to="/playlist"
                  className={({ isActive }) =>
                    isActive
                      ? "h-fit w-fit min-w-[220px] p-2 bg-gradient-to-r from-[#6aca72] to-[#32b95b] font-bold hover:opacity-80 text-textNavbarNormal text-center rounded-lg"
                      : "h-fit w-fit min-w-[220px] p-2  hover:text-[#6aca72] font-bold text-textNavbar dark:text-textNavbarDark text-center rounded-lg"
                  }
                >
                  <span className="mr-2">
                    <PlaylistIcon></PlaylistIcon>
                  </span>
                  {t("nav.myPlaylist")}
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Mobile  */}
      {isMobile && (
        <div className="z-50 flex flex-row justify-center w-screen xl:hidden bg-backgroundComponentPrimary dark:bg-backgroundComponentDarkPrimary">
          <div className="pb-1">
            <div className="flex flex-row items-center justify-center gap-4">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive
                    ? "h-2 w-auto p-4 bg-gradient-to-r from-[#6aca72] to-[#32b95b] font-bold hover:opacity-80 text-textNavbarNormal text-center rounded-lg"
                    : "h-2 w-auto p-4 font-bold hover:text-[#6aca72] text-textNavbar dark:text-textNavbarDark text-center rounded-lg"
                }
              >
                Home
              </NavLink>
              <NavLink
                to="/search"
                className={({ isActive }) =>
                  isActive
                    ? "h-2 w-auto p-4 bg-gradient-to-r from-[#6aca72] to-[#32b95b] font-bold hover:opacity-80 text-textNavbarNormal text-center rounded-lg"
                    : "h-2 w-auto p-4 font-bold hover:text-[#6aca72] text-textNavbar dark:text-textNavbarDark text-center rounded-lg"
                }
              >
                Search
              </NavLink>
              <NavLink
                to="/forum"
                className={({ isActive }) =>
                  isActive
                    ? "h-2 w-auto p-4 bg-gradient-to-r from-[#6aca72] to-[#32b95b] font-bold hover:opacity-80 text-textNavbarNormal text-center rounded-lg"
                    : "h-2 w-auto p-4 font-bold hover:text-[#6aca72] text-textNavbar dark:text-textNavbarDark text-center rounded-lg"
                }
              >
                Forum
              </NavLink>
              <NavLink
                to="/playlist"
                className={({ isActive }) =>
                  isActive
                    ? "h-2 w-auto p-4 bg-gradient-to-r from-[#6aca72] to-[#32b95b] font-bold hover:opacity-80 text-textNavbarNormal text-center rounded-lg"
                    : "h-2 w-auto p-4 font-bold hover:text-[#6aca72] text-textNavbar dark:text-textNavbarDark text-center rounded-lg"
                }
              >
                Playlists
              </NavLink>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NavigationBar;
