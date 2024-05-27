import { useForm } from "antd/es/form/Form";
import { NavLink, useNavigate } from "react-router-dom";
import { Form, Input, Tour, message } from "antd";
import axios from "axios";
import useConfig from "../../utils/useConfig";
import useIconUtils from "../../utils/useIconUtils";
import { useRef, useState } from "react";

const ForgotPass = () => {
  const [form] = useForm();
  const { Base_URL, Base_AVA } = useConfig();
  const { HintIcon } = useIconUtils();
  const navigate = useNavigate();
  const [openTour, setOpenTour] = useState(false);
  const hintRef1 = useRef();
  const hintRef2 = useRef();
  const hintRef3 = useRef();
  const hintRef4 = useRef();

  const forgetTour = [
    {
      title: "Input Your Email",
      description: "Please enter your email here.",
      target: () => hintRef1.current,
    },
    {
      title: "Get OTP",
      description: "Click here to get OTP.",
      target: () => hintRef2.current,
    },
    {
      title: "Input OTP",
      description: "Please enter the OTP you received here.",
      target: () => hintRef3.current,
    },
    {
      title: "Input New Password",
      description: "Please enter your new password here.",
      target: () => hintRef4.current,
    },
  ];

  // Get OTP
  const GetOTP = async (emailInput) => {
    try {
      const response = await axios.post(`${Base_URL}/auth/forgetPassword`, {
        email: emailInput,
        otp: "",
        type: "getOTP",
        newPassword: "",
      });
      return response.data;
    } catch (error) {
      console.error(error);
    }
  };
  // Change Password
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

  // Handle the send OTP
  const handleSendOTP = () => {
    const emailValue = form.getFieldValue("email");
    if (emailValue) {
      message.loading("Sending OTP, please wait...", 1);

      GetOTP(emailValue).then((response) => {
        if (response) {
          message.success(response, 2);
        } else {
          message.error(response, 2);
        }
      });
    } else {
      message.error("Please input your email."); // Notify the user that the email is required
    }
  };

  // Change Password
  const handleChangePassword = async () => {
    const emailValue = form.getFieldValue("email");
    const OTPValue = form.getFieldValue("OTP");
    try {
      if (emailValue && OTPValue) {
        message.loading("Checking OTP, please wait...", 1);
        const checkOTP = await CheckOTP(emailValue, OTPValue);
        if (checkOTP == true) {
          const newPasswordValue = form.getFieldValue("newPassword");
          if (newPasswordValue && newPasswordValue.length >= 0) {
            ChangePassword(emailValue, OTPValue, newPasswordValue);
            setTimeout(() => {
              message.success("Change password successfully.");
            }, 1000);
            setTimeout(() => {
              navigate("/login");
            }, 2000);
          } else {
            message.error("Please input your new password.");
          }
        } else {
          setTimeout(() => {
            message.error("OTP is not correct.", 2);
          }, 1000);
        }
      } else {
        message.error("Please input your email and OTP.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full min-h-screen bg-backgroundComponentPrimary ">
      <div
        className="flex flex-row items-center justify-center gap-5 text-lg font-bold text-center uppercase cursor-pointer">
        <div>
          <img src={Base_AVA} className="h-24 bg-white rounded-full" alt="Logo TuneTown" />
        </div>
        <div className="text-primary ">TuneTown</div>
      </div>
      <div className="flex flex-col items-center justify-center mt-6">
        <div className="flex flex-row items-center gap-3 mb-10 text-primary ">
          <h1 className="text-3xl font-bold ">
            Forget Password
          </h1>
          <div onClick={() => setOpenTour(true)}>
            <HintIcon></HintIcon>
          </div>
        </div>
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
            <div ref={hintRef1}>
              <Input />
            </div>
          </Form.Item>

          <Form.Item
            label="OTP"
            name="OTP"
            className=""
            rules={[
              {
                required: true,
                message: "Please input your OTP!",
              },
            ]}
          >
            <div className="flex flex-row gap-2">
              <div ref={hintRef3}>
                <Input />
              </div>
              <button
                className="h-10 px-1 py-1 text-white bg-green-500 rounded-md w-28"
                onClick={() => handleSendOTP()}
                ref={hintRef2}
                type="button"
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
                message: "Please input your password!",
              },
              {
                min: 8,
                message: "Password must be at least 8 characters",
              },
              {
                // Require uppercase, lowercase, number, and special character
                pattern: new RegExp(
                  "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])"
                ),
                message:
                  "Password must contain at least one uppercase, one lowercase, one number and one special character",
              }
            ]}
          >
            <div ref={hintRef4}>
              <Input.Password />
            </div>
          </Form.Item>
          <Form.Item
            className="flex flex-row items-center justify-center"

          >
            <button
              onClick={handleChangePassword}
              className="px-3 py-2 font-semibold text-white rounded-md shadow-lg bg-primary hover:opacity-70 "
            >
              Submit
            </button>
          </Form.Item>
        </Form>

        <div className="">
          <p className="text-headingText ">
            Back to Login?
            <NavLink to="/login" className="ml-1 text-sm text-primary">
              Sign in
            </NavLink>
          </p>
        </div>
      </div>
      <Tour
        open={openTour}
        onClose={() => setOpenTour(false)}
        steps={forgetTour}
        mask={{
          style: {
            backgroundColor: "rgba(0, 0, 0, 0.6)",
          },
          clickExit: true,
        }}
        indicatorsRender={(current, total) => (
          <span>
            {current + 1} / {total}
          </span>
        )}
        nextButtonProps={{
          style: {
            backgroundColor: "#10B981",
          },
        }}
      />
    </div>
  );
};

export default ForgotPass;
