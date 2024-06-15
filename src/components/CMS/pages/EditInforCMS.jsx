import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { DatePicker, Form, Input, message } from "antd";
import dayjs from "dayjs";
import UseCookie from "../../../hooks/useCookie";
import UploadAvatar from "../../Users/UploadAvatar";
import useConfig from "../../../utils/useConfig";
import { useDispatch } from "react-redux";
import { setRefershAccount } from "../../../redux/slice/account";

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};

// Edit Information in CMS page
const EditInfor = () => {
  const { getToken } = UseCookie();
  const { access_token } = getToken();
  const { Base_URL } = useConfig();
  const userId = localStorage.getItem("userId");
  const [form] = Form.useForm();
  const formRef = useRef(null);
  const [userInfor, setUserInfor] = useState({});
  const [fileIMG, setFileIMG] = useState();
  const [refresh, setRefresh] = useState(false);
  const dispatch = useDispatch();

  // const { getUserInfor } = useUserUtils();
  // Get user information from API
  const getUserInfor = async () => {
    try {
      const response = await axios.get(`${Base_URL}/users?userId=${userId}`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      // console.log("Admin", userInfor);
      return response.data;
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
      });
      if (response.status === 200) {
        message.success("User information updated successfully");
        setRefresh(true)
        dispatch(setRefershAccount(true))

      }
    } catch (error) {
      // Handle network errors or other exceptions
      console.error("Error edited user:", error.message);
      message.error("Error edited user");
    }
  };

  const onFinish = async (values) => {
    // Value in Inpurt
    const { userName, userBio, email, birthDate } = values;
    // console.log("Values", values);
    const postData = {
      id: userId,
      avatar: fileIMG,
      userName: userName,
      userBio: userBio,
      email: email,
      birthDate: birthDate.format("YYYY-MM-DD"),
    };
    // console.log("Token", access_token);
    // console.log("Posting Data", postData);
    editUser(postData); // Call the function to post the song data
  };

  //Upload

  useEffect(() => {
    if (access_token == null) {
      window.location.href = "/";
    }
    getUserInfor().then((res) => {
      setUserInfor(res.user);
      setRefresh(false);
      if (formRef.current) {
        formRef.current.setFieldsValue({
          userName: res.user.userName,
          email: res.user.email,
          birthDate: dayjs(res.user.birthDate),
          userBio: res.user.userBio,
        });
      }
    });
    // console.log("userName", userInfor);
    // console.log("userNameeee", userInfor.userName);
    // console.log("userName", userName);
  }, [userId, refresh]);
  return (
    <section className="relative flex flex-col w-full min-h-screen pt-10">
      <div className="flex items-center justify-center ">
        <Form
          {...layout}
          ref={formRef}
          form={form}
          onFinish={onFinish}
          className="xl:w-[500px] relative w-fit shadow-lg rounded-md mx-auto p-5  bg-backgroundPrimary dark:bg-backgroundComponentDarkPrimary formStyle"
        >
          <div className="w-full mb-5 text-center">
            <h2 className="text-3xl font-bold uppercase font-monserrat text-primary dark:text-primaryDarkmode">
              Update Information
            </h2>
          </div>
          {/* Avatar Image */}
          <Form.Item
            name="avatar"
            label="Upload Avatar"
            valuePropName="fileList"
            extra="Upload your cover image png, jpg, jpeg"
            rules={[
              {
                required: false,
              },
            ]}
          >
            <UploadAvatar setFileIMG={setFileIMG}></UploadAvatar>
            {fileIMG && <img src={fileIMG} alt="" className="object-cover w-16 h-16" />}
          </Form.Item>
          <Form.Item
            name="userName"
            label="Name"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input className="dark:bg-backgroundPrimary" />
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
            <Input className="dark:bg-backgroundPrimary" />
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
            <Input disabled className="dark:bg-backgroundPrimary" />
          </Form.Item>
          <Form.Item
            label="Birthday"
            name="birthDate"
            rules={[
              { required: true, message: "Please input your date of birth!" },
              {
                type: "object",
                message: "The input is not valid date!",
              },
              {
                validator: async (_, value) => {
                  if (value) {
                    const date = new Date(value);
                    const currentDate = new Date();
                    if (date > currentDate) {
                      return Promise.reject(
                        new Error("Date of birth can not be in the future!")
                      );
                    }
                  }
                },
              },
            ]}
          >
            <DatePicker className="dark:bg-backgroundPrimary" />
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

          <Form.Item className="relative flex justify-end">
            <button type="submit" className="px-2 py-2 border rounded-md cursor-pointer w-fit min-w-[110px] text-center border-primary dark:border-primary text-primary dark:text-primaryDarkmode hover:opacity-70">
              Save Changes
            </button>
          </Form.Item>
        </Form>
      </div>
    </section>
  );
};

export default EditInfor;
