import { Form, Input, Modal, Select, Space, Table, Tag, message, } from "antd";
import axios from "axios";
import UseCookie from "../../../hooks/useCookie";
import { useEffect, useState } from "react";
import EditUserForm from "../../Users/EditUserForm";
import { useForm } from "antd/es/form/Form";
import useConfig from "../../../utils/useConfig";
import { useTranslation } from "react-i18next";

const UserManagement = () => {
  const { getToken } = UseCookie();
  const { access_token } = getToken();
  const [formRole] = useForm();
  const { Base_URL } = useConfig();
  const { t } = useTranslation();
  const [userList, setUserList] = useState([]);
  const [isModalEditOpen, setIsModalEditOpen] = useState(false);
  const [isModalOpenUpdate, setIsModalOpenUpdate] = useState(false);
  const [userId, setUserId] = useState();
  const [searchValue, setSearchValue] = useState("");
  const [refresh, setRefresh] = useState(false);
  const handSearch = (e) => {
    setSearchValue(e.target.value);
  };
  // Call this function when you want to refresh the playlist
  const showModalEdit = (id) => {
    setUserId(id);
    setIsModalEditOpen(true);
  };
  const showModalEditRole = (id, role) => {
    setUserId(id);
    setIsModalOpenUpdate(true);
    // set value for the field
    formRole.setFieldsValue({
      role: role,
    });
  };
  const handleOkRole = () => {
    changeUserRole(userId, formRole.getFieldValue("role"));
    setRefresh(true);
    setIsModalOpenUpdate(false);
  };
  const handleCancel = () => {
    setIsModalEditOpen(false);
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
  const getListUser = async () => {
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
      if (confirm(t("confirmModal.deleteUser")) == true) {
        const response = await axios.delete(
          `${Base_URL}/users?userId=${userId}`,
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          }
        );
        if (response.status === 200) {
          message.success(t("message.deleteUserSuccess"));
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
      title: t("CMS.avatar"),
      dataIndex: "avatar",
      key: "avatar",
      align: "center",
      render: (avatar) => {
        return (
          <div>
            {avatar && <img
              src={avatar}
              alt="avatar"
              className="object-cover rounded-full w-11 h-11"
            />}
            {
              !avatar && <div>None</div>
            }
          </div>

        );
      },
    },
    {
      title: t("CMS.name"),
      dataIndex: "userName",
      key: "userName",
      align: "center",
      render: (text) => <a>{text}</a>,
    },
    {
      title: t("CMS.email"),
      dataIndex: "email",
      key: "email",
      align: "center",
    },
    {
      title: t("CMS.bio"),
      dataIndex: "userBio",
      key: "userBio",
      align: "center",
    },
    {
      title: t("CMS.birthDate"),
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
      title: t("CMS.role"),
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
      title: t("CMS.action"),
      key: "action",
      align: "center",
      render: (_, record) => (
        <Space
          size="small"
          className="flex items-center justify-between gap-2"
        >
          <button
            className="w-16 px-2 py-1 border rounded-md border-primary dark:border-primaryDarkmode text-primary dark:text-primaryDarkmode hover:opacity-60"
            onClick={() => showModalEdit(record.id)}
          >
            {t("CMS.update")}
          </button>
          <button
            className="w-16 px-2 py-1 text-purple-600 border border-purple-600 rounded-md dark:border-purple-500 dark::border-red-500 dark:text-purple-500 hover:opacity-60"
            onClick={() => showModalEditRole(record.id, record.role)}
          >
            {t("CMS.role")}
          </button>
          {/* <button
            className="w-16 px-2 py-1 text-red-600 border border-red-600 rounded-md dark::border-red-500 dark:text-red-500 hover:opacity-60"
            onClick={() => deleteUser(record.id)}
          >
            Delete
          </button> */}
        </Space>
      ),
    },
  ];

  useEffect(() => {
    getListUser();
  }, []);

  useEffect(() => {
    if (refresh == true) {
      getListUser().then(() => {
        setRefresh(false);
      })
    }
  }, [refresh]);
  return (
    <div className="h-full min-h-screen">
      <div className="text-2xl font-bold text-primary dark:text-primaryDarkmode">User Management</div>
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
                <Input placeholder="Search..." onChange={handSearch} className="text-primaryText2 dark:text-primaryTextDark2" />
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
          open={isModalEditOpen}
          onCancel={handleCancel}
          footer={[]}
          centered

          className="modalStyle w-fit h-fit"
        >
          <EditUserForm editUserId={userId} setRefresh={setRefresh} setOpenModalEditUser={setIsModalEditOpen} isAdmin={true}></EditUserForm>
        </Modal>
        <Modal
          title={t("modal.updateUserRole")}
          open={isModalOpenUpdate}
          onCancel={handleCancel}
          centered
          footer={[]}
          className="modalStyle w-fit h-fit"
        >
          <Form form={formRole} className="w-full pt-4 formStyle">
            <Form.Item label={t("CMS.role")} name="role">
              <Select
                placeholder={t("CMS.selectRole")}
                options={[
                  { label: "USER", value: "USER" },
                  { label: "ARTIST", value: "ARTIST" },
                  { label: "ADMIN", value: "ADMIN" },
                ]}
              />
            </Form.Item>
            <Form.Item className="w-full">
              <button type="submit" className="absolute right-0 px-2 py-1 border rounded-md hover:opacity-70 border-primary dark:border-primaryDarkmode text-primary dark:text-primaryDarkmode" onClick={handleOkRole}>
                {t("CMS.update")}
              </button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default UserManagement;
