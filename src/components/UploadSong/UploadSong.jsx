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
import useIconUtils from "../../utils/useIconUtils";

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};
const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 16,
  },
};

const UploadSong = () => {
  const formRef = React.useRef(null);
  const { getToken } = UseCookie();
  const { access_token } = getToken();
  const { Base_URL } = useConfig();
  const { Check } = useIconUtils();
  const [uploadedFile, setUploadedFile] = useState({});
  const [fileImg, setFileImg] = useState();
  const [fileMP3, setFileMP3] = useState();
  const { handleUploadFileIMG, handleUploadFileMP3 } = useDataUtils();
  const [loading, setLoading] = useState(false);

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
      lyric: values?.lyric,
    };
    console.log("Posting Data", postData);
    await postSong(postData); // Call the function to post the song data
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
      console.log("CheckCookie", getToken());
      window.location.href = "/";
    }
  }, [access_token]);

  return (
    <Form
      {...layout}
      ref={formRef}
      name="control-ref"
      onFinish={onFinish}
      className="border rounded-md mx-auto p-5 bg-[#f9f9f9]"
    >
      <div className="w-full mb-5 text-center">
        <h2 className="text-3xl uppercase font-monserrat font-bold text-[#312f2f]">
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
        <Input />
      </Form.Item>

      <ArtistInput></ArtistInput>

      {/* Upload Cover Art  */}
      <Form.Item
        name="songCoverArt"
        label="Upload Cover Art"
        extra="Upload your cover art image. Please wait for the file to be uploaded before submitting."
        getValueFromEvent={(e) => e && e.fileList}
        valuePropName="fileList">
        <div className="flex flex-row items-center gap-2">
          <UploadFileDropZone
            uploadedFile={uploadedFile}
            setUploadedFile={setUploadedFile}
            handleUploadFile={UploadIMGfile}
            accept="image/*"
          />
          {fileImg && <img src={fileImg} alt="" className="w-16 h-16" />}
        </div>
      </Form.Item>

      {/* MP3 File */}
      <Form.Item
        name="songData"
        label="Upload File"
        extra="Upload your audio file mp3, wav. Please wait for the file to be uploaded before submitting."
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
        <Input.TextArea />
      </Form.Item>

      <Form.Item {...tailLayout}>
        <button
          type="submit"
          className="bg-[green] hover:bg-[#42ae49] text-white px-2 py-2 font-semibold rounded-md absolute right-2"
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
  );
};

export default UploadSong;
