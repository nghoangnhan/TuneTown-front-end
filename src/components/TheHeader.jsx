import { Avatar } from "antd";
import { NavLink } from "react-router-dom";
import { UserOutlined } from "@ant-design/icons";

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

      <div className="xl:right-5 right-3 absolute flex flex-row justify-center items-center">
        <span className="xl:block hidden mr-3 text-[#505050]">User 1</span>
        <Avatar
          icon={<UserOutlined />}
          className=""
          size="large"
          src={
            <img
              src={
                "https://i.pinimg.com/564x/08/e4/58/08e458a736a3c0365612771772fa4904.jpg"
              }
              alt="avatar"
            />
          }
        />
      </div>
    </header>
  );
};

export default TheHeader;
