import { Button, Form, message } from "antd";
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
import useIconUtils from "../../utils/useIconUtils";
import ModalPlaylistPost from "./ModalPlaylistPost";
import { setRefreshPost } from "../../redux/slice/social";
import { useDispatch } from "react-redux";


const CreatePost = () => {
  const [form] = Form.useForm();
  const userId = parseInt(localStorage.getItem("userId"));
  const { getToken } = UseCookie();
  const dispatch = useDispatch();
  const { access_token } = getToken();
  const { handleUploadFileMP3, handleUploadFileIMG } = useDataUtils();
  const { getPlaylistByUserId } = useMusicAPIUtils();
  const { LoadingLogo } = useIconUtils();
  const { Check } = useIconUtils();
  const { Base_URL } = useConfig();
  const [editorValue, setEditorValue] = useState("");
  const [fileMP3, setFileMP3] = useState();
  const [fileImg, setFileIMG] = useState();
  const [uploadedFile, setUploadedFile] = useState();
  const [loading, setLoading] = useState(false);
  const [playlistRs, setPlaylistRs] = useState([]);
  const [openModalChosePlaylist, setOpenModalChosePlaylist] = useState(false);
  const [playlistChosen, setPlaylistChosen] = useState();

  const UploadMP3file = async (file) => {
    setLoading(true);
    // message.loading("Uploading Song File", 2);
    await handleUploadFileMP3(file).then((res) => {
      console.log("UploadMP3file", res);
      if (res.status === 200 || res.status === 201) {
        setFileMP3(res.data);
        message.success("Song File Uploaded Successfully", 2);
        setLoading(false);
      }
    });
  };

  const UploadIMGfile = async (file) => {
    setLoading(true);
    message.loading("Uploading Image", 1);
    await handleUploadFileIMG(file).
      then((res) => {
        if (res.status === 200) {
          setFileIMG(res.data);
          message.success("Image Uploaded Successfully", 2);
          setLoading(false);
        }
      });
  };

  const onFinish = (values) => {
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
        playlist: playlistChosen ? {
          id: playlistChosen.id
        } : null,
        likes: null,
        listComments: null,
        mp3Link: fileMP3 ? fileMP3 : ''
      }, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        }
      }
      );
      form.resetFields();
      message.success("Post Created Successfully", 2);
      dispatch(setRefreshPost(true));
      setOpenModalChosePlaylist(false);
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
      setOpenModalChosePlaylist(true);
      console.log("PLAYLISTRS", playlistRs);
    } catch (error) {
      console.error("Error adding playlist:", error);
    }
  }

  const handlePlaylistItemClick = (playlist) => {
    try {
      setPlaylistChosen(playlist);
      console.log("Playlist Chosen", playlistChosen);
      setOpenModalChosePlaylist(false);
    } catch (error) {
      console.error("Error choosing playlist:", error);
    }
  }

  return (
    <div className="bg-[#FFFFFFCC] mt-4">
      <Form
        form={form}
        layout="vertical"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        onAbort={
          () => {
            form.resetFields();
          }
        }
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

        {/* Upload Cover Art  */}
        {/* <Form.Item
          name="songCoverArt"
          label="Upload Cover Art"
          extra="Upload your cover art image. Please wait for the file to be uploaded before submitting."
          getValueFromEvent={(e) => e && e.fileList}
          valuePropName="fileList"
        ><div className="flex flex-row items-center gap-2">
            <UploadFileDropZone
              uploadedFile={uploadedFile}
              setUploadedFile={setUploadedFile}
              handleUploadFile={UploadIMGfile}
              accept="image/*"
            />
            {fileImg && <img src={fileImg} alt="" className="w-16 h-16" />}
          </div>
        </Form.Item> */}

        {/* Upload Song  */}
        <Form.Item
          name="songData"
          label="Upload MP3 File"
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
            {fileMP3 && Check()}
          </div>
        </Form.Item>

        {/* Playlist */}
        <Form.Item className="flex flex-row ">
          <div className="flex flex-row items-center gap-2">
            <Button
              onClick={handleAddPlaylist}
              type="button"
              className=" text-primary transition-colors duration-150 border border-[#59c26d] rounded-md"
            >
              Add Playlist
            </Button>
            {playlistChosen && <div className="text-primary">Playlist Chosen: {playlistChosen.playlistName}{" "}#{playlistChosen.id}</div>}
          </div>
        </Form.Item>
        <Form.Item>
          <button
            type="submit"
            className="w-full h-10 px-3 text-base text-white transition-colors duration-150 rounded-lg bg-primary dark:bg-primaryDarkmode focus:shadow-outline hover:opacity-70"
          >
            Submit
          </button>
        </Form.Item>

        <LoadingLogo loading={loading}></LoadingLogo>
      </Form>
      <ModalPlaylistPost handlePlaylistItemClick={handlePlaylistItemClick} openModal={openModalChosePlaylist}
        playlistRs={playlistRs} setOpenModalChosePlaylist={setOpenModalChosePlaylist}></ModalPlaylistPost>
    </div>
  );
};

export default CreatePost;
