import { useEffect, useState } from "react";
import { DatePicker, Form, Input, message } from "antd";
import UseCookie from "../../hooks/useCookie";
import dayjs from "dayjs";
import useUserUtils from "../../utils/useUserUtils";
import { useDispatch, useSelector } from "react-redux";
import { setRefershAccount } from "../../redux/slice/account";
import UploadFileDropZone from "../../utils/useDropZone";
import useDataUtils from "../../utils/useDataUtils";
import { useForm } from "antd/es/form/Form";
import PropTypes from "prop-types";
import useIconUtils from "../../utils/useIconUtils";

// eslint-disable-next-line no-unused-vars
const EditUserForm = ({ isAdmin, isModal, setOpenModalEditUser }) => {
  const { getToken } = UseCookie();
  const { access_token } = getToken();
  const userId = localStorage.getItem("userId");
  const dispatch = useDispatch();
  const { editUser, getUserInfor } = useUserUtils();
  const { handleUploadFileIMG, } = useDataUtils();
  const { LoadingLogo } = useIconUtils();
  const refreshAccount = useSelector((state) => state.account.refreshAccount);
  const [form] = useForm();
  const [userInfor, setUserInfor] = useState();
  const [fileImg, setFileImg] = useState();
  const [uploadedFile, setUploadedFile] = useState({});
  const [loading, setLoading] = useState(false);

  const UploadIMGfile = async (file) => {
    setLoading(true);
    message.loading("Uploading Image", 1);
    await handleUploadFileIMG(file).then((res) => {
      if (res.status === 200) {
        setFileImg(res.data);
        message.success("Image Uploaded Successfully", 2);
        setLoading(false);
      }
    });
  };

  const onFinish = (values) => {
    if (fileImg === null || fileImg === undefined) {
      message.error("Please upload jpg, jpeg or png");
      return;
    }
    const postData = {
      id: userId,
      avatar: fileImg,
      userName: values.userName,
      userBio: values.userBio,
      email: values.email,
      birthDate: values.birthDate.format("YYYY-MM-DD"),
    };
    editUser(postData).then(dispatch(setRefershAccount(true))); // Call the function to post the song data
    setOpenModalEditUser(false);
  };

  useEffect(() => {
    getUserInfor(userId).then((res) => {
      setUserInfor(res.user);
      console.log("UserInfor", res.user);
    });
    if (userInfor?.avatar) {
      setFileImg(userInfor.avatar);
    }
    form.setFieldsValue({
      userId: userInfor?.id,
      userName: userInfor?.userName,
      userBio: userInfor?.userBio,
      email: userInfor?.email,
      birthDate: dayjs(userInfor?.birthDate),
    });
  }, [userId, userInfor?.id]);


  useEffect(() => {
    if (access_token == null) {
      window.location.href = "/";
    }
  }, [access_token]);


  useEffect(() => {
    if (refreshAccount == true) { getUserInfor(userId); }
  }, [refreshAccount]);

  return (
    <Form
      name="control-ref"
      form={form}
      onFinish={onFinish}
      className={`flex flex-col bg p-5 formStyle bg-backgroundComponentPrimary dark:bg-backgroundComponentDarkPrimary`}
    >
      <div className="w-full mb-5 text-center">
        <h2 className="text-3xl font-bold uppercase font-monserrat text-primary dark:text-primaryDarkmode">
          Edit User Information
        </h2>
      </div>

      {/* Avatar Image */}
      <Form.Item
        name="songCoverArt"
        label="Upload Cover Art"
        extra="Upload your cover art image. Please wait for the file to be uploaded before submitting."
        getValueFromEvent={(e) => e && e.fileList}
        valuePropName="fileList">
        <div className="flex flex-row items-center gap-2">
          <UploadFileDropZone
            uploadedFile={uploadedFile}
            setUploadedFile={setUploadedFile}
            handleUploadFile={UploadIMGfile}
            accept="image/jpeg, image/png"
          />
          {fileImg && <img src={fileImg} alt="" className="w-16 h-16" />}
        </div>
      </Form.Item>
      <Form.Item
        name="userName"
        label="Name"
        rules={[
          {
            required: true,
          },
        ]}
      // initialValue={userInfor.userName}
      >
        <Input className="dark:bg-backgroundPrimary" />
      </Form.Item>

      <Form.Item
        name="userBio"
        label="Bio"
        rules={[
          {
            required: false,
          },
        ]}
      >
        <Input className="dark:bg-backgroundPrimary" />
      </Form.Item>

      <Form.Item
        name="email"
        label="Email"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input disabled className="dark:bg-backgroundPrimary dark:text-primaryText2" />
      </Form.Item>
      <Form.Item
        label="Birthday"
        name="birthDate"
        rules={[
          { required: true, message: "Please input your date of birth!" },
        ]}
      >
        <DatePicker className="dark:bg-backgroundPrimary" />
      </Form.Item>

      <Form.Item  >
        <button type="submit" className="absolute px-2 py-2 border rounded-md right-2 border-primary dark:border-primaryDarkmode text-primary dark:text-primaryDarkmode">
          Save Changes
        </button>
      </Form.Item>
      <LoadingLogo loading={loading}></LoadingLogo>
    </Form>
  );
};

EditUserForm.propTypes = {
  isAdmin: PropTypes.bool.isRequired,
  isModal: PropTypes.bool.isRequired,
  setOpenModalEditUser: PropTypes.func.isRequired,
};
export default EditUserForm;
