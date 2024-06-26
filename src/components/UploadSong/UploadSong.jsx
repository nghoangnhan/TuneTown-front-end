/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Form, Input, message } from "antd";
import ArtistInput from "./ArtistInput";
import GenreInput from "./GenreInput";
import UseCookie from "../../hooks/useCookie";
import useDataUtils from "../../utils/useDataUtils";
import UploadFileDropZone from "../../utils/useDropZone";
import useConfig from "../../utils/useConfig";
import Parser from 'html-react-parser';
import useIconUtils from "../../utils/useIconUtils";
import ReactQuill from "react-quill";
import DOMPurify from "dompurify";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";


const UploadSong = ({ setOpenModalUpload }) => {
  const formRef = React.useRef(null);
  const { t } = useTranslation();
  const { getToken } = UseCookie();
  const { access_token } = getToken();
  const { Base_URL } = useConfig();
  const { Check, LoadingLogo } = useIconUtils();
  const [uploadedFile, setUploadedFile] = useState({});
  const [fileImg, setFileImg] = useState();
  const [fileMP3, setFileMP3] = useState();
  const { handleUploadFileIMG, handleUploadFileMP3 } = useDataUtils();
  const [loading, setLoading] = useState(false);
  const [editorValue, setEditorValue] = useState("");

  const UploadIMGfile = async (file) => {
    setLoading(true);
    message.loading(t("modal.uploadingImg"), 1);
    await handleUploadFileIMG(file).then((res) => {
      if (res.status === 200) {
        setFileImg(res.data);
        message.success(t("modal.uploadImgSuccess"), 2);
        setLoading(false);
      }
    }).catch(() => {
      message.error(t("modal.uploadImgFailed"), 2);
    }
    );
  };

  const UploadMP3file = async (file) => {
    setLoading(true);
    message.loading(t("modal.uploadingMP3"), 1);
    await handleUploadFileMP3(file).then((res) => {
      if (res.status === 200) {
        setFileMP3(res.data);
        message.success(t("modal.uploadMP3Success"), 2);
        setLoading(false);
      }
    }).catch(() => {
      message.error(t("modal.uploadMP3Failed"), 2);
    }
    );
  };
  // Submit Form
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
    if (fileMP3 == null) {
      message.error(t("modal.pleaseUploadMP3"), 2);
      return;
    }
    const sanitizedContent = DOMPurify.sanitize(values?.lyric);
    const contentParser = Parser(sanitizedContent).props?.children;
    const postData = {
      songName: values.songName,
      poster: fileImg,
      songData: fileMP3,
      genres: values.genres.map((item) => {
        return { id: item };
      }),
      status: 1,
      artists: values.artists.map((artist) => {
        return { id: artist };
      }),
      likes: 0,
      listens: 0,
      lyric: contentParser ? contentParser : editorValue,
    };
    // console.log("Posting Data", postData);
    await postSong(postData).then(() => {
      setOpenModalUpload(false);
    });
  };

  // Post Song to API
  const postSong = async (values) => {
    try {
      const response = await axios.post(`${Base_URL}/songs/addSong`, values, {
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
      });
      if (response.status === 200) {
        // Handle success
        // console.log("Song posted successfully:", response.data);
        message.success(t("modal.uploadSongSuccess"), 2);
        formRef.current.resetFields();
        setFileImg(null);
      }
    } catch (error) {
      // Handle network errors or other exceptions
      console.error("Error posting song:", error);
      message.error(`${t("modal.uploadSongFailed")}: ${error.message}`, 2);
    }
  };

  // Check if user is logged in
  useEffect(() => {
    if (access_token == null) {
      window.location.href = "/";
    }
  }, [access_token]);

  return (
    <Form
      ref={formRef}
      name="control-ref"
      onFinish={onFinish}
      className="flex flex-col justify-center p-2 mx-auto rounded-md bg-backgroundPlaylist dark:bg-backgroundPlaylistDark formStyle"
    >
      <div className="w-full mb-10 text-center">
        <h2 className="text-3xl font-bold uppercase font-monserrat text-primary dark:text-primaryDarkmode">
          {t("modal.uploadSong")}
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
        <Input className=" dark:bg-backgroundPrimary" />
      </Form.Item>

      <ArtistInput></ArtistInput>

      {/* Upload Cover Art  */}
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

      {/* Lyric  */}
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
          value={Parser(editorValue)}
          modules={{
            toolbar: false
          }}
          onChange={setEditorValue}
          placeholder={t("modal.lyricPlaceholder")}
          className="overflow-auto bg-white dark:bg-backgroundDarkPrimary h-36 dark:text-white max-h-40"
        />
      </Form.Item>

      <Form.Item  >
        <button
          type="submit"
          className="absolute px-2 py-2 border rounded-md border-primary dark:border-primaryDarkmode text-primary dark:text-primaryDarkmode right-2 hover:opacity-70"
        >
          {t("modal.uploadSong")}
        </button>
      </Form.Item>

      <LoadingLogo loading={loading} ></LoadingLogo>
    </Form>
  );
};

UploadSong.propTypes = {
  setOpenModalUpload: PropTypes.func,
};

export default UploadSong;
