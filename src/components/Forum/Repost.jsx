import { Form, message } from "antd";
import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import useConfig from "../../utils/useConfig";
import AudioWaveSurfer from "./AudioWaveSurfer";
import UseCookie from "../../hooks/useCookie";
import DOMPurify from 'dompurify';
import Parser from 'html-react-parser';
import PropTypes from 'prop-types';

const Repost = ({ song, closeModal }) => {
  const [form] = Form.useForm();
  const [editorValue, setEditorValue] = useState("");
  const { Base_URL } = useConfig();
  const userId = parseInt(localStorage.getItem("userId"));
  const { getToken } = UseCookie();
  const { access_token } = getToken();

  const onFinish = (values) => {
    try {
      const sanitizedContent = DOMPurify.sanitize(values.content);
      const contentParser = Parser(sanitizedContent).props.children;
      const response = axios.post(`${Base_URL}/post/create`, {
        author: {
          id: userId
        },
        content: contentParser,
        song: {
          id: song.id,
        },
        playlist: null,
        likes: null,
        listComments: null,
        mp3Link: ""
      }, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        }
      });
      if (response.status === 200) {
        message.success("Repost Successfully", 2);
      }
      form.resetFields();
      closeModal();
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="mt-4 bg-backgroundComponentPrimary dark:bg-backgroundComponentDarkPrimary">
      <Form
        form={form}
        layout="vertical"
        name="basic"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          label="Content"
          name="content"
          rules={[{ required: true, message: "Please input your content!" }]}
        >
          <ReactQuill
            theme="snow"
            value={Parser(editorValue)}
            onChange={setEditorValue}
          />
        </Form.Item>
        {/* Audio Wave */}
        <div className="w-full">
          <AudioWaveSurfer song={song}></AudioWaveSurfer>
        </div>
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
Repost.propTypes = {
  song: PropTypes.object,
  closeModal: PropTypes.func,
};
export default Repost;
