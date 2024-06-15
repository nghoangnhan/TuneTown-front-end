import axios from "axios";
import UseCookie from "../hooks/useCookie";
import useConfig from "./useConfig";

export const useDataUtils = () => {
  const { getToken } = UseCookie();
  const { access_token } = getToken();
  const { Base_URL } = useConfig();
  //drop-zone
  const handleUploadFileIMG = async (file) => {
    let formData = new FormData();
    formData.append("image", file);
    // console.log("handleUploadFile FileIMG", formData);
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
        // console.log("Files posted successfully:", response.data);
      } else {
        console.error("Error posting files:", response.data);
      }
      return response;
    } catch (error) {
      console.error("Error posting files:", error.message);
    }
  };

  const handleUploadFileMP3 = async (file) => {
    let formData = new FormData();
    formData.append("mp3File", file);
    // console.log("handleUploadFile FileMP3", formData);
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
        // console.log("Files posted successfully:", response.data);
      } else {
        console.error("Error posting files:", response.data);
      }
      return response;
    } catch (error) {
      console.error("Error posting files:", error.message);
    }
  };
  return { handleUploadFileIMG, handleUploadFileMP3 };
};
export default useDataUtils;
