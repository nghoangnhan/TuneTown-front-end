import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Button, Form, Input, message } from "antd";
import ArtistInput from "./ArtistInput";
import UseCookie from "../../hooks/useCookie";
import GenreInput from "./GenreInput";
import useDataUtils from "../../utils/useDataUtils";
import UploadFileDropZone from "../../utils/useDropZone";
import PropTypes from "prop-types";
import useConfig from "../../utils/useConfig";
import useIconUtils from "../../utils/useIconUtils";
import { useMusicAPIUtils } from "../../utils/useMusicAPIUtils";

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
  const { Check } = useIconUtils();
  const { Base_URL, Base_AVA } = useConfig();
  const { handleUploadFileIMG, handleUploadFileMP3 } = useDataUtils();
  const { getSongById } = useMusicAPIUtils();
  const [uploadedFile, setUploadedFile] = useState({});
  const [fileImg, setFileImg] = useState(songData?.poster);
  const [fileMP3, setFileMP3] = useState(songData.songData);

  const UploadIMGfile = async (file) => {
    message.loading("Uploading Image", 1);
    await handleUploadFileIMG(file).then((res) => {
      if (res.status === 200) {
        setFileImg(res.data);

        message.success("Image Uploaded Successfully", 2);
      }
    });
  };

  const UploadMP3file = async (file) => {
    message.loading("Uploading Song File", 1);
    await handleUploadFileMP3(file).then((res) => {
      if (res.status === 200) {
        setFileMP3(res.data);

        message.success("Song File Uploaded Successfully", 2);
      }
    });
  };

  // Post Song to API
  const updateSong = async (data) => {
    try {
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
    if (fileImg == null) {
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
      poster: fileImg,
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
        className="p-5 mx-auto rounded-md bg-backgroundPlaylist dark:bg-backgroundPlaylistDark formStyle"
      >
        <div className="w-full mb-5 text-center">
          <h2 className="text-3xl font-bold uppercase font-monserrat text-primary dark:text-primaryDarkmode">
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
        <ArtistInput artistList={songData?.artists}></ArtistInput>
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
              accept="image/*"
            />
            {fileImg && <img src={fileImg ? fileImg : Base_AVA} alt="" className="w-16 h-16" />}
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
};
export default UpdateSong;
