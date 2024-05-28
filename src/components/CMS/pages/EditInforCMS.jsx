import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { DatePicker, Form, Input } from "antd";
import dayjs from "dayjs";
import UseCookie from "../../../hooks/useCookie";
import UploadAvatar from "../../Users/UploadAvatar";
import useConfig from "../../../utils/useConfig";

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
  // const { getUserInfor } = useUserUtils();
  // Get user information from API
  const getUserInfor = async () => {
    try {
      const response = await axios.get(`${Base_URL}/users?userId=${userId}`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      // console.log(response.data, response.status);
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
    console.log("FileIMG", fileIMG);
    // Value in Inpurt
    const { userName, userBio, email, birthDate } = values;
    const postData = {
      id: userId,
      avatar: fileIMG,
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
    <section className="relative flex flex-col w-full h-screen pt-10">
      <div className="flex items-center justify-center h-fit">
        <Form
          {...layout}
          ref={formRef}
          name="control-ref"
          form={form}
          onFinish={onFinish}
          className="xl:w-[500px] relative w-fit border rounded-md mx-auto p-5  bg-backgroundPrimary dark:bg-backgroundComponentDarkPrimary formStyle"
        // initialValues={{ userName: userInfor.userName }}
        >
          <div className="w-full mb-5 text-center">
            <h2 className="text-3xl font-bold uppercase font-monserrat text-primary dark:text-primaryDarkmode">
              Edit Information
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
            <butotn type="submit" className="px-2 py-2 border rounded-md cursor-pointer w-fit min-w-[110px] text-center border-primary dark:border-primary text-primary dark:text-primaryDarkmode hover:opacity-70">
              Save Changes
            </butotn>
          </Form.Item>
        </Form>
      </div>
    </section>
  );
};

export default EditInfor;
