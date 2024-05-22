import { useEffect } from "react";
import axios from "axios";
import { Form, Input, message } from "antd";
import { useForm } from "antd/es/form/Form";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUserInfor } from "../../redux/slice/account";
import GoogleLoginButton from "../../components/AuthLogin/AuthGoogleLogin";
import { gapi } from "gapi-script";
import LoginFacebook from "../../components/AuthLogin/AuthFacebookLogin";
import useConfig from "../../utils/useConfig";
import UseCookie from "../../hooks/useCookie";
import { useTranslation } from "react-i18next";

const clientId =
  "382112670726-viic3uvlj5420j60ajveandtb8j4p0sk.apps.googleusercontent.com";

const LoginPage = () => {
  // eslint-disable-next-line no-unused-vars
  const { removeToken } = UseCookie();
  const { Base_URL, auth } = useConfig();
  const [form] = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { saveToken } = UseCookie();
  const { t } = useTranslation();

  const handleUserData = async (usersData) => {
    console.log("Data", usersData);
    dispatch(setUserInfor(usersData));
    localStorage.setItem("userId", usersData.id);
    localStorage.setItem("userName", usersData.userName);
    localStorage.setItem("userRole", usersData.role);
    localStorage.setItem("darkTheme", false);
    console.log("User infor", usersData);
  };
  // Get access to the API
  async function GetAccessToken(emailInput, passwordInput) {
    try {
      const response = await axios.post(`${Base_URL}/auth/authenticate`, {
        email: emailInput,
        password: passwordInput,
      });
      console.log("Respone Data Sign in", response.data);
      if ((response.data && response.data.access_token) || response.data) {
        // Save cookies and token
        saveToken(response.data.access_token);
        handleUserData(response.data);
        console.log("Token", response.data.access_token);
        // Notifactaion when login successfully
        message.success("Login Successfully");
        setTimeout(() => {
          if (response.data.role === "ADMIN") {
            navigate("/cms/profile");
          } else if (
            response.data.role === "USER" ||
            response.data.role === "ARTIST"
          ) {
            // window.location.href = "/home";
            navigate("/home");
          }
        }, 1000);
      }
      return response.data;
    } catch (error) {
      console.log("Error:", error);
      // Notifactaion when login failed
      message.error("Login Failed");
      throw error;
    }
  }
  // Login
  const onFinish = async (values) => {
    const { email, password } = values;
    await GetAccessToken(email, password);
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  // useEffect(() => {
  //   console.log("Token removed", auth.access_token);
  //   removeToken();
  // }, []);

  useEffect(() => {
    if (auth.access_token) {
      navigate("/home");
    }
  }, [auth.access_token]);

  useEffect(() => {
    function start() {
      gapi.client.init({
        clientId: clientId,
        scope: "",
      });
    }

    gapi.load("client:auth2", start);
  });

  return (
    <div className="relative flex flex-row items-center justify-center">
      <div className="flex flex-col items-center justify-center min-h-screen xl:w-1/2">
        <div className="mb-20">
          <h1 className="text-3xl font-bold text-headingText dark:text-headingTextDark">
            {t("auth.signIn")}
          </h1>
        </div>
        <Form
          form={form}
          className="w-full"
          name="basic"
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 10,
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
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                message: "Please input your email!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label={t("auth.password")}
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

          <Form.Item className="flex flex-row items-center justify-center">
            <button className="px-3 py-2 mt-2 font-semibold text-white rounded-md shadow-lg bg-primary hover:opacity-70 w-max">
              {t("auth.signIn")}
            </button>
          </Form.Item>
        </Form>

        <div className="flex flex-col items-center justify-center gap-2 xl:gap-4">
          <p className="text-headingText dark:text-headingTextDark">
            {t("auth.dontHaveAccount")}?
            <NavLink to="/signup" className="ml-1 text-sm text-primary">
              {t("auth.signUp")}
            </NavLink>
          </p>
          <p className="mb-3 text-headingText dark:text-headingTextDark">
            {t("auth.dontRememberPassword")}?
            <NavLink to="/forgotpass" className="ml-1 text-sm text-primary">
              {t("auth.forgetPassword")}
            </NavLink>
          </p>

          <div>
            <p className="text-[#a8a8ac]">{t("auth.orLoginWith")}</p>
          </div>
          <GoogleLoginButton />
          <LoginFacebook />
        </div>
        <footer className="absolute bottom-5 ">
          <p className="text-[#8d8d8d]">TuneTown ©2024</p>
        </footer>
      </div>
      <div className="hidden xl:block xl:w-1/2">
        <img
          src="https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80"
          className="object-cover w-auto h-screen"
          alt=""
        />
      </div>
    </div>
  );
};
export default LoginPage;
