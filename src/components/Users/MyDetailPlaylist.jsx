import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Form, Input, Modal, Select, message } from "antd";
import MySongSectionPlaylist from "./MySongSectionPlaylist";
import { useDispatch, useSelector } from "react-redux";
import { setRefreshPlaylist } from "../../redux/slice/playlist";
import UploadFileDropZone from "../UploadSong/UploadFileDropZone";
import { useDataUtils } from "../../utils/useDataUtils";
import { useMusicAPIUtils } from "../../utils/useMusicAPIUtils";
import useIconUtils from "../../utils/useIconUtils";
import useConfig from "../../utils/useConfig";
import { useTranslation } from "react-i18next";

const MyDetailPlaylist = () => {
  //http://localhost:8080/playlists/getPlaylistSongs?playlistId=102
  const { playlistId } = useParams();
  const [form] = Form.useForm();
  const { editPlaylist, getListSongPlaylist, getPlaylistByPlaylistId } =
    useMusicAPIUtils();
  const { Base_AVA } = useConfig();
  const { BackButton, LoadingLogo } = useIconUtils();
  const dispatch = useDispatch();
  const { handleUploadFileIMG } = useDataUtils();
  const [songPlaylistList, setSongPlaylistList] = useState();
  const [playlistDetail, setPlaylistDetail] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [uploadedFile, setUploadedFile] = useState({});
  const [fileIMG, setFileIMG] = useState(playlistDetail.coverArt);
  const [loading, setLoading] = useState(false);
  const refreshPlaylist = useSelector((state) => state.playlist.refreshPlaylist);
  const { t } = useTranslation();

  // Get data from API and set for Edit Modal
  const fetchDataPlaylistInfor = async (playlistId) => {
    // Fetch data from API and set for Edit Modal
    const detailData = await getPlaylistByPlaylistId(playlistId);
    if (detailData) {
      setPlaylistDetail(detailData);
      setFileIMG(detailData.coverArt);
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

  const UploadIMGfile = async (file) => {
    setLoading(true);
    message.loading("Uploading Image", 1);
    await handleUploadFileIMG(file).
      then((res) => {
        if (res.status === 200) {
          setFileIMG(res.data);
          message.success("Image Uploaded Successfully", 2);
          setLoading(false);
        }
      });
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
        <BackButton url={`/playlist`}></BackButton>
        <button
          onClick={() => setModalOpen(true)}
          className="bg-backgroundPrimary dark:bg-backgroundDarkPrimary text-[#40cf62] hover:text-backgroundPrimary hover:bg-[#40cf62] dark:hover:bg-primary  border border-solid border-[#40cf62] rounded-md"
        >
          <div className="px-2 py-1 font-bold">
            {t("playlist.editPlaylist")}
          </div>
        </button>
      </div>
      <div className="flex flex-row items-start gap-4 mb-5 font-bold text-center text-7xl text-primary dark:text-primaryDarkmode">
        <div className="relative flex flex-row items-start">
          <img
            className="w-20 h-20 rounded-md xl:w-56 xl:h-56"
            src={playlistDetail.coverArt ? playlistDetail.coverArt : Base_AVA}
            alt="artist-avatar"
          />
        </div>
        <div className="flex flex-col items-start gap-2">
          <div className="flex flex-row items-center justify-center gap-4">
            {playlistDetail.playlistName}{" "}
            <span className="text-5xl">#{playlistId}</span>
          </div>
          <div className="flex flex-col items-start justify-center gap-2">
            <div className="text-2xl text-primary dark:text-primaryDarkmode">
              {t("playlist.madeBy")} {playlistDetail?.user?.userName}
            </div>
            <div className="text-base text-primaryText2 dark:text-primaryTextDark">
              {t(
                `playlist.${String(playlistDetail.playlistType).toLowerCase()}`
              )}{" "}
            </div>
          </div>
        </div>
      </div>

      <MySongSectionPlaylist
        playlistId={playlistId}
        songData={songPlaylistList}
      ></MySongSectionPlaylist>

      <Modal
        title={t("playlist.editPlaylist")}
        centered
        open={modalOpen}
        footer={null}
        onCancel={() => setModalOpen(false)}
        className="modalStyle"
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
          initialValues={{
            remember: true,
          }}
          className="mx-auto formStyle"
        >
          <Form.Item
            name="playlistName"
            label={t("playlist.playlistName")}
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="playlistType" label={t("playlist.playlistPrivacy")}>
            <Select
              placeholder="Select one option..."
              options={[
                { value: "Public", label: t("playlist.public") },
                { value: "Private", label: t("playlist.private") },
              ]}
            ></Select>
          </Form.Item>

          <Form.Item
            name="coverArt"
            label={t("playlist.uploadCoverArt")}
            extra={`${t("playlist.coverArtExtra")} .png, .jpg, .jpeg`}
            getValueFromEvent={(e) => e && e.fileList}
            valuePropName="fileList"
            rules={[
              {
                required: false,
              },
            ]}>
            <div className="flex flex-row items-center gap-4">
              <UploadFileDropZone
                uploadedFile={uploadedFile}
                setUploadedFile={setUploadedFile}
                handleUploadFile={UploadIMGfile}
                accept="image/*"
              />
              {fileIMG && <img
                className="w-16 h-16 rounded-full"
                src={fileIMG ? fileIMG : Base_AVA}
                alt=""
              />}
            </div>
          </Form.Item>

          <Form.Item className="flex items-center justify-center w-full ">
            <button
              onClick={() =>
                handleOnclickEditForm(
                  playlistId,
                  form.getFieldValue("playlistName"),
                  form.getFieldValue("playlistType"),
                  fileIMG
                )
              }
              type="submit"
              className="px-4 py-2 border rounded-md w-fit min-w-[120px] border-primary  dark:border-primaryDarkmode text-primary dark:text-primaryDarkmode hover:opacity-70  "
            >
              {t("playlist.saveChanges")}
            </button>
          </Form.Item>
        </Form>
      </Modal>
      <LoadingLogo loading={loading}></LoadingLogo>
    </div>
  );
};

export default MyDetailPlaylist;
