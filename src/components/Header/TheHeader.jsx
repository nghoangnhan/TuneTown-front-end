import { useState } from "react";
import { Avatar, Modal } from "antd";
// import { NavLink } from "react-router-dom";
import { UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const TheHeader = () => {
  const navigate = useNavigate();
  const srcAva =
    "https://i.pinimg.com/564x/08/e4/58/08e458a736a3c0365612771772fa4904.jpg";
  const [modalOpen, setModalOpen] = useState(false);
  // Use ReactQuery to get user info
  // const { data: user } = useQuery("user", () =>
  //   axios.get(`${process.env.REACT_APP_API_URL}/api/v1/users/me`, {
  //     headers: {
  //       Authorization: `Bearer ${token}`,
  //     },
  //   })
  // );
  // const srcAva = user?.data?.data?.user?.avatar;
  // const name = user?.data?.data?.user?.name;

  return (
    <header className="w-full xl:w-full py-5 pl-7 gap-x-7 flex justify-start items-center font-bold  bg-[#B9C0DE]">
      <div className="xl:right-5 xl:mt-5 right-3 absolute flex flex-row justify-center items-center ">
        <span className="xl:block hidden mr-3 text-[#505050] cursor-default">
          User 1
        </span>
        {srcAva && (
          <button className="cursor-pointer" onClick={() => setModalOpen(true)}>
            <Avatar
              icon={<UserOutlined />}
              className="border-[3px] border-[#2c2a2a] "
              size="large"
              src={<img src={srcAva} alt="avatar" />}
            />
          </button>
        )}
        {!srcAva && (
          <button className="cursor-pointer" onClick={() => setModalOpen(true)}>
            <Avatar icon={<UserOutlined />} size="large" />
          </button>
        )}
      </div>
      <Modal
        title="Options"
        centered
        open={modalOpen}
        onOk={() => setModalOpen(false)}
        onCancel={() => setModalOpen(false)}
        className="text-[#359254] font-bold flex flex-row justify-center items-center"
      >
        <div
          onClick={() => navigate("/upload")}
          className="flex justify-center items-center text-blue-950 hover:text-white font-semibold hover:bg-[#45cc79] bg-[#f1f1ef] rounded-lg mt-3 h-10 "
        >
          <button>Upload Song</button>
        </div>
        <div className="flex justify-center items-center text-blue-950 hover:text-white font-semibold hover:bg-[#45cc79] bg-[#f1f1ef] rounded-lg mt-3 h-10  ">
          <button>Setting</button>
        </div>
      </Modal>
    </header>
  );
};

export default TheHeader;
