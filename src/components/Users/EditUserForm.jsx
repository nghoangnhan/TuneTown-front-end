import { useEffect, useState } from "react";
import { Button, DatePicker, Form, Input, message } from "antd";
import UseCookie from "../../hooks/useCookie";
import dayjs from "dayjs";
import useConfig from "../../utils/useConfig";
import useUserUtils from "../../utils/useUserUtils";
import { useDispatch, useSelector } from "react-redux";
import { setRefershAccount } from "../../redux/slice/account";
import UploadFileDropZone from "../../utils/useDropZone";
import useDataUtils from "../../utils/useDataUtils";
import { useForm } from "antd/es/form/Form";
import PropTypes from "prop-types";

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};
const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 16,
  },
};

// eslint-disable-next-line no-unused-vars
const EditUserForm = ({ isAdmin, isModal, setOpenModalEditUser }) => {
  const { getToken } = UseCookie();
  const { access_token } = getToken();
  const userId = localStorage.getItem("userId");
  const { default_Img } = useConfig();
  const dispatch = useDispatch();
  const { editUser, getUserInfor } = useUserUtils();
  const { handleUploadFileIMG, } = useDataUtils();
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
    <section className={`${isModal ? "" : "h-fit pt-6 pb-20"} bg-backgroundPrimary dark:bg-backgroundDarkPrimary`}>
      <Form
        {...layout}
        name="control-ref"
        form={form}
        onFinish={onFinish}
        className={`
        ${isModal ? "w-full" : "w-1/2"} m-auto bg-backgroundPlaylist text-primaryText2 p-5 rounded-lg`}
      >
        <div className="w-full mb-5 text-center">
          <h2 className="text-3xl font-bold uppercase font-monserrat ">
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
              accept="image/*"
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
          <Input />
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
          <Input />
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
          <Input disabled />
        </Form.Item>
        <Form.Item
          label="Birthday"
          name="birthDate"
          rules={[
            { required: true, message: "Please input your date of birth!" },
          ]}
        >
          <DatePicker />
        </Form.Item>

        <Form.Item {...tailLayout} className="left-0">
          <Button type="primary" htmlType="submit" className="bg-[green] ">
            Submit
          </Button>
        </Form.Item>
        {loading && (
          <div className="overlay">
            <img src={default_Img} alt="Loading..." width={100} height={100} className="zoom-in-out" />
          </div>
        )}
      </Form>
    </section>);
};

EditUserForm.propTypes = {
  isAdmin: PropTypes.bool.isRequired,
  isModal: PropTypes.bool.isRequired,
  setOpenModalEditUser: PropTypes.func.isRequired,
};
export default EditUserForm;
