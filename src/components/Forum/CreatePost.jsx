import { Form, message } from "antd";
import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import UploadFileDropZone from "../../utils/useDropZone";
import useDataUtils from "../../utils/useDataUtils";
import axios from "axios";
import useConfig from "../../utils/useConfig";
import DOMPurify from 'dompurify';
import Parser from 'html-react-parser';
import UseCookie from "../../hooks/useCookie";
import { useMusicAPIUtils } from "../../utils/useMusicAPIUtils";
import { Modal } from "antd";


const CreatePost = () => {
  const [form] = Form.useForm();
  const { handleUploadFileMP3 } = useDataUtils();
  const [editorValue, setEditorValue] = useState("");
  const { Base_URL } = useConfig();
  const [fileMP3, setFileMP3] = useState();
  const [uploadedFile, setUploadedFile] = useState({});
  const [songReady, setSongReady] = useState(false);
  const userId = parseInt(localStorage.getItem("userId"));
  const [loading, setLoading] = useState(false);
  const { getToken } = UseCookie();
  const { access_token } = getToken();
  const [playlistRs, setPlaylistRs] = useState([]);
  const { getPlaylistByUserId } = useMusicAPIUtils();
  const [openModal, setOpenModal] = useState(false);
  const [playlist, setPlaylist] = useState();

  const UploadMP3file = async (file) => {
    setLoading(true);
    message.loading("Uploading Song File", 1);
    await handleUploadFileMP3(file).then((res) => {
      console.log("UploadMP3file", res);
      if (res.status === 200 || res.status === 201) {
        setFileMP3(res.data);
        // setSongReady(true);
        message.success("Song File Uploaded Successfully", 2);
        setLoading(false);
      }
    });
  };

  const onFinish = (values) => {
    // if (fileMP3 == null) {
    //   message.error("Please upload a song file", 2);
    //   return;
    // }
    try {
      console.log("Received values:", values);
      console.log("Received values:", fileMP3);
      const sanitizedContent = DOMPurify.sanitize(values.content);
      const contentParser = Parser(sanitizedContent).props.children;
      const response = axios.post(`${Base_URL}/post/create`, {
        author: {
          id: userId
        },
        content: contentParser,
        song: null,
        playlist: {
          id: playlist.id
        },
        likes: null,
        listComments: null,
        mp3Link: fileMP3
      }, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        }
      }
      );
      // if (response.status === 200) {
      message.success("Post Created Successfully", 2);
      // }

      form.resetFields();
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const handleAddPlaylist = async () => {
    try {
      const listPlaylist = await getPlaylistByUserId(userId);
      setPlaylistRs(listPlaylist);
      setOpenModal(true);
      console.log("PLAYLISTRS", playlistRs);
    } catch (error) {
      console.error("Error adding playlist:", error);
    }
  }

  const handlePlaylistItemClick = (playlist) => {
    try {
      setPlaylist(playlist);
      setOpenModal(false);
    } catch (error) {
      console.error("Error choosing playlist:", error);
    }
  }

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

        {/* Upload Song  */}
        <Form.Item
          name="songData"
          label="Upload File"
          extra="Upload your audio file mp3, wav. Please wait for the file to be uploaded before submitting."
          getValueFromEvent={(e) => e && e.fileList}
          valuePropName="fileList"
        // rules={[
        //   {
        //     required: !songReady, // Required when song is not ready
        //   },
        // ]}
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
            // className={`${songReady ? "" : "hidden"}`}
            // fill={`${songReady ? "#42ae49" : ""}`}
            >
              <path d="M316.231-280.54q-83.295 0-141.762-57.879-58.468-57.879-58.468-141.004 0-84.269 60.896-141.768 60.895-57.5 146.334-57.5h378.615q59.23 0 100.691 41.077 41.462 41.076 41.462 100.307 0 60.23-43.962 100.806-43.961 40.577-105.191 40.577H339.462q-34.761 0-59.418-24.219-24.658-24.219-24.658-59.033 0-35.67 25.622-59.9 25.622-24.231 62.454-24.231h361.152v51.999H339.462q-13.477 0-22.778 9.108-9.3 9.108-9.3 22.585t9.3 22.585q9.301 9.108 22.778 9.108H702.23q37.308.384 63.539-25.777T792-537.505q0-37.459-27.423-63.323-27.423-25.865-64.731-25.865H316.231q-61.538.385-104.385 43.154Q169-540.769 168-479.284q-1 61.465 44.346 104.49 45.347 43.025 108.885 42.256h383.383v51.998H316.231Z" />
            </svg>
          </div>
        </Form.Item>

        {/* Playlist */}
        <Form.Item>
          <button
            onClick={handleAddPlaylist}
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
        {loading && (
          <div className="overlay">
            <img src="/src/assets/img/logo/logo.png" alt="Loading..." width={100} height={100} className="zoom-in-out" />
          </div>
        )}

      </Form>
      <Modal
        title="Choose a playlist"
        open={openModal}
        onCancel={() => {
          setOpenModal(false);
        }}
        footer={null}
      >
        {playlistRs && (
          <div className="absolute left-0 right-0 bg-white shadow-md top-full">
            <ul className="px-4 py-2">
              {playlistRs.map((playlist) => (
                <li
                  key={playlist.id}
                  className="flex items-center p-2 space-x-2 rounded-md cursor-pointer hover:bg-blue-100"
                  onClick={() => handlePlaylistItemClick(playlist)}
                >
                  <img
                    src={`${playlist.coverArt ? playlist.coverArt : `https://i.pinimg.com/550x/f8/87/a6/f887a654bf5d47425c7aa5240239dca6.jpg`}`}
                    alt="Cover Art"
                    className="w-8 h-8 rounded-full"
                  />
                  <span>{playlist.playlistName} #{playlist.id}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

      </Modal>
    </div>
  );
};

export default CreatePost;
