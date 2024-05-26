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


const UploadSong = ({ setOpenModalUpload }) => {
  const formRef = React.useRef(null);
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
    message.loading("Uploading Image", 1);
    await handleUploadFileIMG(file).then((res) => {
      if (res.status === 200) {
        setFileImg(res.data);
        message.success("Image Uploaded Successfully", 2);
        setLoading(false);
      }
    });
  };

  const UploadMP3file = async (file) => {
    setLoading(true);
    message.loading("Uploading Song File", 1);
    await handleUploadFileMP3(file).then((res) => {
      if (res.status === 200) {
        setFileMP3(res.data);
        message.success("Song File Uploaded Successfully", 2);
        setLoading(false);
      }
    });
  };
  // Submit Form
  const onFinish = async (values) => {
    console.log("Received values:", values);
    if (values.artists == null) {
      message.error("Please select at least one artist", 2);
      return;
    }
    if (fileImg == null) {
      message.error("Please upload a cover image", 2);
      return;
    }
    if (fileMP3 == null) {
      message.error("Please upload a song file", 2);
      return;
    }
    const sanitizedContent = DOMPurify.sanitize(values?.lyric);
    const contentParser = Parser(sanitizedContent).props.children;
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
      lyric: contentParser,
    };
    console.log("Posting Data", postData);
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
        console.log("Song posted successfully:", response.data);
        message.success("Song posted successfully", 2);
        formRef.current.resetFields();
        setFileImg(null);
      }
    } catch (error) {
      // Handle network errors or other exceptions
      console.error("Error posting song:", error);
      message.error(`Error posting song: ${error.message}`, 2);
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
          Upload Your Masterpiece
        </h2>
      </div>
      <Form.Item
        name="songName"
        label="Song Name"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input className="dark:text-primaryText2 bg-backgroundPrimary " />
      </Form.Item>

      <ArtistInput></ArtistInput>

      {/* Upload Cover Art  */}
      <Form.Item
        name="songCoverArt"
        label="Upload Cover Art"
        extra="Upload your cover art image."
        getValueFromEvent={(e) => e && e.fileList}
        valuePropName="fileList">
        <div className="flex flex-row items-center gap-2">
          <UploadFileDropZone
            uploadedFile={uploadedFile}
            setUploadedFile={setUploadedFile}
            handleUploadFile={UploadIMGfile}
            accept="image/jpeg, image/png"
          />
          {fileImg && <img src={fileImg} alt="" className="w-16 h-16" />}
        </div>
      </Form.Item>

      {/* MP3 File */}
      <Form.Item
        name="songData"
        label="Upload File"
        extra="Upload your audio file mp3, wav."
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
        label="Lyric"
        rules={[
          {
            required: false,
          },
        ]}
      >
        <ReactQuill
          theme="snow"
          value={Parser(editorValue)}
          onChange={setEditorValue}
          placeholder="Your thoughts..."
          className="overflow-auto bg-white dark:bg-backgroundDarkPrimary dark:text-white max-h-40"
        />
      </Form.Item>

      <Form.Item  >
        <button
          type="submit"
          className="absolute px-2 py-2 border rounded-md border-primary dark:border-primaryDarkmode text-primary dark:text-primaryDarkmode right-2 hover:opacity-70"
        >
          Upload Song
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
