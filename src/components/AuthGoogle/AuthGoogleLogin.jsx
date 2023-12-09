import { GoogleLogin } from "react-google-login";
import axios from "axios";
import { Base_URL } from "../../api/config";
import { useNavigate } from "react-router-dom";
import UseCookie from "../../hooks/useCookie";
import { useDispatch } from "react-redux";
import { setUserInfor } from "../../redux/slice/account";
import { message } from "antd";

const clientId =
  "382112670726-viic3uvlj5420j60ajveandtb8j4p0sk.apps.googleusercontent.com";

function LoginGoogle() {
  const { saveToken } = UseCookie();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userId = localStorage.getItem("userId");

  const handleUserData = async (usersData) => {
    console.log("Data", usersData);
    dispatch(setUserInfor(usersData));
    localStorage.setItem("userId", usersData.id);
    localStorage.setItem("userName", usersData.userName);
    localStorage.setItem("userRole", usersData.role);
    console.log("User infor", usersData);
  };

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
        setTimeout(() => {
          if (response.data.role === "ADMIN") {
            navigate("/cms/usermanagement");
          } else if (
            response.data.role === "USER" ||
            response.data.role === "ARTIST"
          ) {
            // navigate("/home");
          }
        }, 1000);
      }
      return response.data;
    } catch (error) {
      console.log("Error:", error);
      throw error;
    }
  }

  async function Register(usn, email, password, avatar) {
    try {
      await axios.post(`${Base_URL}/auth/register`, {
        userName: usn,
        email: email,
        password: password,
        avatar: avatar,
        method: "GOOGLE",
      });
    } catch (error) {
      console.log("Error Post Data function:", error);
      throw error;
    }
  }

  // Check email
  async function checkEmailExisted(userEmail) {
    const response = await axios.post(
      `${Base_URL}/auth/checkEmailExisted?userEmail=${userEmail}`
    );
    return response.data;
  }

  // Edit user
  async function editUser(values, access_token) {
    try {
      const response = await axios.put(
        `${Base_URL}/users`,
        {
          id: userId,
          userName: values.name,
          avatar: values.imageUrl,
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

  const onSuccess = async (res) => {
    const values = res.profileObj;
    const isEmailExisted = await checkEmailExisted(values.email);
    if (!isEmailExisted) {
      await Register(values.name, values.email, "GOOGLE", values.imageUrl);
    }
    const getAccessToken = await GetAccessToken(values.email, "GOOGLE");
    await editUser(values, getAccessToken.access_token);
    message.success("Login Successfully");
    setTimeout(() => {
      navigate("/home");
    }, 1000);
  };
  const onFailure = (res) => {
    console.log("LOGIN failed! res:", res);
  };

  return (
    <div id="btn-auth-google-login">
      <GoogleLogin
        clientId={clientId}
        buttonText="Login with Google"
        onSuccess={onSuccess}
        onFailure={onFailure}
        cookiePolicy={"single_host_origin"}
        className="!rounded-lg !shadow-lg !bg-[#fff] !text-[#3e3c3c] !hover:bg-[#f1f1f1] !transition-all !duration-300 !ease-in-out !cursor-pointer
        "
      />
    </div>
  );
}

export default LoginGoogle;
