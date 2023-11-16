import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Base_URL } from "../../api/config";
import SongPlaylist from "./SongPlaylist";
import { Form, Input, Modal, Select, message } from "antd";
import UseCookie from "../../hooks/useCookie";

const DetailPlaylist = () => {
  //http://localhost:8080/playlists/getPlaylistSongs?playlistId=102
  const { getToken } = UseCookie();
  const { access_token } = getToken();
  const { playlistId } = useParams();
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const [songPlaylistList, setSongPlaylistList] = useState();
  const [playlistDetail, setPlaylistDetail] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [form] = Form.useForm();
  const getListSongPlaylist = async () => {
    try {
      console.log("auth", access_token);
      const response = await axios.get(
        `${Base_URL}/playlists/getPlaylistSongs?playlistId=${playlistId}`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      console.log("DetailPlaylist || SongList Response", response.data);
      setSongPlaylistList(response.data);
      setPlaylistDetail(response.data[0].playlist);
      console.log(
        "DetailPlaylist || PLaylistDetail Response",
        response.data[0].playlist
      );
      return response.data;
    } catch (error) {
      console.log("Error:", error);
    }
  };
  const editPlaylist = async (playlistName, playlistType) => {
    try {
      const response = await axios.put(
        `${Base_URL}/playlists/editPlaylist`,
        {
          id: playlistId,
          playlistName: playlistName,
          playlistType: playlistType,
          playlistSongsList: [],
        },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      if (response.status === 200) {
        // Handle success
        console.log("Playlist edited successfully", response.data);
        messageApi.open({
          type: "success",
          content: "Edited Successfully",
        });
        setRefresh(true);
        // Fetch Data Playlist again
        fetchDataPlaylistInfor();
      }
    } catch (error) {
      // Handle network errors or other exceptions
      console.error("Error edited playlist:", error.message);
    }
  };

  const handleOnclickEditForm = async (playlistName, playlistType) => {
    await editPlaylist(playlistName, playlistType);
    setModalOpen(false);
  };

  const fetchDataPlaylistInfor = async () => {
    const data = await getListSongPlaylist();
    // Now set the form values after data is fetched
    if (data && data.length > 0) {
      const { playlistName, playlistType } = data[0].playlist;
      form.setFieldsValue({
        playlistName,
        playlistType,
      });
    }
  };
  useEffect(() => {
    fetchDataPlaylistInfor();
  }, []);

  return (
    <div className="xl:p-5 bg-[#ecf2fd] mb-20">
      {contextHolder}
      <div className="text-4xl text-[#4b4848] font-bold text-center mb-5">
        {playlistDetail.playlistName} <span className="">#{playlistId}</span>
      </div>
      <div className="flex flex-row gap-4">
        <button
          onClick={() => navigate("/home")}
          className="bg-[#2f9948] hover:bg-[#40cf62] rounded-md mb-5"
        >
          <div className="text-white font-bold px-2 py-1">{"<"} Back</div>
        </button>
        <button
          onClick={() => setModalOpen(true)}
          className="bg-[#ecf2fd] text-[#40cf62] hover:text-[#ecf2fd]  hover:bg-[#40cf62] border border-solid border-[#40cf62]  rounded-md mb-5"
        >
          <div className="font-bold px-2 py-1">Edit Playlist Information</div>
        </button>
      </div>
      <div className="flex flex-row justify-center items-center mt-5 mb-5 text-[#4b4848]">
        <div className="w-1/4 text-center font-bold">Song Name</div>
        <div className="w-1/4 text-center font-bold">Artist</div>
        <div className="w-1/4 text-center font-bold">Duration</div>
      </div>
      <SongPlaylist
        playlistId={playlistId}
        songData={songPlaylistList}
      ></SongPlaylist>
      <Modal
        title="Options"
        centered
        open={modalOpen}
        okButtonProps={{ style: { backgroundColor: "#45cc79" } }}
        onOk={() =>
          handleOnclickEditForm(
            form.getFieldValue("playlistName"),
            form.getFieldValue("playlistType")
          )
        }
        onCancel={() => setModalOpen(false)}
        className="text-[#359254] "
      >
        <Form
          form={form}
          centered
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          style={{
            maxWidth: 600,
          }}
          initialValues={{
            remember: true,
          }}
        >
          <Form.Item
            name="playlistName"
            label="Playlist Name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="playlistType" label="Playlist Privacy">
            <Select
              placeholder="Select one option..."
              options={[
                { value: "Public", label: "Public" },
                { value: "Private", label: "Private" },
              ]}
            ></Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DetailPlaylist;
