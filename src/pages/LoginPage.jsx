import { Form, Input } from "antd";
import axios from "axios";
import { NavLink } from "react-router-dom";

const onFinish = (values) => {
  console.log("Success:", values);
};
const onFinishFailed = (errorInfo) => {
  console.log("Failed:", errorInfo);
};
const LoginPage = () => {
  // const getUser = fetch("http://localhost:8080/users").then((res) =>
  //   res.json()
  // );

  async function GetAccessToken() {
    try {
      const response = await axios.post(
        "http://localhost:8080/auth/authenticate",
        {
          username: "alo@gmail.com",
          password: "123456",
        }
      );
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  }
  GetAccessToken();

  return (
    <div className="flex flex-col justify-center bg-[#FFFFFFCC]">
      <div className="flex flex-row flex-1 relative">
        <div className="hidden xl:block xl:w-1/2">
          <img
            src="https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80"
            className="h-screen w-auto object-cover"
            alt=""
          />
        </div>

        <div className="flex flex-col justify-center items-center min-h-screen xl:w-1/2">
          <div className="mb-20">
            <h1 className="font-bold text-[#2E3271] text-3xl">Login</h1>
          </div>
          <Form
            className="w-full"
            name="basic"
            labelCol={{
              span: 8,
            }}
            wrapperCol={{
              span: 16,
            }}
            style={{
              maxWidth: 600,
            }}
            initialValues={{
              remember: true,
            }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item
              label="Username"
              name="username"
              rules={[
                {
                  required: true,
                  message: "Please input your username!",
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
              <Input.Password />
            </Form.Item>

            <Form.Item
              name="remember"
              valuePropName="checked"
              wrapperCol={{
                offset: 8,
                span: 16,
              }}
            ></Form.Item>

            <Form.Item
              wrapperCol={{
                offset: 8,
                span: 16,
              }}
            >
              <button
                className="bg-[#38a870] text-white hover:bg-[#54ce91] hover:text-[#fff] px-3 py-2 rounded-lg font-semibold"
                // htmlType="submit"
              >
                Submit
              </button>
            </Form.Item>
          </Form>
          <div>
            <p className="text-[#2E3271]">
              Dont have an account?
              <NavLink to="/signup" className="text-[#34a56d] ml-1">
                Sign up
              </NavLink>
            </p>
          </div>
          <footer className="bottom-5 absolute ">
            <p className="text-[#8d8d8d]">© 2023 TuneTown</p>
          </footer>
        </div>
      </div>
    </div>
  );
};
export default LoginPage;
