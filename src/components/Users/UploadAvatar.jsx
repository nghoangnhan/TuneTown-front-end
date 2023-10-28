import { Button, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
const UploadAvatar = () => {
  return (
    <Upload name="logo" action="/" listType="picture">
      <Button icon={<UploadOutlined />}>Click to upload</Button>
    </Upload>
  );
};

export default UploadAvatar;
