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
import { useTranslation } from "react-i18next";

// eslint-disable-next-line no-unused-vars
const EditUserForm = ({ isAdmin, isModal, setRefresh, editUserId, setOpenModalEditUser }) => {
  const { getToken } = UseCookie();
  const { access_token } = getToken();
  const userId = editUserId ? editUserId : localStorage.getItem("userId");
  const dispatch = useDispatch();
  const { t } = useTranslation();
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
    message.loading(t("modal.uploadingImg"), 1);
    await handleUploadFileIMG(file).then((res) => {
      if (res.status === 200) {
        setFileImg(res.data);
        message.success(t("modal.uploadImgSuccess"), 2);
        setLoading(false);
      }
    });
  };

  const onFinish = (values) => {
    if (fileImg === null || fileImg === undefined) {
      message.error(t("modal.coverArtExtra"));
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
    editUser(postData).then(() => {
      setOpenModalEditUser(false);
      dispatch(setRefershAccount(true))
    }); // Call the function to post the song data
  };

  useEffect(() => {
    getUserInfor(userId).then((res) => {
      setUserInfor(res.user);
      // console.log("UserInfor", userInfor);
    });

    setFileImg(userInfor?.avatar);

    form.setFieldsValue({
      userId: userInfor?.id,
      userName: userInfor?.userName,
      userBio: userInfor?.userBio,
      email: userInfor?.email,
      birthDate: dayjs(userInfor?.birthDate),
    });
  }, [userId, editUserId, userInfor?.id]);


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
          {t("modal.updateUser")}
        </h2>
      </div>

      {/* Avatar Image */}
      <Form.Item
        name="songCoverArt"
        label={t("modal.uploadCoverArt")}
        extra={t("modal.coverArtExtra")}
        getValueFromEvent={(e) => e && e.fileList}
        valuePropName="fileList">
        <div className="flex flex-row items-center gap-2">
          <UploadFileDropZone
            uploadedFile={uploadedFile}
            setUploadedFile={setUploadedFile}
            handleUploadFile={UploadIMGfile}
            accept="image/jpeg, image/png"
          />
          {fileImg && <img src={fileImg} alt="" className="object-cover w-16 h-16" />}
        </div>
      </Form.Item>
      <Form.Item
        name="userName"
        label={t("modal.userName")}
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
        label={t("modal.bio")}
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
        label={t("modal.email")}
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input disabled className="dark:bg-backgroundPrimary dark:text-primaryText2" />
      </Form.Item>
      <Form.Item
        label={t("modal.dateOfBirth")}
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
        <DatePicker className="dark:bg-backgroundPrimary" />
      </Form.Item>

      <Form.Item  >
        <button type="submit" className="absolute px-2 py-2 border rounded-md right-2 border-primary dark:border-primaryDarkmode text-primary dark:text-primaryDarkmode">
          {t("button.submit")}
        </button>
      </Form.Item>
      <LoadingLogo loading={loading}></LoadingLogo>
    </Form>
  );
};

EditUserForm.propTypes = {
  isAdmin: PropTypes.bool.isRequired,
  isModal: PropTypes.bool.isRequired,
  setOpenModalEditUser: PropTypes.func,
  editUserId: PropTypes.string,
  setRefresh: PropTypes.func,
};
export default EditUserForm;
