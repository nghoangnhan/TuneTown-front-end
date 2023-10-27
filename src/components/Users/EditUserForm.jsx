/* eslint-disable no-unused-vars */
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Base_URL } from "../../api/config";
import { UploadOutlined } from "@ant-design/icons";
import { Button, DatePicker, Form, Input, Select, Upload } from "antd";
import UseCookie from "../../hooks/useCookie";
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
  const formRef = useRef(null);
  const [userName, setUserName] = useState();
  const [userEmail, setUserEmail] = useState();
  const [userPassword, setUserPassword] = useState();
  const [userRePassword, setUserRePassword] = useState();
  const [userAva, setUserAva] = useState();
  const [userBdate, setUserBdate] = useState();
  const [userRole, setUserRole] = useState();

  const passwordRef = useRef();
  const repasswordRef = useRef();

  // Get user information from API
  const getUser = async () => {
    try {
      const response = await axios.get(`${Base_URL}/users?id=${userId}`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
          // Add any other headers if required
        },
        body: {},
      });
      console.log(response.data, response.status);
    } catch (error) {
      // Handle network errors or other exceptions
      console.error("Error edited user:", error.message);
    }
  };

  // Update user infor to API
  const editUser = async (values) => {
    try {
      const response = await axios.post(
        `${Base_URL}/users?id=${userId}`,
        values,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
            // Add any other headers if required
          },
          body: {},
        }
      );

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
    const { songName, artists, poster, songData, genre } = values;

    const postData = {
      songName: songName,
      poster: poster,
      songData: songData,
      genre: genre,
      artist: artists.map((artist) => {
        return { userName: artist };
      }),
    };
    console.log("Posting Data", postData);
    // const artists = {};
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

  const onReset = () => {
    formRef.current?.resetFields();
  };
  useEffect(() => {
    getToken();
    const { access_token } = getToken();
    if (access_token == null) {
      console.log("CheckCookie", getToken());
      window.location.href = "/";
    }
  }, []);
  return (
    <section className="w-full h-screen">
      <div className="flex justify-center items-center absolute left-3  top-3">
        <button
          onClick={() => window.history.back()}
          className="bg-[#2f9948] hover:bg-[#40cf62] rounded-md "
        >
          <div className="text-white font-bold px-2 py-2">{"<"} TuneTown</div>
        </button>
      </div>

      <div className="flex justify-center items-center h-full">
        <Form
          {...layout}
          ref={formRef}
          name="control-ref"
          onFinish={onFinish}
          className="w-[500px] border rounded-md mx-auto p-5 mt-10 bg-[#f9f9f9]"
        >
          <div className="w-full text-center mb-5">
            <h2 className="text-3xl uppercase font-monserrat font-bold text-[#312f2f]">
              Edit Information
            </h2>
          </div>
          <Form.Item
            name="userName"
            label="Name"
            rules={[
              {
                required: true,
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
            label="Password"
            name="password"
            rules={[
              {
                required: true,
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
                required: true,
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

          {/* Cover Image */}
          <Form.Item
            name="poster"
            label="Upload Cover Art"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            extra="Upload your cover image png, jpg, jpeg"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Upload name="logo" action="/" listType="picture">
              <Button icon={<UploadOutlined />}>Click to upload</Button>
            </Upload>
          </Form.Item>

          {/* Genre  */}
          <Form.Item
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

          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) =>
              prevValues.genre !== currentValues.genre
            }
          >
            {({ getFieldValue }) =>
              /* lấy giá trị trong field gender xem có phải other không */
              getFieldValue("genre") === "other" ? (
                /* Nếu chọn other thì hiện ra cái này */
                <Form.Item name="customizeGenre" label="Customize Genre">
                  <Input />
                </Form.Item>
              ) : null
            }
          </Form.Item>
          <Form.Item {...tailLayout}>
            <Button
              type="primary"
              htmlType="submit"
              className="bg-[green] mr-3"
            >
              Submit
            </Button>
            <Button htmlType="button" onClick={onReset}>
              Reset
            </Button>
          </Form.Item>
        </Form>
      </div>
    </section>
  );
};

export default EditUserForm;
