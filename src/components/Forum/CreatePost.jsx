import { Button, Form, message } from "antd";
import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
// import UploadFileDropZone from "../../utils/useDropZone";
// import useDataUtils from "../../utils/useDataUtils";
import axios from "axios";
import useConfig from "../../utils/useConfig";
import DOMPurify from 'dompurify';
import Parser from 'html-react-parser';
import UseCookie from "../../hooks/useCookie";
import { useMusicAPIUtils } from "../../utils/useMusicAPIUtils";
import ModalPlaylistPost from "./Modal/ModalPlaylistPost";
import { setRefreshPost } from "../../redux/slice/social";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";
import ModalChoseSong from "./Modal/ModalChoseSong";
import { useTranslation } from "react-i18next";


const CreatePost = ({ setOpenModalCreate }) => {
  const [form] = Form.useForm();
  const userId = localStorage.getItem("userId");
  const { getToken } = UseCookie();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { access_token } = getToken();
  // const { handleUploadFileMP3, handleUploadFileIMG } = useDataUtils();
  const { getPublicPlaylist } = useMusicAPIUtils();
  // const { LoadingLogo } = useIconUtils();
  // const { Check } = useIconUtils();
  const { Base_URL } = useConfig();
  const [editorValue, setEditorValue] = useState("");
  // const [fileMP3, setFileMP3] = useState();
  // const [fileImg, setFileIMG] = useState();
  // const [uploadedFile, setUploadedFile] = useState();
  // const [loading, setLoading] = useState(false);
  const [playlistRs, setPlaylistRs] = useState([]);
  const [openModalChosePlaylist, setOpenModalChosePlaylist] = useState(false);
  const [openModalChoseSong, setOpenModalChoseSong] = useState(false);
  const [playlistChosen, setPlaylistChosen] = useState();
  const [songChosen, setSongChosen] = useState();

  const onFinish = async (values) => {
    try {
      console.log("Received values:", values);

      const sanitizedContent = DOMPurify.sanitize(values.content);
      const contentParser = Parser(sanitizedContent).props.children;
      if (contentParser == " " || contentParser == null || editorValue == " " || editorValue == null) {
        message.error(t("modal.contentEmpty"), 2);
        return;
      }
      const response = await axios.post(`${Base_URL}/post/create`, {
        author: {
          id: userId
        },
        content: contentParser ? contentParser : editorValue,
        song: songChosen ? {
          id: songChosen.id
        } : null,
        playlist: playlistChosen ? {
          id: playlistChosen.id
        } : null,
        likes: null,
        listComments: null,
        // mp3Link: fileMP3 ? fileMP3 : ''
        mp3Link: null,
      }, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        }
      }
      );
      form.resetFields();
      message.success(t("message.uploadPostSuccess"), 2);
      dispatch(setRefreshPost(true));
      setOpenModalCreate(false);
      setOpenModalChosePlaylist(false);
      return response;
    } catch (error) {
      console.log("Error:", error);
    }
  };


  const handleAddPlaylist = async () => {
    try {
      const listPlaylist = await getPublicPlaylist(userId);
      setPlaylistRs(listPlaylist);
      setOpenModalChosePlaylist(true);
      // console.log("PLAYLISTRS", playlistRs);
    } catch (error) {
      console.error("Error adding playlist:", error);
    }
  }

  const handlePlaylistItemClick = (playlist) => {
    try {
      setPlaylistChosen(playlist);
      setOpenModalChosePlaylist(false);
    } catch (error) {
      console.error("Error choosing playlist:", error);
    }
  }

  const handleSongItemClick = (song) => {
    try {
      // console.log("Song Chosen", song);
      setSongChosen(song);
      setOpenModalChoseSong(false);
    } catch (error) {
      console.error("Error choosing song:", error);
    }
  }

  return (
    <div className="bg-backgroundPlaylist dark:bg-backgroundPlaylistDark">
      <Form
        form={form}
        layout="vertical"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onAbort={
          () => {
            form.resetFields();
          }
        }
        className="formStyle"
      >
        <Form.Item
          label={t("modal.content")}
          name="content"
          rules={[{ required: true, message: t("modal.contentEmpty") }]}
        >
          <ReactQuill
            modules={{
              toolbar: false
            }}
            theme="snow"
            value={Parser(editorValue)}
            onChange={setEditorValue}
            placeholder={t("modal.yourThoughts")}
            className="overflow-auto bg-white h-36 dark:bg-backgroundDarkPrimary dark:text-white max-h-40"
          />
        </Form.Item>

        {/* Song */}
        <Form.Item>
          <div className="flex flex-row items-center gap-2">
            <Button
              onClick={() => setOpenModalChoseSong(true)}
              type="button"
              className="transition-colors duration-150 border min-w-[110px] rounded-md text-primary dark:text-primaryDarkmode border-primary dark:border-primaryDarkmode"
            >
              {t("modal.chooseaSong")}
            </Button>
            {songChosen && <div className="text-primary dark:text-primaryDarkmode">{t("modal.songChosen")}: {songChosen.songName}{" "}#{songChosen.id}</div>}
          </div>
        </Form.Item>

        {/* Playlist  */}
        <Form.Item className="flex flex-row ">
          <div className="flex flex-row items-center gap-2">
            <Button
              onClick={handleAddPlaylist}
              type="button"
              className="transition-colors duration-150 border min-w-[110px] rounded-md  dark:text-primaryDarkmode dark:text-primaryDarkmode border-primary dark:border-primaryDarkmode"
            >
              {t("modal.chooseaPlaylist")}
            </Button>
            {playlistChosen && <div className="text-primary dark:text-primaryDarkmode">{t("modal.playlistChosen")}: {playlistChosen.playlistName}{" "}#{playlistChosen.id}</div>}
          </div>
        </Form.Item>
        <Form.Item>
          <button
            type="submit"
            className="absolute px-2 py-2 transition-colors duration-150 border rounded-md right-2 text-primary dark:text-primaryDarkmode border-primary dark:border-primaryDarkmode hover:opacity-70"
          >
            {t("modal.createPost")}
          </button>
        </Form.Item>

        {/* <LoadingLogo loading={loading}></LoadingLogo> */}
      </Form>
      <ModalChoseSong openModal={openModalChoseSong} handleSongItemClick={handleSongItemClick}
        setOpenModalChoseSong={setOpenModalChoseSong}  >
      </ModalChoseSong>

      <ModalPlaylistPost handlePlaylistItemClick={handlePlaylistItemClick}
        openModal={openModalChosePlaylist}
        playlistRs={playlistRs} setOpenModalChosePlaylist={setOpenModalChosePlaylist}>
      </ModalPlaylistPost>

    </div>
  );
};

CreatePost.propTypes = {
  setOpenModalCreate: PropTypes.func,
};

export default CreatePost;
