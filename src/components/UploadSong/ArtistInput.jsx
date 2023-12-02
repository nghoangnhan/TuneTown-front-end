import { Form, Select } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { Base_URL } from "../../api/config";
import useDebounce from "../../hooks/useDebounce";
import UseCookie from "../../hooks/useCookie";

const ArtistInput = () => {
  // Get the users name from API
  const { getToken } = UseCookie();
  const { access_token } = getToken();
  const [nameRS, setNameRS] = useState([]);
  const [emailRS, setEmailRS] = useState([]); // Update to initialize emailRS as an empty array
  const [emailInput, setEmailInput] = useState("");
  const [userData, setUserData] = useState();
  const inputDebounce = useDebounce(emailInput, 500);
  const handleEmailChange = (value) => {
    // setEmailInput(e.target.value);
    setEmailInput(value);
  };
  const getName = async (emailInput) => {
    try {
      const response = await axios.get(`${Base_URL}/users/getUsers`, {
        params: {
          email: emailInput,
        },
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      response.data.forEach((user) => {
        console.log("email", user.email);
        // Check if email existed and email not changed
        if (user.email && user.userName) {
          if (!nameRS.includes(user.userName)) {
            setNameRS((prevNames) => [...prevNames, user.userName]);
          }
          if (!emailRS.includes(user.email)) {
            setEmailRS((prevEmails) => [...prevEmails, user.email]);
          }
        }
      });

      setUserData(response.data); // Lưu dữ liệu vào state userData
      console.log("response", response.data);

      console.log("nameRS", nameRS);
      console.log("emailRS", emailRS);
      return response.data;
    } catch (error) {
      console.log("Error:", error);
    }
  };
  useEffect(() => {
    console.log("emailInput", emailInput);
    if (inputDebounce) {
      getName(emailInput);
    } else {
      getName();
    }
  }, [emailInput, inputDebounce]);

  const filterOption = (input, option) =>
    (option?.value ?? "").toLowerCase().includes(input.toLowerCase());
  return (
    <Form.Item
      name="artists"
      label="Song Artist"
      rules={[
        {
          required: true,
        },
      ]}
    >
      {/* <Input onChange={handleEmailChange} /> */}
      <Select
        showSearch
        mode="multiple"
        placeholder="Select Artist Email"
        optionFilterProp="children"
        onChange={handleEmailChange}
        onSearch={handleEmailChange}
        filterOption={filterOption}
        options={emailRS.map((email) => ({ key: email, value: email }))}
      />
    </Form.Item>
  );
};

export default ArtistInput;
