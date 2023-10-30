/* eslint-disable no-unused-vars */
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Base_URL } from "../../api/config";
import { UploadOutlined } from "@ant-design/icons";
import { Button, DatePicker, Form, Input, Select, Upload } from "antd";
import UseCookie from "../../hooks/useCookie";
import UploadAvatar from "./UploadAvatar";
import moment from "moment/moment";
import dayjs from "dayjs";
const { Option } = Select;

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};
const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 16,
  },
};

const EditUserForm = () => {
  const { getToken } = UseCookie();
  const { access_token } = getToken();
  const userId = localStorage.getItem("userId");
  const [form] = Form.useForm();
  const formRef = useRef(null);
  const [userInfor, setUserInfor] = useState({});

  // Get user information from API
  const getUserInfor = async () => {
    try {
      const response = await axios.get(`${Base_URL}/users?userId=${userId}`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
        body: {},
      });
      console.log(response.data, response.status);
      setUserInfor(response.data.user);
      // setUserName(response.data.user.userName);
    } catch (error) {
      // Handle network errors or other exceptions
      console.error("Error edited user:", error.message);
    }
  };

  // Update user infor to API
  const editUser = async (values) => {
    try {
      const response = await axios.put(`${Base_URL}/users`, values, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
        // body: { values },
      });
      if (response.status === 200) {
        // Handle success
        console.log("User edited successfully:", response.data);
      } else {
        // Handle other status codes
        console.error("Error edited user:", response.statusText);
      }
    } catch (error) {
      // Handle network errors or other exceptions
      console.error("Error edited user:", error.message);
    }
  };

  const onFinish = (values) => {
    console.log("Received values:", values);
    // Value in Inpurt
    const { userName, avatar, userBio, email, birthDate } = values;
    const postData = {
      id: userId,
      avatar: avatar,
      userName: userName,
      userBio: userBio,
      email: email,
      birthDate: birthDate.format("YYYY-MM-DD"),
    };
    console.log("Token", access_token);
    console.log("Posting Data", postData);
    editUser(postData); // Call the function to post the song data
  };

  //Upload
  const normFile = (e) => {
    console.log("Upload event:", e);
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  useEffect(() => {
    if (access_token == null) {
      window.location.href = "/";
    }
    getUserInfor();
    form.setFieldsValue({
      userName: userInfor.userName,
      email: userInfor.email,
      birthDate: dayjs(userInfor.birthDate),
      userBio: userInfor.userBio,
    });

    console.log("userName", userInfor);
    console.log("userNameeee", userInfor.userName);
    // console.log("userName", userName);
  }, [access_token, userInfor.userName, userInfor.email, userInfor.userBio]);
  return (
    <section className="w-full h-screen relative flex flex-col xl:pt-12 pt-6 bg-[#ecf2fd] px-1">
      <div className="flex justify-center items-center h-fit">
        <Form
          {...layout}
          ref={formRef}
          name="control-ref"
          form={form}
          onFinish={onFinish}
          className="xl:w-[500px] relative w-fit border rounded-md mx-auto p-5 bg-[#f9f9f9]"
          // initialValues={{ userName: userInfor.userName }}
        >
          <div className="w-full text-center mb-5">
            <h2 className="text-3xl uppercase font-monserrat font-bold text-[#312f2f]">
              Edit Information
            </h2>
          </div>
          {/* Avatar Image */}
          <Form.Item
            name="avatar"
            label="Upload Avatar"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            extra="Upload your cover image png, jpg, jpeg"
            rules={[
              {
                required: false,
              },
            ]}
          >
            <UploadAvatar></UploadAvatar>
          </Form.Item>
          <Form.Item
            name="userName"
            label="Name"
            rules={[
              {
                required: true,
              },
            ]}
            // initialValue={userInfor.userName}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="userBio"
            label="Bio"
            rules={[
              {
                required: false,
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Birthday"
            name="birthDate"
            rules={[
              { required: true, message: "Please input your date of birth!" },
            ]}
          >
            <DatePicker />
          </Form.Item>

          {/* Genre */}
          {/* <Form.Item
            name="genre"
            label="Song Genre"
            extra={"Select your song genre, CHOOSE ONE"}
          >
            <Select
              placeholder="Select a option and change input text above"
              allowClear
            >
              <Option value="Pop">Pop</Option>
              <Option value="Jazz">Jazz</Option>
              <Option value="EDM">EDM</Option>
              <Option value="Trap">Trap</Option>
              <Option value="other">other</Option>
            </Select>
          </Form.Item>  
          */}

          {/* <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: false,
                message: "Please input your password!",
              },
            ]}
          >
            <Input.Password ref={passwordRef} />
          </Form.Item>
          <Form.Item
            name="confirm"
            label="Confirm Password"
            dependencies={["password"]}
            hasFeedback
            rules={[
              {
                required: false,
                message: "Please confirm your password!",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("The new password that you entered do not match!")
                  );
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item> */}

          <Form.Item {...tailLayout} className="left-0">
            <Button type="primary" htmlType="submit" className="bg-[green] ">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    </section>
  );
};

export default EditUserForm;
