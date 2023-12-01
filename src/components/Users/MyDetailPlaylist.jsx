import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Form, Input, Modal, Select } from "antd";
import { useMusicAPI } from "../../utils/songUtils";
import MySongSectionPlaylist from "./MySongSectionPlaylist";
import { useDispatch, useSelector } from "react-redux";
import { setRefresh } from "../../redux/slice/playlist";

const MyDetailPlaylist = () => {
  //http://localhost:8080/playlists/getPlaylistSongs?playlistId=102
  const { playlistId } = useParams();
  const [form] = Form.useForm();
  const { editPlaylist, getListSongPlaylist, getPlaylistByPlaylistId } =
    useMusicAPI();
  const dispatch = useDispatch();
  const refreshPlaylist = useSelector(
    (state) => state.playlist.refreshPlaylist
  );
  const [songPlaylistList, setSongPlaylistList] = useState();
  const [playlistDetail, setPlaylistDetail] = useState({});
  const [modalOpen, setModalOpen] = useState(false);

  const fetchDataPlaylistInfor = async (playlistId) => {
    // Fetch data from API and set for Edit Modal
    const detailData = await getPlaylistByPlaylistId(playlistId);
    if (detailData) {
      setPlaylistDetail(detailData);
      const { playlistName, playlistType } = detailData;
      form.setFieldsValue({
        playlistName,
        playlistType,
      });
    }
    // Fetch data from API and set for Song List
    const data = await getListSongPlaylist(playlistId);
    if (data) {
      setSongPlaylistList(data);
      console.log("getListSongPlaylist", data);
    }
  };
  const handleOnclickEditForm = async (
    playlistId,
    playlistName,
    playlistType
  ) => {
    await editPlaylist(playlistId, playlistName, playlistType).then(() => {
      fetchDataPlaylistInfor(playlistId);
      dispatch(setRefresh(!refreshPlaylist));
    });
    setModalOpen(false);
  };

  useEffect(() => {
    fetchDataPlaylistInfor(playlistId);
  }, [playlistId, refreshPlaylist]);

  return (
    <div
      className={`${
        songPlaylistList != null && songPlaylistList.length > 0
          ? "h-screen"
          : "min-h-screen"
      } xl:p-5 bg-[#ecf2fd] mb-20`}
    >
      <div className="text-4xl text-[#4b4848] font-bold text-center mb-5">
        {playlistDetail.playlistName} <span className="">#{playlistId}</span>
      </div>
      <div className="flex flex-row gap-4">
        <button
          onClick={() => window.history.back()}
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
        <div className="w-1/4 text-center font-bold">ID</div>
        <div className="w-1/4 text-center font-bold">Song Name</div>
        <div className="w-1/4 text-center font-bold">Artist</div>
        <div className="w-1/4 text-center font-bold">Duration</div>
      </div>
      <MySongSectionPlaylist
        playlistId={playlistId}
        songData={songPlaylistList}
      ></MySongSectionPlaylist>

      <Modal
        title="Options"
        centered
        open={modalOpen}
        okButtonProps={{ style: { backgroundColor: "#45cc79" } }}
        onOk={() =>
          handleOnclickEditForm(
            playlistId,
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

export default MyDetailPlaylist;
