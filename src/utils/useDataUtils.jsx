import axios from "axios";
import { Base_URL } from "../api/config";
import { message } from "antd";
import UseCookie from "../hooks/useCookie";

export const useDataUtils = () => {
  const { getToken } = UseCookie();
  const { access_token } = getToken();

  //drop-zone
  const handleUploadFileIMG = async (file) => {
    let formData = new FormData();
    formData.append("image", file);
    console.log("handleUploadFile FileIMG", formData);
    message.loading("Uploading Image", 1);
    try {
      const response = await axios.post(
        `${Base_URL}/file/uploadImage`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status == 200) {
        console.log("Files posted successfully:", response.data);
        message.success("Image Uploaded Successfully", 2);
        return response.data;
      }
    } catch (error) {
      console.error("Error posting files:", error.message);
    }
  };

  const handleUploadFileMP3 = async (file) => {
    let formData = new FormData();
    formData.append("mp3File", file);
    console.log("handleUploadFile FileMP3", formData);
    message.loading("Uploading Song File", 1);
    try {
      const response = await axios.post(
        `${Base_URL}/file/uploadMp3`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status == 200) {
        console.log("Files posted successfully:", response.data);
        message.success("Song File Uploaded Successfully", 2);
      } else {
        console.error("Error posting files:", response.data);
      }
    } catch (error) {
      console.error("Error posting files:", error.message);
    }
  };

  return { handleUploadFileIMG, handleUploadFileMP3 };
};