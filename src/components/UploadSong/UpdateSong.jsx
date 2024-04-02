import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Button, Form, Input, message } from "antd";
import { Base_URL } from "../../api/config";
import ArtistInput from "./ArtistInput";
import UseCookie from "../../hooks/useCookie";
import GenreInput from "./GenreInput";
import useDataUtils from "../../utils/useDataUtils";
import UploadFileDropZone from "../../utils/useDropZone";
import PropTypes from "prop-types";

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

const UpdateSong = ({ songData }) => {
  const formRef = useRef(null);
  const { getToken } = UseCookie();
  const { access_token } = getToken();
  const [form] = Form.useForm();
  const [uploadedFile, setUploadedFile] = useState({});
  const [fileIMG, setFileIMG] = useState();
  const [fileMP3, setFileMP3] = useState();
  const [coverReady, setCoverReady] = useState(false);
  const [songReady, setSongReady] = useState(false);
  const { handleUploadFileIMG, handleUploadFileMP3 } = useDataUtils();

  const UploadIMGfile = async (file) => {
    message.loading("Uploading Image", 1);
    await handleUploadFileIMG(file).then((res) => {
      if (res.status === 200) {
        setFileIMG(res.data);
        setCoverReady(true);
        message.success("Image Uploaded Successfully", 2);
      }
    });
  };

  const UploadMP3file = async (file) => {
    message.loading("Uploading Song File", 1);
    await handleUploadFileMP3(file).then((res) => {
      if (res.status === 200) {
        setFileMP3(res.data);
        setSongReady(true);
        message.success("Song File Uploaded Successfully", 2);
      }
    });
  };

  // Get Song from API
  const getSongById = async (songId) => {
    try {
      console.log("auth", access_token);
      const response = await axios.get(
        `${Base_URL}/songs/getSongById?songId=${songId}`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.log("Error:", error);
    }
  };

  // Post Song to API
  const updateSong = async (data) => {
    try {
      console.log("auth", access_token);
      const response = await axios.put(
        `${Base_URL}/songs?accessToken=${access_token}`,
        {
          id: data.id,
          songName: data.songName,
          poster: data.poster,
          songData: data.songData,
          genres: data.genre,
          status: 1,
          artists: data.artists.map((artist) => {
            return { id: artist };
          }),
        },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.log("Error:", error);
    }
  };
  const onFinish = async (values) => {
    console.log("Received values:", values);
    const { songName, artists, genre } = values;
    if (artists == null) {
      message.error("Please select at least one artist");
      return;
    }
    if (fileIMG == null) {
      message.error("Please upload a cover image");
      return;
    }
    if (fileMP3 == null) {
      message.error("Please upload a song file");
      return;
    }
    const postData = {
      id: songData.songId,
      songName: songName,
      poster: fileIMG,
      songData: fileMP3,
      genres: genre,
      status: 1,
      artists: artists.map((artist) => {
        return { id: artist };
      }),
    };
    console.log("Posting Data", postData);
    // const artists = {};
    await updateSong(postData); // Call the function to post the song data
  };

  useEffect(() => {
    getSongById(songData.songId).then((data) => {
      console.log("songData", data);
      form.setFieldsValue({
        songName: data.songName,
        artists: data.artists.map((artist) => {
          return { value: artist.id, label: artist.userName };
        }),
        genre: data.genre,
        poster: data.poster,
        songData: data.songData,
        lyric: data?.lyric,
      });
    });
  }, [songData.songId]);

  useEffect(() => {
    if (access_token == null) {
      console.log("CheckCookie", getToken());
      window.location.href = "/";
    }
  }, [access_token]);
  return (
    <section className="relative flex flex-col w-full h-full ">
      <Form
        {...layout}
        ref={formRef}
        name="control-ref"
        form={form}
        onFinish={onFinish}
        className="border rounded-md mx-auto p-5 bg-[#f9f9f9]"
      >
        <div className="w-full mb-5 text-center">
          <h2 className="text-3xl uppercase font-monserrat font-bold text-[#312f2f]">
            Update Song
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
        <Form.Item
          name="poster"
          label="Upload Cover Art"
          extra="Upload your cover image png, jpg, jpeg"
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="20"
              viewBox="0 -960 960 960"
              width="20"
              className={`${coverReady ? "" : "hidden"}`}
              fill={`${coverReady ? "#42ae49" : ""}`}
            >
              <path d="M316.231-280.54q-83.295 0-141.762-57.879-58.468-57.879-58.468-141.004 0-84.269 60.896-141.768 60.895-57.5 146.334-57.5h378.615q59.23 0 100.691 41.077 41.462 41.076 41.462 100.307 0 60.23-43.962 100.806-43.961 40.577-105.191 40.577H339.462q-34.761 0-59.418-24.219-24.658-24.219-24.658-59.033 0-35.67 25.622-59.9 25.622-24.231 62.454-24.231h361.152v51.999H339.462q-13.477 0-22.778 9.108-9.3 9.108-9.3 22.585t9.3 22.585q9.301 9.108 22.778 9.108H702.23q37.308.384 63.539-25.777T792-537.505q0-37.459-27.423-63.323-27.423-25.865-64.731-25.865H316.231q-61.538.385-104.385 43.154Q169-540.769 168-479.284q-1 61.465 44.346 104.49 45.347 43.025 108.885 42.256h383.383v51.998H316.231Z" />
            </svg>
            <img src={fileIMG} alt="" className="w-16 h-16" />
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
              required: false,
            },
          ]}
        >
          <div className="flex flex-row items-center gap-2">
            <UploadFileDropZone
              uploadedFile={uploadedFile}
              setUploadedFile={setUploadedFile}
              handleUploadFile={UploadMP3file}
              accept="audio/mp3"
            />{" "}
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
        {/* Genre  */}
        <GenreInput></GenreInput>
        {/* Lyric */}
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
          <Button
            type="primary"
            htmlType="submit"
            className="bg-[green] absolute right-2"
          >
            Submit
          </Button>
        </Form.Item>
      </Form>
    </section>
  );
};

UpdateSong.propTypes = {
  songData: PropTypes.shape({
    songId: PropTypes.string.isRequired,
  }).isRequired,
};
export default UpdateSong;
