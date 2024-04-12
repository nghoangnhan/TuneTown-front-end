import { Form, message } from "antd";
import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import UploadFileDropZone from "../../utils/useDropZone";
import useDataUtils from "../../utils/useDataUtils";
import axios from "axios";
import useConfig from "../../utils/useConfig";

const CreatePost = () => {
  const [form] = Form.useForm();
  const { handleUploadFileMP3 } = useDataUtils();
  const [editorValue, setEditorValue] = useState("");
  const { Base_URL } = useConfig();
  const [fileMP3, setFileMP3] = useState();
  const [uploadedFile, setUploadedFile] = useState({});
  const [songReady, setSongReady] = useState(false);
  const userId = localStorage.getItem("userId");

  const UploadMP3file = async (file) => {
    message.loading("Uploading Song File", 1);
    await handleUploadFileMP3(file).then((res) => {
      console.log("UploadMP3file", res);
      if (res.status === 200 || res.status === 201) {
        setFileMP3(res.data);
        setSongReady(true);
        message.success("Song File Uploaded Successfully", 2);
      }
    });
  };

  const onFinish = (values) => {
    if (fileMP3 == null) {
      message.error("Please upload a song file", 2);
      return;
    }
    try {
      console.log("Received values:", values);
      console.log("Received values:", fileMP3);
      const response = axios.post(`${Base_URL}/post/create`, {
        author: userId,
        title: values.title,
        content: values.content,
        song: fileMP3,
        playlist: 452,
        likes: 0,
        dislikes: 0,
        listComments: null,
      });
      if (response.status === 200) {
        message.success("Post Created Successfully", 2);
      }

      form.resetFields();
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="bg-[#FFFFFFCC] mt-4">
      <Form
        form={form}
        layout="vertical"
        name="basic"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          label="Title"
          name="title"
          rules={[{ required: true, message: "Please input your title!" }]}
        >
          <input
            className="w-full h-10 px-3 text-base placeholder-gray-600 border rounded-lg focus:shadow-outline"
            placeholder="Title"
          />
        </Form.Item>
        <Form.Item
          label="Content"
          name="content"
          rules={[{ required: true, message: "Please input your content!" }]}
        >
          <ReactQuill
            theme="snow"
            value={editorValue}
            onChange={setEditorValue}
          />
        </Form.Item>

        {/* Upload Song  */}
        <Form.Item
          name="songData"
          label="Upload File"
          extra="Upload your audio file mp3, wav. Please wait for the file to be uploaded before submitting."
          getValueFromEvent={(e) => e && e.fileList}
          valuePropName="fileList"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <div className="flex flex-row items-center gap-2">
            <UploadFileDropZone
              uploadedFile={uploadedFile}
              setUploadedFile={setUploadedFile}
              handleUploadFile={UploadMP3file}
              accept="audio/mp3"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="20"
              viewBox="0 -960 960 960"
              width="20"
              className={`${songReady ? "" : "hidden"}`}
              fill={`${songReady ? "#42ae49" : ""}`}
            >
              <path d="M316.231-280.54q-83.295 0-141.762-57.879-58.468-57.879-58.468-141.004 0-84.269 60.896-141.768 60.895-57.5 146.334-57.5h378.615q59.23 0 100.691 41.077 41.462 41.076 41.462 100.307 0 60.23-43.962 100.806-43.961 40.577-105.191 40.577H339.462q-34.761 0-59.418-24.219-24.658-24.219-24.658-59.033 0-35.67 25.622-59.9 25.622-24.231 62.454-24.231h361.152v51.999H339.462q-13.477 0-22.778 9.108-9.3 9.108-9.3 22.585t9.3 22.585q9.301 9.108 22.778 9.108H702.23q37.308.384 63.539-25.777T792-537.505q0-37.459-27.423-63.323-27.423-25.865-64.731-25.865H316.231q-61.538.385-104.385 43.154Q169-540.769 168-479.284q-1 61.465 44.346 104.49 45.347 43.025 108.885 42.256h383.383v51.998H316.231Z" />
            </svg>
          </div>
        </Form.Item>

        {/* Playlist */}
        <Form.Item>
          <button
            type="button"
            className="w-full h-10 px-3 text-base text-white transition-colors duration-150 bg-[#59c26d] rounded-lg focus:shadow-outline hover:bg-[#58ec73]"
          >
            Add Playlist
          </button>
        </Form.Item>

        <Form.Item>
          <button
            type="submit"
            className="w-full h-10 px-3 text-base text-white transition-colors duration-150 bg-[#59c26d] rounded-lg focus:shadow-outline hover:bg-[#58ec73]"
          >
            Submit
          </button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CreatePost;
