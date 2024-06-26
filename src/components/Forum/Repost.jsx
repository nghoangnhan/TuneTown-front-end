import { Form, message } from "antd";
import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import useConfig from "../../utils/useConfig";
import UseCookie from "../../hooks/useCookie";
import DOMPurify from 'dompurify';
import Parser from 'html-react-parser';
import PropTypes from 'prop-types';

const Repost = ({ song, closeModal }) => {
  const [form] = Form.useForm();
  const [editorValue, setEditorValue] = useState("");
  const { Base_URL } = useConfig();
  const userId = localStorage.getItem("userId");
  const { getToken } = UseCookie();
  const { access_token } = getToken();

  const onFinish = async (values) => {
    try {
      const sanitizedContent = DOMPurify.sanitize(values.content);
      const contentParser = Parser(sanitizedContent).props.children;
      const response = await axios.post(`${Base_URL}/post/create`, {
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
      message.success("Repost Successfully", 2);
      form.resetFields();
      closeModal();
      return response;
    } catch (error) {
      message.error("Repost Failed", 2);
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
        className="formStyle"
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          label="Content"
          name="content"
          rules={[{ required: true, message: "Please input your content!" }]}
        >
          <ReactQuill
            modules={{
              toolbar: false
            }}
            theme="snow"
            value={Parser(editorValue)}
            onChange={setEditorValue}
            className="overflow-auto bg-white h-36 dark:bg-backgroundDarkPrimary dark:text-white max-h-40"
          />
        </Form.Item>
        {/* Audio Wave */}
        {/* <div className="w-full">
          <AudioWaveSurfer song={song}></AudioWaveSurfer>
        </div> */}
        <Form.Item>
          <button
            type="submit"
            className="w-full h-10 px-3 text-base transition-colors duration-150 border rounded-lg hover:opacity-60 focus:shadow-outline border-primary text-primary dark:border-primaryDarkmode dark:text-primaryDarkmode"
          >
            Repost
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
