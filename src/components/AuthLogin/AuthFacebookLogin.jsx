import React from "react";
import axios from "axios";
import { Base_URL } from "../../api/config";
import { useNavigate } from "react-router-dom";
import UseCookie from "../../hooks/useCookie";
import { useDispatch } from "react-redux";
import { setUserInfor } from "../../redux/slice/account";
import { message } from "antd";
import { LoginSocialFacebook } from "reactjs-social-login";
import { FacebookLoginButton } from "react-social-login-buttons";
import { jwtDecode } from "jwt-decode";

function LoginFacebook() {
  const { saveToken } = UseCookie();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleUserData = async (userData) => {
    console.log("Data", userData);
    dispatch(setUserInfor(userData));
    // Save user info to localStorage
    localStorage.setItem("userId", userData.id);
    localStorage.setItem("userName", userData.userName);
    localStorage.setItem("userRole", userData.role);
    console.log("User facebook info", userData);
  };

  async function GetAccessToken(emailInput, passwordInput) {
    try {
      const response = await axios.post(`${Base_URL}/auth/authenticate`, {
        email: emailInput,
        password: passwordInput,
      });
      console.log("Response Data Facebook Sign in", response.data);
      if (response.data && response.data.access_token) {
        // Save token to cookie
        saveToken(response.data.access_token);
        handleUserData(response.data);
      }
      return response.data;
    } catch (error) {
      console.log("Error:", error);
      throw error;
    }
  }

  async function Register(username, email, password, avatar) {
    try {
      await axios.post(`${Base_URL}/auth/register`, {
        userName: username,
        email: email,
        password: password,
        avatar: avatar,
        method: "FACEBOOK",
      });
    } catch (error) {
      console.log("Error Post Data function:", error);
      throw error;
    }
  }

  // Edit user to update avatar and name from facebook to the header
  async function editUser(values, access_token) {
    try {
      const response = await axios.put(
        `${Base_URL}/users`,
        {
          id: userId,
          userName: values.name,
          avatar: values.picture.data.url,
        },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      console.log("editUser", response.data, response.status);
    } catch (error) {
      console.error("Error update user:", error.message);
    }
  }

  const responseFacebook = async (response) => {
    console.log(response.data);
    const { name, email } = response.data;
    const avatar = response.data.picture.data.url;


    // Check email exist
    const isEmailExisted = await checkEmailExisted(email);
    console.log(isEmailExisted);
    if (!isEmailExisted) {
      // if email not exist, register new user
      await Register(name, email, "FACEBOOK", avatar);
    }

    // get access_token and update user info
    const getAccessToken = await GetAccessToken(email, "FACEBOOK");
    const credential = getAccessToken.access_token;
    const account = jwtDecode(credential);
    console.log("value", account);

    console.log(credential);
    
    await editUser(account, getAccessToken.access_token);

    message.success("Login Successfully");

    // Navigate to /home after successful login
    setTimeout(() => {
      navigate("/home");
    }, 1000);
  };

  const checkEmailExisted = async (userEmail) => {
    const response = await axios.post(
      `${Base_URL}/auth/checkEmailExisted?userEmail=${userEmail}`
    );
    return response.data;
  };

  const onFailure = (error) => {
    console.log("Login failed! Error:", error);
    message.error("Login Failed");
  };

  return (
    <LoginSocialFacebook
        appId="961587055526538"
        onResolve={responseFacebook}
        onReject={onFailure}
    >
        <FacebookLoginButton/>
    </LoginSocialFacebook>
  );
}

export default LoginFacebook;