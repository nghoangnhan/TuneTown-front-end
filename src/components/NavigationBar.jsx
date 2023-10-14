import { NavLink } from "react-router-dom";

const NavigationBar = () => {
  return (
    <div>
      {/* Navigation Laptop  */}
      <div className="hidden xl:flex h-screen bg-[#FFFFFFCC]">
        <div className="max-xl:w-64">
          <div className="text-center pt-6 uppercase font-bold text-lg flex flex-row justify-center items-center gap-5">
            <div>
              <img
                src="https://source.unsplash.com/random"
                className="h-12 rounded-lg"
                alt=""
              />
            </div>
            <div className="text-[#2E3271]">TuneTown</div>
          </div>
          <div className="mt-8">
            <div className="text-[#7C8DB5B8] ml-6">General</div>
            <div className="flex flex-col ml-6 mt-7 gap-2">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive
                    ? "h-10 w-48 bg-gradient-to-r from-[#7DC383] to-[#699C78] hover:text-[#e9e5e5] text-white flex justify-center items-center rounded-lg"
                    : "h-10 w-48 hover:text-[#7DC383] text-[#2E327180] flex justify-center items-center rounded-lg"
                }
              >
                Home
              </NavLink>
              <NavLink
                to="/search"
                className={({ isActive }) =>
                  isActive
                    ? "h-10 w-48 bg-gradient-to-r from-[#7DC383] to-[#699C78] hover:text-[#e9e5e5] text-white flex justify-center items-center rounded-lg"
                    : "h-10 w-48 hover:text-[#7DC383] text-[#2E327180] flex justify-center items-center rounded-lg"
                }
              >
                Search
              </NavLink>
              <NavLink
                to="/playlist"
                className={({ isActive }) =>
                  isActive
                    ? "h-10 w-48 bg-gradient-to-r from-[#7DC383] to-[#699C78] hover:text-[#e9e5e5] text-white flex justify-center items-center rounded-lg"
                    : "h-10 w-48 hover:text-[#7DC383] text-[#2E327180] flex justify-center items-center rounded-lg"
                }
              >
                Playlists
              </NavLink>
            </div>
            <div className="ml-6">
              <div className="text-[#7C8DB5B8] mt-6 ml-6">More</div>
              <div className="h-10 w-48 flex justify-center items-center rounded-lg mt-4 bg-[#c1c3c8b8] hover:bg-[#7DC383] hover:text-white text-[#7C8DB5B8] font-bold cursor-pointer">
                Log Out
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Mobile  */}
      <div className=" flex flex-row xl:hidden bg-[#ffffff] fixed bottom-0 z-50 w-screen justify-center">
        <div className="">
          <div className="py-1">
            <div className="flex flex-row items-center justify-center gap-4">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive
                    ? "h-5 w-auto p-5 bg-gradient-to-r from-[#7DC383] to-[#699C78] hover:text-[#e9e5e5] text-[#fff] flex justify-center items-center rounded-lg"
                    : "h-5 w-auto p-5 hover:text-[#7DC383] text-[#2E327180] flex justify-center items-center rounded-lg"
                }
              >
                Home
              </NavLink>
              <NavLink
                to="/search"
                className={({ isActive }) =>
                  isActive
                    ? "h-5 w-auto p-5 bg-gradient-to-r from-[#7DC383] to-[#699C78] hover:text-[#e9e5e5] text-[#fff] flex justify-center items-center rounded-lg"
                    : "h-5 w-auto p-5 hover:text-[#7DC383] text-[#2E327180] flex justify-center items-center rounded-lg"
                }
              >
                Search
              </NavLink>
              <NavLink
                to="/playlist"
                className={({ isActive }) =>
                  isActive
                    ? "h-5 w-auto p-5 bg-gradient-to-r from-[#7DC383] to-[#699C78] hover:text-[#e9e5e5] text-[#fff] flex justify-center items-center rounded-lg"
                    : "h-5 w-auto p-5 hover:text-[#7DC383] text-[#2E327180] flex justify-center items-center rounded-lg"
                }
              >
                Playlists
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavigationBar;
