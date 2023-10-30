import React, { useEffect } from "react";
import { UploadOutlined } from "@ant-design/icons";
import { Button, Form, Input, Select, Upload } from "antd";
import { Base_URL } from "../../api/config";
import axios from "axios";
import ArtistInput from "./ArtistInput";
import UseCookie from "../../hooks/useCookie";

const { Option } = Select;
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

  // Post Song to API
  const postSong = async (values) => {
    try {
      const response = await axios.post(`${Base_URL}/songs/addSong`, values, {
        headers: {
          Authorization: `Bearer ${access_token}`,
          // Add any other headers if required
        },
      });
      if (response.status === 200) {
        // Handle success
        console.log("Song posted successfully:", response.data);
      } else {
        // Handle other status codes
        console.error("Error posting song:", response.statusText);
      }
    } catch (error) {
      // Handle network errors or other exceptions
      console.error("Error posting song:", error.message);
    }
  };

  const onFinish = (values) => {
    console.log("Received values:", values);
    const { songName, artists, poster, songData, genre } = values;

    const postData = {
      songName: songName,
      poster: poster,
      songData: songData,
      genre: genre,
      artist: artists.map((artist) => {
        return { userName: artist };
      }),
    };
    console.log("Posting Data", postData);
    // const artists = {};
    postSong(postData); // Call the function to post the song data
  };

  // //Upload
  // const normFile = (e) => {
  //   console.log("Upload event:", e);
  //   if (Array.isArray(e)) {
  //     return e;
  //   }
  //   return e?.fileList;
  // };

  const UploadImage = async (formData) => {
    try {
      const response = await axios.post(
        `${Base_URL}/songs/addSongFile  `,
        formData,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status == 200) {
        console.log("Files posted successfully:", response.data);
      } else {
        console.error("Error posting files:", response.data);
      }
    } catch (error) {
      console.error("Error posting files:", error.message);
    }
  };
  const onFinishData = (values) => {
    // Ensure that both poster and songData are arrays
    console.log("OnFinishData values:", values);
    const posterFile = values.poster; // Lấy file đầu tiên trong mảng
    const songFile = values.songData; // Lấy file đầu tiên trong mảng

    // Create a new FormData instance

    const formDataArray = [];
    formDataArray.push(posterFile);
    formDataArray.push(songFile);

    const formData = new FormData();
    // Append the files to the FormData instance
    formData.append("poster", posterFile);
    formData.append("songData", songFile);

    console.log("OnFinishData values Data Array:", formDataArray);
    console.log("OnFinishData values object:", formData);

    UploadImage(formData);
  };

  useEffect(() => {
    if (access_token == null) {
      console.log("CheckCookie", getToken());
      window.location.href = "/";
    }
  }, [access_token]);
  return (
    <section className="w-full h-fit relative flex flex-col xl:pt-12 pt-6  bg-[#ecf2fd]">
      <div className="flex justify-center items-center h-fit">
        {/*DATAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA*/}
        <Form
          onFinish={onFinishData}
          className="relative flex flex-col justify-center items-center mb-5 rounded-md mx-auto p-5 bg-[#f9f9f9]"
        >
          {/* Cover Image */}
          <Form.Item
            name="poster"
            label="Upload Cover Art"
            extra="Upload your cover image png, jpg, jpeg"
            getValueFromEvent={(e) => e && e.fileList}
            valuePropName="fileList"
          >
            <Upload
              name="poster"
              action="/"
              listType="picture"
              rules={[
                {
                  required: false,
                },
              ]}
            >
              <Button icon={<UploadOutlined />}>Click to upload</Button>
            </Upload>
          </Form.Item>
          {/* MP3 File */}
          <Form.Item
            name="songData"
            label="Upload File"
            extra="Upload your audio file mp3, wav"
            getValueFromEvent={(e) => e && e.fileList}
            valuePropName="fileList"
            rules={[
              {
                required: false,
              },
            ]}
          >
            <Upload name="songData" action="/" listType="picture">
              <Button icon={<UploadOutlined />}>Click to upload</Button>
            </Upload>
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            className="bg-[#41a546] right-2"
          >
            Submit Song Data
          </Button>
        </Form>

        <Form
          {...layout}
          ref={formRef}
          name="control-ref"
          onFinish={onFinish}
          className="w-[500px] border rounded-md mx-auto p-5 mb-28 bg-[#f9f9f9]"
        >
          <div className="w-full text-center mb-5">
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

          {/* Genre  */}
          <Form.Item
            name="genre"
            label="Song Genre"
            extra={"Select your song genre, CHOOSE ONE"}
          >
            <Select
              placeholder="Select a option and change input text above"
              allowClear
            >
              <Option value="Pop">Pop</Option>
              <Option value="Jazz">Jazz</Option>
              <Option value="EDM">EDM</Option>
              <Option value="Trap">Trap</Option>
              <Option value="other">other</Option>
            </Select>
          </Form.Item>

          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) =>
              prevValues.genre !== currentValues.genre
            }
          >
            {({ getFieldValue }) =>
              /* lấy giá trị trong field gender xem có phải other không */
              getFieldValue("genre") === "other" ? (
                /* Nếu chọn other thì hiện ra cái này */
                <Form.Item name="customizeGenre" label="Customize Genre">
                  <Input />
                </Form.Item>
              ) : null
            }
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
      </div>
    </section>
  );
};

export default UploadSong;
