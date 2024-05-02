import { Button, Form, Input, Modal, Select, Space, Table, Tag, message, } from "antd";
import axios from "axios";
import UseCookie from "../../../hooks/useCookie";
import { useEffect, useState } from "react";
import EditUserForm from "../../Users/EditUserForm";
import defaultAva from "../../../assets/img/logo/logo.png";
import { useForm } from "antd/es/form/Form";
import useConfig from "../../../utils/useConfig";
/* eslint-disable no-unused-vars */
const UserManagement = () => {
  const { getToken } = UseCookie();
  const { access_token } = getToken();
  const [formRole] = useForm();
  const { Base_URL } = useConfig();
  const [userList, setUserList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenUpdate, setIsModalOpenUpdate] = useState(false);
  const [userId, setUserId] = useState();
  const [searchValue, setSearchValue] = useState("");
  const [refresh, setRefresh] = useState(false);
  const handSearch = (e) => {
    setSearchValue(e.target.value);
  };
  // Call this function when you want to refresh the playlist
  const showModalEdit = (id) => {
    setIsModalOpen(true);
    setUserId(id);
    console.log("id", id);
  };
  const showModalEditRole = (id, role) => {
    setIsModalOpenUpdate(true);
    setUserId(id);
    // set value for the field
    formRole.setFieldsValue({
      role: role,
    });
    console.log("id", id);
  };
  const handleOkRole = () => {
    changeUserRole(userId, formRole.getFieldValue("role"));
    setIsModalOpenUpdate(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    setIsModalOpenUpdate(false);
  };

  // Change user role by API
  const changeUserRole = async (userId, role) => {
    try {
      const response = await axios.put(
        `${Base_URL}/users/switchUserRole`,
        {
          id: userId,
          role: role,
        },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      if (response.status === 200) {
        // Return a success flag or any relevant data
        setRefresh(true);
        message.success("Change role successfully");
        return { success: true, data: response.data };
      }
    } catch (error) {
      console.log("Error:", error);
      message.error("Change role failed");
      return { success: false, error: error.message };
    }
  };

  // http://localhost:8080/users
  const GetListUser = async () => {
    try {
      const response = await axios.get(`${Base_URL}/users`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      // console.log("UserList Response", response.data.users);
      setRefresh(true);
      setUserList(response.data.users);
      return response.data;
    } catch (error) {
      console.log("Error:", error);
    }
  };
  // Delete User
  const deleteUser = async (userId) => {
    try {
      if (confirm(`Are you sure you want to delete this User?`) == true) {
        const response = await axios.delete(
          `${Base_URL}/users?userId=${userId}`,
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          }
        );
        if (response.status === 200) {
          message.success("Delete User successfully!");
        }
        setRefresh(true);
        return response.status;
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      align: "center",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Avatar",
      dataIndex: "avatar",
      key: "avatar",
      align: "center",
      render: (avatar) => {
        return (
          <img
            src={avatar ? avatar : defaultAva}
            alt="avatar"
            className="object-cover rounded-full w-11 h-11"
          />
        );
      },
    },
    {
      title: "Name",
      dataIndex: "userName",
      key: "userName",
      align: "center",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "email",
      dataIndex: "email",
      key: "email",
      align: "center",
    },
    {
      title: "Bio",
      dataIndex: "userBio",
      key: "userBio",
      align: "center",
    },
    {
      title: "Birthday",
      dataIndex: "birthDate",
      key: "birthDate",
      align: "center",
      render: (birthDate) => {
        const date = new Date(birthDate);
        return (
          <div>
            {date.getDate()}/{date.getMonth() + 1}/{date.getFullYear()}
          </div>
        );
      },
    },
    {
      title: "Role",
      key: "role",
      dataIndex: "role",
      align: "center",
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
      align: "center",
      render: (_, record) => (
        <Space
          size="middle"
          className="flex flex-row gap-2 "
        >
          <button
            className="py-1 px-2 h-8 w-14 bg-[#2e9b42db] hover:bg-[#47c053] text-white rounded-lg"
            onClick={() => showModalEdit(record.id)}
          >
            Edit
          </button>
          <button
            className="py-1 px-2 h-8 w-full border border-solid border-[#955ec9] hover:bg-[#6947c0] hover:text-white rounded-lg"
            onClick={() => showModalEditRole(record.id, record.role)}
          >
            Role
          </button>
          <button
            className="py-1 px-2 h-8 w-14 bg-[#c42323e1] hover:bg-[#ea3f3f] text-white rounded-lg"
            onClick={() => deleteUser(record.id)}
          >
            Delete
          </button>
        </Space>
      ),
    },
    {},
  ];

  useEffect(() => {
    GetListUser();
  }, []);

  useEffect(() => {
    if (isModalOpen || isModalOpenUpdate || refresh) {
      GetListUser().then(() => {
        setRefresh(false);
      })
    }
  }, [refresh]);
  return (
    <div>
      <div className="text-2xl font-bold">User Management</div>
      <div className="flex flex-col gap-3 ">
        <div className="flex flex-row justify-between mt-5 mb-5 ">
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
              <Form.Item label="" name="userName" className="">
                <Input placeholder="Search User Name" onChange={handSearch} />
              </Form.Item>
            </Form>
          </div>
        </div>
        <Table
          columns={columns}
          dataSource={
            searchValue
              ? userList.filter((user) =>
                user.userName
                  .toLowerCase()
                  .includes(searchValue.toLowerCase())
              )
              : userList
          }
          pagination={{ pageSize: 8 }}
        />
        <Modal
          title="Edit User"
          open={isModalOpen}
          onCancel={handleCancel}
          footer={[]}
        >
          <EditUserForm editUserId={userId} isAdmin={true}></EditUserForm>
        </Modal>
        <Modal
          title="Edit User Role"
          open={isModalOpenUpdate}
          onCancel={handleCancel}
          centered
          footer={[]}
        >
          <Form form={formRole}>
            <Form.Item label="Role" name="role">
              <Select
                placeholder="Role"
                options={[
                  { label: "USER", value: "USER" },
                  { label: "ARTIST", value: "ARTIST" },
                  { label: "ADMIN", value: "ADMIN" },
                ]}
              />
            </Form.Item>
            <Form.Item className="right-0">
              <Button type="default" htmlType="submit" onClick={handleOkRole}>
                Update
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default UserManagement;
