import { NavLink } from "react-router-dom";

const TheHeader = () => {
  return (
    <header className="w-full xl:w-full py-5 pl-7 gap-x-7 flex justify-start items-center font-bold  bg-[#B9C0DE]">
      <NavLink
        to="/"
        className={({ isActive }) =>
          isActive ? "text-[#2E3271]" : "text-[#2E327180]"
        }
      >
        <div className="font-bold">
          Home <span className="">{">"}</span>
        </div>
      </NavLink>
      <NavLink
        to="/detail"
        className={({ isActive }) =>
          isActive ? "text-[#2E3271]" : "text-[#2E327180]"
        }
      >
        <div className="font-bold">
          Detail Playlist <span className="">{">"}</span>
        </div>
      </NavLink>
    </header>
  );
};

export default TheHeader;
