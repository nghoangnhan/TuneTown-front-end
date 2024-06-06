import { useForm } from "antd/es/form/Form";
import { NavLink, useNavigate } from "react-router-dom";
import { Form, Input, Tour, message } from "antd";
import axios from "axios";
import useConfig from "../../utils/useConfig";
import useIconUtils from "../../utils/useIconUtils";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";

const ForgotPass = () => {
  const [form] = useForm();
  const { Base_URL, Base_AVA } = useConfig();
  const { t } = useTranslation()
  const { HintIcon } = useIconUtils();
  const navigate = useNavigate();
  const [openTour, setOpenTour] = useState(false);
  const hintRef1 = useRef();
  const hintRef2 = useRef();
  const hintRef3 = useRef();
  const hintRef4 = useRef();

  const forgetTour = [
    {
      title: t("auth.tourEmail"),
      description: t("auth.tourEmailDetail"),
      target: () => hintRef1.current,
    },
    {
      title: t("auth.tourGetOTP"),
      description: t("auth.tourGetOTPDetail"),
      target: () => hintRef2.current,
    },
    {
      title: t("auth.tourOTP"),
      description: t("auth.tourOTPDetail"),
      target: () => hintRef3.current,
    },
    {
      title: t("auth.tourNewPass"),
      description: t("auth.tourNewPassDetail"),
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
      // console.log("Respone changePassword data", response.data);
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
      // console.log("Respone CheckOTP data", response.data);
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
      message.loading(t("auth.sendingOTP"), 1);

      GetOTP(emailValue).then((response) => {
        if (response) {
          message.success(response, 2);
        } else {
          message.error(response, 2);
        }
      });
    } else {
      message.error(t("auth.requireEmail")); // Notify the user that the email is required
    }
  };

  // Change Password
  const handleChangePassword = async () => {
    const emailValue = form.getFieldValue("email");
    const OTPValue = form.getFieldValue("OTP");
    try {
      if (emailValue && OTPValue) {
        message.loading(t("auth.checkingOTP"), 1);
        const checkOTP = await CheckOTP(emailValue, OTPValue);
        if (checkOTP == true) {
          const newPasswordValue = form.getFieldValue("newPassword");
          if (newPasswordValue && newPasswordValue.length >= 0) {
            ChangePassword(emailValue, OTPValue, newPasswordValue);
            setTimeout(() => {
              message.success(t("auth.changePasswordSuccess"), 2);
            }, 1000);
            setTimeout(() => {
              navigate("/login");
            }, 2000);
          } else {
            message.error(t("auth.requireNewPass"));
          }
        } else {
          setTimeout(() => {
            message.error(t("auth.wrongOTP"), 2);
          }, 1000);
        }
      } else {
        message.error(t("auth.requireEmailandOTP"));
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
            {t("auth.forgetPassword")}
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
                message: t("auth.requireEmail")
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
                message: t("auth.requireOTP"),
              },
            ]}
          >
            <div className="flex flex-row items-center gap-2">
              <div ref={hintRef3}>
                <Input />
              </div>
              <button
                className="h-10 px-1 py-1 border rounded-md border-primary text-primary w-28"
                onClick={() => handleSendOTP()}
                ref={hintRef2}
                type="button"
              >
                {t("auth.getOTP")}
              </button>
            </div>
          </Form.Item>
          <Form.Item
            label={t("auth.newPassword")}
            name="newPassword"
            rules={[
              {
                required: true,
                message: t("auth.requireNewPass"),
              },
              {
                min: 8,
                message: t("auth.require8CharPassword"),
              },
              {
                // Require uppercase, lowercase, number, and special character
                pattern: new RegExp(
                  "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])"
                ),
                message:
                  t("auth.requireSpecialCharPass"),
              }
            ]}
          >
            <div ref={hintRef4}>
              <Input.Password />
            </div>
          </Form.Item>
          <Form.Item
            className="flex flex-row items-center justify-center">
            <button
              onClick={handleChangePassword}
              className="w-full px-3 py-2 font-semibold text-primary rounded-md shadow-lg min-w-[150px] border border-primary hover:opacity-70 "
            >
              {t("auth.changePassword")}
            </button>
          </Form.Item>
        </Form>

        <div className="">
          <p className="text-headingText ">
            {t("auth.backToSignIn")}?
            <NavLink to="/login" className="ml-1 text-sm text-primary">
              {t("auth.signIn")}
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
