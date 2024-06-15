import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Form, Input, Select, message } from "antd";
import ArtistInput from "./ArtistInput";
import UseCookie from "../../hooks/useCookie";
import GenreInput from "./GenreInput";
import useDataUtils from "../../utils/useDataUtils";
import UploadFileDropZone from "../../utils/useDropZone";
import PropTypes from "prop-types";
import useConfig from "../../utils/useConfig";
import useIconUtils from "../../utils/useIconUtils";
import { useMusicAPIUtils } from "../../utils/useMusicAPIUtils";
import ReactQuill from "react-quill";
import Parser from 'html-react-parser';
import DOMPurify from "dompurify";
import { useTranslation } from "react-i18next";

const UpdateSong = ({ songData, setModalUpdate, setRefresh }) => {
  const formRef = useRef(null);
  const { getToken } = UseCookie();
  const { access_token } = getToken();
  const [form] = Form.useForm();
  const { Check } = useIconUtils();
  const { Base_URL, Base_AVA } = useConfig();
  const { t } = useTranslation();
  const { handleUploadFileIMG, handleUploadFileMP3 } = useDataUtils();
  const { getSongById } = useMusicAPIUtils();
  const [uploadedFile, setUploadedFile] = useState({});
  const [fileImg, setFileImg] = useState();
  const [fileMP3, setFileMP3] = useState();
  const [editorValue, setEditorValue] = useState("");

  const UploadIMGfile = async (file) => {
    message.loading(t("modal.uploadingImg"), 1);
    await handleUploadFileIMG(file).then((res) => {
      if (res.status === 200) {
        setFileImg(res.data);
        message.success(t("modal.uploadImgSuccess"), 2);
      }
    }).catch(() => {
      message.error(t("modal.uploadImgFailed"), 2);
    }
    );
  };

  const UploadMP3file = async (file) => {
    message.loading(t("modal.uploadingMP3"), 1);
    await handleUploadFileMP3(file).then((res) => {
      if (res.status === 200) {
        setFileMP3(res.data);
        message.success(t("modal.uploadMP3Success"), 2);
      }
    }).catch(() => {
      message.error(t("modal.uploadMP3Failed"), 2);
    }
    );
  };

  const onFinish = async (values) => {
    // console.log("Received values:", values);
    if (values.artists == null) {
      message.error(t("modal.pleaseSelect1Artist"), 2);
      return;
    }
    if (fileImg == null) {
      message.error(t("modal.pleaseUploadCover"), 2);
      return;
    }
    if (fileMP3 == null && values.songData == null) {
      // console.log("FileMP3", fileMP3);
      message.error(t("modal.pleaseUploadMP3"), 2);
      return;
    }
    const sanitizedContent = DOMPurify.sanitize(editorValue);
    const contentParser = Parser(sanitizedContent).props?.children;
    const postData = {
      id: songData.songId,
      songName: values.songName,
      poster: fileImg,
      songData: fileMP3 ? fileMP3 : values.songData,
      genres: values.genres.map((genre) => {
        return { id: genre.value };
      }),
      status: parseInt(values.status),
      artists: values.artists.map((artist) => {
        return { id: artist.value ? artist.value : artist };
      }),
      lyric: contentParser ? contentParser : editorValue,
    };
    // console.log("Posting Data", postData);
    await updateSong(postData).then(() => {
      setModalUpdate(false);
      setRefresh(true);
    });
  };

  // Post Song to API
  const updateSong = async (data) => {
    try {
      // console.log("Data", data);
      const response = await axios.put(
        `${Base_URL}/songs?accessToken=${access_token}`,
        {
          id: data.id,
          songName: data.songName,
          poster: data.poster,
          songData: data.songData,
          genres: data.genres,
          status: data.status,
          artists: data.artists,
          lyric: data.lyric,
        },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      message.success(t("modal.uploadSongSuccess"), 2);
      return response.data;
    } catch (error) {
      console.log("Error:", error);
      message.error(t("modal.uploadSongFailed"), 2);
    }
  };

  useEffect(() => {
    getSongById(songData.songId).then((data) => {
      setFileImg(data.poster);
      setFileMP3(data.songData);
      form.setFieldsValue({
        songName: data.songName,
        artists: data.artists.map((artist) => {
          return { value: artist.id, label: artist.userName };
        }),
        genres: data.genres.map((genre) => {
          return { value: genre.id, label: genre.genreName };
        }),
        poster: data.poster,
        songData: data.songData,
        lyric: data?.lyric,
        status: data.status,
      });
    });
  }, [songData.songId]);

  useEffect(() => {
    if (access_token == null) {
      // console.log("CheckCookie", getToken());
      window.location.href = "/";
    }
  }, [access_token]);
  return (
    <section className="relative flex flex-col w-full h-full ">
      <Form
        ref={formRef}
        name="control-ref"
        form={form}
        onFinish={onFinish}
        className="p-2 mx-auto rounded-md bg-backgroundPlaylist dark:bg-backgroundPlaylistDark formStyle"
      >
        <div className="w-full mb-5 text-center">
          <h2 className="text-3xl font-bold uppercase font-monserrat text-primary dark:text-primaryDarkmode">
            {t("modal.updateSong")}
          </h2>
        </div>
        <Form.Item
          name="songName"
          label={t("modal.songName")}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input className="dark:text-primaryText2 bg-backgroundPrimary " />
        </Form.Item>
        <ArtistInput artistList={songData?.artists}></ArtistInput>
        <Form.Item
          name="poster"
          label={t("modal.uploadCoverArt")}
          extra={t("modal.coverArtExtra")}
          getValueFromEvent={(e) => e && e.fileList}
          valuePropName="fileList"
          rules={[
            {
              required: false,
            },
          ]}
        >
          <div className="flex flex-row items-center gap-2">
            <UploadFileDropZone
              uploadedFile={uploadedFile}
              setUploadedFile={setUploadedFile}
              handleUploadFile={UploadIMGfile}
              accept="image/jpeg, image/png"
            />
            {fileImg && <img src={fileImg ? fileImg : Base_AVA} alt="" className="object-cover w-16 h-16" />}
          </div>
        </Form.Item>
        {/* MP3 File */}
        <Form.Item
          name="songData"
          label={t("modal.uploadSongFile")}
          extra={t("modal.mp3fileExtra")}
          getValueFromEvent={(e) => e && e.fileList}
          valuePropName="fileList"
          rules={[
            {
              required: fileMP3 == null,  // Required when song is not ready
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
            {fileMP3 && Check()}
          </div>
        </Form.Item>
        {/* Genre  */}
        <GenreInput></GenreInput>
        {/* Lyric */}
        <Form.Item
          name="lyric"
          label={t("modal.lyric")}
          rules={[
            {
              required: false,
            },
          ]}
        >
          <ReactQuill
            theme="snow"
            modules={{
              toolbar: false
            }}
            value={Parser(editorValue)}
            onChange={setEditorValue}
            placeholder={t("modal.lyricPlaceholder")}
            className="h-24 overflow-auto bg-white dark:bg-backgroundDarkPrimary dark:text-white max-h-24"
          />
        </Form.Item>

        <Form.Item
          name="status"
          label={t("modal.status")}
          rules={[
            {
              required: false,
            },
          ]}
        >
          <Select
            className="rounded-md dark:text-primaryText2 bg-backgroundPrimary"
            placeholder={t("modal.statusPlaceholder")}
          >
            <Select.Option value={1}>{t("modal.active")}</Select.Option>
            <Select.Option value={0}>{t("modal.inactive")}</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <button
            type="submit"
            className="absolute px-2 py-2 border rounded-md border-primary dark:border-primaryDarkmode text-primary dark:text-primaryDarkmode right-2 hover:opacity-70"
          >
            {t("modal.updateSong")}
          </button>
        </Form.Item>
      </Form>
    </section>
  );
};

UpdateSong.propTypes = {
  songData: PropTypes.shape({
    songId: PropTypes.string.isRequired,
    poster: PropTypes.string,
    genres: PropTypes.string,
    songData: PropTypes.string,
    lyric: PropTypes.string,
    songName: PropTypes.string,
    artists: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        userName: PropTypes.string,
      })
    ),
  }).isRequired,
  setModalUpdate: PropTypes.func,
  setRefresh: PropTypes.func,
};
export default UpdateSong;
