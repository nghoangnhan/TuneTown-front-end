import { Button, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useState } from "react";
const UploadAvatar = () => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  return (
    <Upload name="avatar" action="/" listType="picture">
      <Button icon={<UploadOutlined />}>Click to upload</Button>
    </Upload>
  );
};

export default UploadAvatar;
