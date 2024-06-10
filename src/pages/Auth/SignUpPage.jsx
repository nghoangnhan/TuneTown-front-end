/* eslint-disable no-unused-vars */
import { DatePicker, Form, Input, message } from "antd";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import UseCookie from "../../hooks/useCookie";
import useConfig from "../../utils/useConfig";
import { useTranslation } from "react-i18next";

const SignUpPage = () => {
  const passwordRef = useRef();
  const navigate = useNavigate();
  const { removeToken } = UseCookie();
  const { Base_URL } = useConfig();
  const { t } = useTranslation();

  async function PostData(usn, email, password, bdate, method) {
    try {
      const response = await axios.post(`${Base_URL}/auth/register`, {
        userName: usn,
        email: email,
        password: password,
        birthDate: bdate,
      });
      if (response.data) {
        message.success(t("auth.signUpSuccess"));
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      }
      // console.log("Respone Data Sign Up", response.data);
    } catch (error) {
      // console.log("Error Post Data function:", error);
      const errorName = error.response.data.detail;
      message.error(errorName, 2);
      throw error;

    }
  }

  // post data to API
  const onFinish = (values) => {
    // console.log("Data inputed:", values);
    const { username, email, password, birthDate, method } = values;

    PostData(username, email, password, birthDate, method);
  };

  const onFinishFailed = (errorInfo) => {
    // console.log("Failed:", errorInfo);
  };

  useEffect(() => {
    removeToken();
  }, []);
  return (
    <div className="relative flex flex-row items-center justify-center">
      <div className="hidden xl:block xl:w-1/2">
        <img
          src="https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80"
          className="object-cover w-auto h-screen"
          alt=""
        />
      </div>

      <div className="flex flex-col items-center justify-center min-h-screen xl:w-1/2">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary">{t("auth.signUp")}</h1>
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
                message: t("auth.requireName"),
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Birthday"
            name="birthDate"
            rules={[
              { required: true, message: t("auth.requireDateOfBirth") },
              {
                type: "object",
                message: t("auth.notValidDate"),
              },
              {
                validator: async (_, value) => {
                  if (value) {
                    const date = new Date(value);
                    const currentDate = new Date();
                    if (date > currentDate) {
                      return Promise.reject(
                        new Error(t("auth.dateIsNotFuture"))
                      );
                    }
                  }
                },
              },
            ]}
          >
            <DatePicker />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                message: t("auth.requireEmail"),
              },
              {
                type: "email",
                message: t("auth.notValidEmail"),
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
                message: t("auth.requirePassword"),
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
            <Input.Password ref={passwordRef} />
          </Form.Item>

          <Form.Item
            name="confirm"
            label={t("auth.confirmPassword")}
            dependencies={["password"]}
            hasFeedback
            rules={[
              {
                required: true,
                message: t("auth.requireConfirmPassword"),
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error(t("auth.passwordNotMatch"))
                  );
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item className="flex flex-row items-center justify-center">
            <button className="px-3 py-2 mt-2 font-semibold text-white rounded-md shadow-lg bg-primary hover:opacity-70 w-max">
              {t("auth.signUp")}
            </button>
          </Form.Item>
        </Form>

        <div className="text-headingText ">
          {t("auth.haveAccount")}?
          <NavLink to="/login" className="text-[#34a56d] ml-1 text-sm">
            {t("auth.signIn")}
          </NavLink>
        </div>

        <footer className="absolute bottom-5 ">
          <p className="text-[#8d8d8d]">TuneTown ©2024</p>
        </footer>
      </div>
    </div>
  );
};

export default SignUpPage;
