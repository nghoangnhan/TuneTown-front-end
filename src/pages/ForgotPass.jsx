import { useForm } from "antd/es/form/Form";
import { NavLink, useNavigate } from "react-router-dom";
import { Form, Input, message } from "antd";
import { Base_URL } from "../api/config";
import axios from "axios";

const ForgotPass = () => {
  const [form] = useForm();
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  const GetOTP = async (emailInput) => {
    try {
      const response = await axios.post(`${Base_URL}/auth/forgetPassword`, {
        email: emailInput,
        otp: "",
        type: "getOTP",
        newPassword: "",
      });
      console.log("Respone GetOTP data", response.data);
    } catch (error) {
      console.error(error);
    }
  };
  // Check OTP
  const CheckOTP = async (emailInput, otpInput) => {
    try {
      const response = await axios.post(`${Base_URL}/auth/forgetPassword`, {
        email: emailInput,
        otp: otpInput,
        type: "verifyOTP",
        newPassword: "",
      });
      console.log("Respone CheckOTP data", response.data);
      if (response.status === 400) {
        return false;
      }
      return true;
    } catch (error) {
      console.error(error);
    }
  };
  const ChangePassword = async (emailInput, otpInput, newPasswordInput) => {
    try {
      const response = await axios.post(`${Base_URL}/auth/forgetPassword`, {
        email: emailInput,
        otp: otpInput,
        type: "changePassword",
        newPassword: newPasswordInput,
      });
      console.log("Respone changePassword data", response.data);
    } catch (error) {
      console.error(error);
    }
  };

  // Pass the email value directly to GetOTP
  const handleSendOTP = () => {
    const emailValue = form.getFieldValue("email");
    if (emailValue) {
      messageApi.open({
        type: "loading",
        content: "Sending OTP, please wait...",
      });
      GetOTP(emailValue);
    } else {
      messageApi.error("Please input your email."); // Notify the user that the email is required
    }
  };

  // Change Password
  const handleChangePassword = async () => {
    const emailValue = form.getFieldValue("email");
    const OTPValue = form.getFieldValue("captcha");
    try {
      if (emailValue && OTPValue) {
        messageApi.open({
          type: "loading",
          content: "Checking OTP, please wait...",
          duration: 1,
        });
        const checkOTP = await CheckOTP(emailValue, OTPValue);
        if (checkOTP == true) {
          const newPasswordValue = form.getFieldValue("newPassword");
          if (newPasswordValue && newPasswordValue.length >= 0) {
            ChangePassword(emailValue, OTPValue, newPasswordValue);
            setTimeout(() => {
              messageApi.open({
                type: "success",
                content: "Change password successfully.",
              });
            }, 1000);
            setTimeout(() => {
              navigate("/");
            }, 2000);
          } else {
            messageApi.error("Please input your new password.");
          }
        } else {
          setTimeout(() => {
            messageApi.open({
              type: "error",
              content: "OTP is not correct.",
              duration: 2,
            });
          }, 1000);
        }
      } else {
        messageApi.error("Please input your email and OTP.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col justify-center bg-[#FFFFFFCC]">
      {contextHolder}
      <div className="flex flex-col flex-1 items-center relative">
        <div className="hidden xl:block mt-10 mb-5">
          <img
            src="https://cdn-icons-png.flaticon.com/512/10480/10480727.png"
            className="h-48 w-auto object-cover"
            alt=""
          />
        </div>

        <div className="flex flex-col justify-center items-center mt-10">
          <h1 className="font-bold text-[#2E3271] text-3xl mb-10">
            Forget Password
          </h1>

          <Form
            form={form}
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
              label="OTP"
              name="captcha"
              className=""
              rules={[
                {
                  required: true,
                  message: "Please input your CAPTCHA!",
                },
              ]}
            >
              <div className="flex flex-row gap-2">
                <Input />
                <button
                  className="w-28 h-12 rounded-md py-1 px-1 bg-green-500 text-white"
                  onClick={handleSendOTP}
                >
                  Get OTP
                </button>
              </div>
            </Form.Item>
            <Form.Item
              label="New Password"
              name="newPassword"
              rules={[
                {
                  required: true,
                  message: "Please input new password!",
                },
              ]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item
              className="flex flex-row justify-center items-center"
              wrapperCol={{
                offset: 8,
                span: 16,
              }}
            >
              <button
                onClick={handleChangePassword}
                className="bg-[#38a870] text-white hover:bg-[#54ce91] hover:text-[#fff] py-2 px-3 w-max rounded-lg font-semibold"
              >
                Submit
              </button>
            </Form.Item>
          </Form>

          <div>
            <p className="text-[#2E3271]">
              Back to Login?
              <NavLink to="/" className="text-[#34a56d] ml-1 text-sm">
                Sign in
              </NavLink>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPass;
