import { Form, Select } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import useDebounce from "../../hooks/useDebounce";
import UseCookie from "../../hooks/useCookie";
import useConfig from "../../utils/useConfig";
import { useTranslation } from "react-i18next";

const ArtistInput = () => {
  const { Base_URL } = useConfig();
  // Get the users name from API
  const { getToken } = UseCookie();
  const { access_token } = getToken();
  const [emailRS, setEmailRS] = useState([]);
  const [artistRS, setArtistRS] = useState([]); // [{id:"",name: "", email: ""}]
  const [emailInput, setEmailInput] = useState("");
  const { t } = useTranslation();
  const inputDebounce = useDebounce(emailInput, 500);
  const handleEmailChange = (value) => {
    setEmailInput(value);
  };

  // const getArtist = async (emailInput) => {
  //   try {
  //     const response = await axios.get(`${Base_URL}/users/getUsers`, {
  //       params: {
  //         email: emailInput,
  //       },
  //       headers: {
  //         Authorization: `Bearer ${access_token}`,
  //       },
  //     });
  //     return response.data.filter((user) => user.role === "ARTIST");
  //     // return response.data;
  //   } catch (error) {
  //     console.log("Error:", error);
  //   }
  // };

  const getAllUser = async () => {
    try {
      const response = await axios.get(`${Base_URL}/users`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      // console.log("Response", response.data.users);
      return response.data.users;
    } catch (error) {
      console.log("Error:", error);
    }
  };

  useEffect(() => {
    if (inputDebounce === "") {
      setEmailRS([]);
      setArtistRS([]);
    } else if (inputDebounce !== "") {
      getAllUser().then((response) => {
        response.forEach((user) => {
          // Check if email existed and email not changed
          if (user.id != null && user.email != null && user.userName != null) {
            if (!artistRS.includes(user) && !emailRS.includes(user.email)) {
              setEmailRS((prevEmails) => [...prevEmails, user.email]);
              setArtistRS((prevArtists) => [
                ...prevArtists,
                { id: user.id, name: user.userName, email: user.email },
              ]);
            }
          }
        });

        // console.log("ArtistRS", artistRS);
        // console.log("emailRS", emailRS);
      });
    }
  }, [emailInput, inputDebounce]);

  const filterOption = (input, option) => {
    return String(option.label).toLowerCase().includes(input.toLowerCase());
  };
  return (
    <Form.Item
      name="artists"
      label={t("modal.songArtist")}
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
        placeholder={t("modal.selectArtist")}
        optionFilterProp="children"
        // onChange={handleEmailChange}
        onSearch={handleEmailChange}
        filterOption={filterOption}
        options={artistRS.map((artist) => {
          // console.log("artist", artist);
          return { value: artist.id, label: artist.name };
        })}
      />
    </Form.Item>
  );
};

ArtistInput.propTypes = {};

export default ArtistInput;
