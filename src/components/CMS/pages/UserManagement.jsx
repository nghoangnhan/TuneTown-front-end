import { Button, Form, Input, Modal, Space, Table, Tag } from "antd";
import { Base_URL } from "../../../api/config";
import axios from "axios";
import UseCookie from "../../../hooks/useCookie";
import { useEffect, useState } from "react";
import EditUserForm from "../../Users/EditUserForm";

/* eslint-disable no-unused-vars */
const UserManagement = () => {
  const { getToken } = UseCookie();
  const { access_token } = getToken();
  const [userList, setUserList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userId, setUserId] = useState();
  const [form] = Form.useForm();
  // Call this function when you want to refresh the playlist
  const showModal = (id) => {
    setIsModalOpen(true);
    setUserId(id);
    console.log("id", id);
  };
  const handleOk = () => {
    form.submit();
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  // http://localhost:8080/users
  const GetListUser = async () => {
    try {
      console.log("auth", access_token);
      const response = await axios.get(`${Base_URL}/users`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      console.log("UserList Response", response.data.users);
      setUserList(response.data.users);
      return response.data;
    } catch (error) {
      console.log("Error:", error);
    }
  };

  // Data Test
  const data = [
    {
      id: 1,
      userName: null,
      email: "nam@gmail.com",
      password: "$2a$10$N6GkJoW2TfhsSRAW4Z4csOtYLFfGdQcJI0kETDFgrIdP.PEgBjMf.",
      role: "USER",
      birthDate: "2023-10-23",
      userBio: null,
      avatar:
        "https://firebasestorage.googleapis.com/v0/b/tunetown-6b63a.appspot.com/o/images%2Flogo.png?alt=media&token=bf46ca20-ec6b-42b6-a330-a77663b450de",
      history: [],
      favoriteGenres: [],
      followingArtists: [],
    },
    {
      id: 2,
      userName: null,
      email: "test3@gmail.com",
      password: "$2a$10$GGZ1GbbSI5a.Ns0OHR.BM.L/U9UHl7BhxhUmRPvOPMU3ZOjiyDAJm",
      role: "USER",
      birthDate: "2000-08-01",
      userBio: null,
      avatar: null,
      history: [],
      favoriteGenres: [],
      followingArtists: [],
    },
    {
      id: 504,
      userName: "Nguyen Hoang Nhan",
      email: "nguyen.hngnhan21@gmail.com",
      password: "$2a$10$JUp.tzHb6H816tt1IyICe.hNisd/93uJQPI0LN1PXeorOv/njV.ay",
      role: "ARTIST",
      birthDate: "2002-07-21",
      userBio: null,
      avatar: null,
      history: [],
      favoriteGenres: [],
      followingArtists: [],
    },
    {
      id: 505,
      userName: "Nguyen Hoang Nhan",
      email: "test@gmail.com",
      password: "$2a$10$biLULL30K.AT7PFGM3in3OBAfP0HiYClyYOwtxNuNWAwvhv06S10.",
      role: "ADMIN",
      birthDate: "2002-07-21",
      userBio: "asds",
      avatar: null,
      history: [],
      favoriteGenres: [],
      followingArtists: [],
    },
  ];
  const columns = [
    {
      title: "Id",
      dataIndex: "id",
      key: "id",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Avatar",
      dataIndex: "avatar",
      key: "avatar",
      render: (avatar) => {
        return (
          <img
            src={avatar}
            alt="avatar"
            className="w-10 h-10 rounded-full object-cover"
          />
        );
      },
    },
    {
      title: "Name",
      dataIndex: "userName",
      key: "userName",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Bio",
      dataIndex: "userBio",
      key: "userBio",
    },
    {
      title: "Birthday",
      dataIndex: "birthDate",
      key: "birthDate",
    },
    {
      title: "Role",
      key: "role",
      dataIndex: "role",
      render: (role) => {
        let color = role.length > 5 ? "geekblue" : "green";
        if (role.toLowerCase() === "user") {
          color = "green";
        }
        if (role.toLowerCase() === "artist") {
          color = "purple";
        }
        if (role.toLowerCase() === "admin") {
          color = "red"; // Correct the color value
        }
        return (
          <Tag color={color} key={role}>
            {role.toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button
            className="py-1 px-2 rounded-lg"
            onClick={() => showModal(record.id)}
          >
            Edit
          </Button>
          <Button
            className="py-1 px-2 bg-[#c42323e1] hover:bg-[#ea3f3f] text-white rounded-lg"
            // onClick={() => deleteSong(record.key)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];
  useEffect(() => {
    GetListUser();
  }, [isModalOpen]);
  return (
    <div>
      <div className="text-2xl font-bold">User Management</div>
      <div className=" flex flex-col gap-3">
        <div className=" flex flex-row justify-between">
          <div className="">
            <Form
              name="basic"
              labelCol={{
                span: 8,
              }}
              wrapperCol={{
                span: 16,
              }}
              layout="inline"
              initialValues={{
                remember: true,
              }}
              // onFinish={onFinish}
              // onFinishFailed={onFinishFailed}
              autoComplete="off"
            >
              <Form.Item label="Name" name="majorName">
                <Input placeholder="majorName" />
              </Form.Item>
              <Form.Item>
                <Button type="default" htmlType="submit">
                  Search
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
        <Table columns={columns} dataSource={userList} />
        <Modal
          title="Edit User"
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          footer={[]}
        >
          <EditUserForm editUserId={userId}></EditUserForm>
        </Modal>
      </div>
    </div>
  );
};

export default UserManagement;
