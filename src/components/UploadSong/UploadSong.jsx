import React, { useEffect } from "react";
import { UploadOutlined } from "@ant-design/icons";
import { Button, Form, Input, Select, Upload } from "antd";
import { Base_URL, auth } from "../../api/config";
import axios from "axios";
import ArtistInput from "./ArtistInput";
import userUtils from "../../utils/userUtils";

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
  const { CheckCookie } = userUtils();

  // Post Song to API
  const postSong = async (values) => {
    try {
      const response = await axios.post(`${Base_URL}/songs/addSong`, values, {
        headers: {
          Authorization: `Bearer ${auth.access_token}`,
          // Add any other headers if required
        },
        body: {},
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

  //Upload
  const normFile = (e) => {
    console.log("Upload event:", e);
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const onReset = () => {
    formRef.current?.resetFields();
  };
  useEffect(() => {
    if (CheckCookie() == false) {
      console.log("CheckCookie", CheckCookie());
      window.location.href = "/";
    }
  }, [CheckCookie]);
  return (
    <section className="w-full h-screen">
      <div className="flex justify-center items-center absolute left-3  top-3">
        <button
          onClick={() => window.history.back()}
          className="bg-[#2f9948] hover:bg-[#40cf62] rounded-md "
        >
          <div className="text-white font-bold px-2 py-2">{"<"} TuneTown</div>
        </button>
      </div>

      <div className="flex justify-center items-center h-full">
        <Form
          {...layout}
          ref={formRef}
          name="control-ref"
          onFinish={onFinish}
          className="w-[500px] border rounded-md mx-auto p-5 mt-10 bg-[#f9f9f9]"
        >
          <div className="w-full text-center mb-5">
            <h2 className="text-3xl uppercase font-monserrat font-bold text-[#312f2f]">
              Upload Your Masterpeice
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

          {/* Cover Image */}
          <Form.Item
            name="poster"
            label="Upload Cover Art"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            extra="Upload your cover image png, jpg, jpeg"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Upload name="logo" action="/" listType="picture">
              <Button icon={<UploadOutlined />}>Click to upload</Button>
            </Upload>
          </Form.Item>

          {/* MP3 File */}
          <Form.Item
            name="songData"
            label="Upload File"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            extra="Upload your audio file mp3, wav"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Upload name="logo" action="/" listType="picture">
              <Button icon={<UploadOutlined />}>Click to upload</Button>
            </Upload>
          </Form.Item>

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
              className="bg-[green] mr-3"
            >
              Submit
            </Button>
            <Button htmlType="button" onClick={onReset}>
              Reset
            </Button>
          </Form.Item>
        </Form>
      </div>
    </section>
  );
};

export default UploadSong;
