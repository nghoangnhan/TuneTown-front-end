import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Form, Input, Modal, Select } from "antd";
import MySongSectionPlaylist from "./MySongSectionPlaylist";
import { useDispatch, useSelector } from "react-redux";
import { setRefreshPlaylist } from "../../redux/slice/playlist";
import UploadFileDropZone from "../UploadSong/UploadFileDropZone";
import { useDataUtils } from "../../utils/useDataUtils";
import { useMusicAPIUtils } from "../../utils/useMusicAPIUtils";
import useIconUtils from "../../utils/useIconUtils";
import useConfig from "../../utils/useConfig";

const MyDetailPlaylist = () => {
  //http://localhost:8080/playlists/getPlaylistSongs?playlistId=102
  const { playlistId } = useParams();
  const [form] = Form.useForm();
  const { editPlaylist, getListSongPlaylist, getPlaylistByPlaylistId } =
    useMusicAPIUtils();
  const { default_Img } = useConfig();
  const { BackButton } = useIconUtils();
  const dispatch = useDispatch();
  const { handleUploadFileIMG } = useDataUtils();
  const [songPlaylistList, setSongPlaylistList] = useState();
  const [playlistDetail, setPlaylistDetail] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [uploadedFile, setUploadedFile] = useState({});
  const [coverArt, setCoverArt] = useState();
  const refreshPlaylist = useSelector(
    (state) => state.playlist.refreshPlaylist
  );

  // Get data from API and set for Edit Modal
  const fetchDataPlaylistInfor = async (playlistId) => {
    // Fetch data from API and set for Edit Modal
    const detailData = await getPlaylistByPlaylistId(playlistId);
    if (detailData) {
      setPlaylistDetail(detailData);
      const { playlistName, playlistType, coverArt } = detailData;
      form.setFieldsValue({
        playlistName,
        playlistType,
        baseAva: coverArt,
      });
    }
    // Fetch data from API and set for SongList
    const data = await getListSongPlaylist(playlistId);
    if (data) {
      setSongPlaylistList(data);
      console.log("GetListSong in Playlist", data);
    }
    dispatch(setRefreshPlaylist(false));
  };

  // Edit Playlist API
  const handleOnclickEditForm = async (
    playlistId,
    playlistName,
    playlistType,
    coverArt
  ) => {
    await editPlaylist(playlistId, playlistName, playlistType, coverArt).then(
      () => {
        fetchDataPlaylistInfor(playlistId);
        dispatch(setRefreshPlaylist(true));
      }
    );
    setModalOpen(false);
  };

  // Reload data when refreshPlaylist is changed
  useEffect(() => {
    fetchDataPlaylistInfor(playlistId);
    if (refreshPlaylist == true) fetchDataPlaylistInfor(playlistId);
  }, [playlistId, refreshPlaylist]);

  // Set new baseAva when uploadedFile is changed
  useEffect(() => {
    if (uploadedFile) {
      form.setFieldsValue({
        baseAva: uploadedFile,
      });
    }
  }, [uploadedFile]);
  return (
    <div
      className={`${songPlaylistList != null && songPlaylistList.length > 0
        ? "min-h-screen h-full"
        : "min-h-screen"
        } xl:p-5 bg-backgroundPrimary dark:bg-backgroundDarkPrimary pb-20`}
    >
      {/* Button  */}
      <div className="flex flex-row items-center gap-4 mb-3">
        <BackButton></BackButton>
        <button
          onClick={() => setModalOpen(true)}
          className="bg-backgroundPrimary dark:bg-backgroundDarkPrimary text-[#40cf62] hover:text-backgroundPrimary hover:bg-[#40cf62] dark:hover:bg-primary  border border-solid border-[#40cf62] rounded-md"
        >
          <div className="px-2 py-1 font-bold">Edit Playlist Information</div>
        </button>
      </div>
      <div className="flex flex-row items-start gap-4 mb-5 font-bold text-center text-7xl text-primary dark:text-primaryDarkmode">
        <div className="relative flex flex-row items-start">
          <img
            className="w-20 h-20 rounded-md xl:w-56 xl:h-56"
            src={
              playlistDetail.coverArt
                ? playlistDetail.coverArt
                : default_Img
            }
            alt="artist-avatar"
          />
        </div>
        <div className="flex flex-col items-start gap-2">
          <div className="flex flex-row items-center justify-center gap-4">
            {playlistDetail.playlistName} <span className="text-5xl">#{playlistId}</span>
          </div>
          <div className="flex flex-col items-start justify-center gap-2">
            <div className="text-2xl text-primary dark:text-primaryDarkmode">Made by {" "}{playlistDetail?.user?.userName}</div>
            <div className="text-base text-primaryText2 dark:text-primaryTextDark">{playlistDetail.playlistType}{" "}playlist</div>
          </div>
        </div>
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
            form.getFieldValue("playlistType"),
            coverArt
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
          <div className="flex flex-col gap-2">
            <Form.Item name="baseAva">
              <img
                className="w-40 h-40 ml-10 rounded-md"
                src={
                  playlistDetail.coverArt
                    ? playlistDetail.coverArt
                    : "https://i.pinimg.com/550x/f8/87/a6/f887a654bf5d47425c7aa5240239dca6.jpg"
                }
                alt=""
              />
            </Form.Item>
            <Form.Item
              name="coverArt"
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
              <UploadFileDropZone
                uploadedFile={uploadedFile}
                setUploadedFile={setUploadedFile}
                handleUploadFile={(uploadedFile) =>
                  handleUploadFileIMG(uploadedFile).then((res) =>
                    setCoverArt(res)
                  )
                }
                accept="image/jpeg, image/png"
              />
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default MyDetailPlaylist;
