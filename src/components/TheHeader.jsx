import { Avatar } from "antd";
import { NavLink } from "react-router-dom";
import { UserOutlined } from "@ant-design/icons";

const TheHeader = () => {
  const srcAva =
    "https://i.pinimg.com/564x/08/e4/58/08e458a736a3c0365612771772fa4904.jpg";
  return (
    <header className="w-full xl:w-full py-5 pl-7 gap-x-7 flex justify-start items-center font-bold  bg-[#B9C0DE]">
      <NavLink
        to="/home"
        className={({ isActive }) =>
          isActive ? "text-[#2E3271]" : "text-[#2E327180]"
        }
      >
        <div className="font-bold">
          Home <span className="">{">"}</span>
        </div>
      </NavLink>
      <NavLink
        to="/detail/1"
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
        {srcAva && (
          <Avatar
            icon={<UserOutlined />}
            className="border-[3px] border-[#2c2a2a]"
            size="large"
            src={<img src={srcAva} alt="avatar" />}
          />
        )}
        {!srcAva && (
          <Avatar icon={<UserOutlined />} className="" size="large" />
        )}
      </div>
    </header>
  );
};

export default TheHeader;
