import axios from "axios";
import UseCookie from "../../hooks/useCookie";
import { useEffect, useState } from "react";
import { Form, Input, Modal, Space, Table, message } from "antd";
import UpdateSong from "../../components/UploadSong/UpdateSong";
import useUserUtils from "../../utils/useUserUtils";
import useConfig from "../../utils/useConfig";
import UploadSong from "../../components/UploadSong/UploadSong";
import { useTranslation } from "react-i18next";

const CMSArtist = () => {
  const { getToken } = UseCookie();
  const { access_token } = getToken();
  const { Base_URL, Base_AVA } = useConfig();
  const { t } = useTranslation();
  const userId = localStorage.getItem("userId");
  const [form] = Form.useForm();
  const [refresh, setRefresh] = useState(false);
  const [artistDetail, setArtistDetail] = useState({});
  const [songListArtist, setSongListArtist] = useState([]);
  const [songData, setSongData] = useState({});
  const [searchValue, setSearchValue] = useState("");
  const [isModalOpenUpdate, setIsModalOpenUpdate] = useState(false);
  const [isModalOpenUpload, setIsModalOpenUpload] = useState(false);
  const { getArtistByArtistId, getUserInfor, getAllSongArtistNoPaging } =
    useUserUtils();

  const handleGetArtistDetail = async (artistId) => {
    await getArtistByArtistId(artistId).then((result) => {
      setArtistDetail(result);
      setRefresh(false);
    });
    await getAllSongArtistNoPaging(artistId).then((result) => {
      setSongListArtist(result?.songs);
    });
  };

  const handleGetUserInfor = async (userId) => {
    await getUserInfor(userId).then((result) => {
      setArtistDetail(result.user);
      setSongListArtist(result?.songs);
      setRefresh(false);
    });
    await getAllSongArtistNoPaging(userId).then((result) => {
      setSongListArtist(result?.songs);
    });
  };

  const handSearch = (e) => {
    // console.log("value", e.target.value);
    setSearchValue(e.target.value);
  };
  // Update Song
  const handUpdateSong = (songId, songContent) => {
    const songDetail = {
      songId: songId,
      songName: songContent.songName,
      poster: songContent.poster.props.src,
      artists: songContent.artists,
      genres: songContent.genres,
      listens: songContent.listens,
      status: songContent.status,
    };
    setSongData(songDetail);
    setIsModalOpenUpdate(true);
  };
  const handleOk = () => {
    form.submit();
    setRefresh(true);
    setIsModalOpenUpload(false);
  };
  const handleCancel = () => {
    setRefresh(true);
    setIsModalOpenUpload(false);
    setIsModalOpenUpdate(false);
  };

  // Call this function when you want to refresh the playlist
  const showModal = () => {
    setIsModalOpenUpload(true);
  };

  // Delete Song
  const deleteSong = async (songId) => {
    try {
      if (confirm(t("confirmModal.deleteSong")) == true) {
        // console.log("auth", access_token);
        const response = await axios.delete(
          `${Base_URL}/songs/deleteSong?songId=${songId}`,
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          }
        );
        if (response.status === 200) {
          message.success(t("message.deleteSongSuccess"));
        }
        // Refresh the component
        setRefresh(true);
        return response.status;
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };
  const dataSongTable = songListArtist?.map((songItem) => ({
    key: songItem.id.toString(), // Assuming id is unique
    poster: (
      <img
        src={songItem.poster}
        alt={songItem.songName}
        className="rounded-md w-11 h-11"
      />
    ),
    songName: songItem.songName,
    artists: songItem.artists.map((artist) => artist.userName + " "), // Assuming artists is an array
    genres: songItem.genres.map((genre) => genre.genreName + " "), // Assuming genres is an array
    listens: songItem.listens,
    status: songItem.status,
  }));
  const columnsSong = [
    {
      title: "ID",
      dataIndex: "key",
      key: "key",
      align: "center",
    },
    {
      title: t("CMS.poster"),
      dataIndex: "poster",
      key: "poster",
      align: "center",
      render: (poster) => {
        return (
          <div className="flex items-center justify-center">
            <img
              src={poster.props.src ? poster.props.src : Base_AVA}
              alt="poster"
              className="w-12 h-12 rounded-lg"
            />
          </div>
        );
      },
    },
    {
      title: t("CMS.songName"),
      dataIndex: "songName",
      key: "songName",
      align: "center",
      render: (text) => <a>{text}</a>,
    },
    {
      title: t("CMS.artists"),
      dataIndex: "artists", // key in dataSongs
      key: "artists", // key in columnsSong
      align: "center",
      render: (artists) => {
        if (artists.length > 1) {
          return artists.map((artist, index) => (
            <div key={index}>{artist},</div>
          ));
        }
        return artists[0];
      },
    },
    {
      title: t("CMS.genres"),
      dataIndex: "genres",
      key: "genres",
      align: "center",
    },
    {
      title: t("CMS.status"),
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (status) => {
        if (status === 0) {
          return (
            <div className="flex items-center justify-center">
              <div className="w-16 px-1 py-1 text-red-700 border border-red-700 rounded-md dark:text-red-500 dark:border-red-500 h-fit hover:opacity-70">
                {t("CMS.private")}
              </div>
            </div>
          );
        } else if (status === 1) {
          return (
            <div className="flex items-center justify-center">
              <div className="w-16 px-1 py-1 border rounded-md h-fit text-primary dark:text-primaryDarkmode border-primary hover:opacity-70">
                {t("CMS.public")}
              </div>
            </div>
          );
        }
      },
    },
    {
      title: t("CMS.action"),
      key: "action",
      align: "center",
      render: (_, record) => (
        <Space>
          <button
            className="w-16 px-2 py-1 border rounded-md border-primary dark:border-primaryDarkmode text-primary dark:text-primaryDarkmode hover:opacity-70"
            onClick={() => handUpdateSong(record.key, record)}
          >
            {t("CMS.update")}
          </button>
          <button
            className="w-16 px-2 py-1 text-red-600 border border-red-600 rounded-md dark:border-red-500 dark:text-red-500 hover:opacity-70"
            onClick={() => deleteSong(record.key)}
          >
            {t("CMS.delete")}
          </button>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    if (localStorage.getItem("userRole") === "ARTIST") {
      handleGetArtistDetail(userId).then(() => {
        setRefresh(false)
      });
    } else {
      handleGetUserInfor(userId).then(() => {
        setRefresh(false);
      });
    }
  }, [userId, refresh, isModalOpenUpdate, isModalOpenUpload]);

  return (
    <div className="h-full min-h-screen px-4 pt-5 pb-24 text-headingText dark:text-headingTextDark bg-backgroundPrimary dark:bg-backgroundDarkPrimary">
      <div className="flex flex-row">
        <div className="mx-1 my-2 text-4xl font-bold text-primary dark:text-primaryDarkmode">
          {t("common.good")}{" "}
          {new Date().getHours() < 12
            ? t("common.morning")
            : new Date().getHours() < 18
              ? t("common.afternoon")
              : t("common.evening")}
          {", "}
          {artistDetail.name ? artistDetail.name : artistDetail.userName}
          {"! "}
        </div>
      </div>
      <div className="flex flex-row justify-between mt-5 mb-5 ">
        <div className="">
          <Form
            name="basic"
            labelCol={{
              span: 8,
            }}
            wrapperCol={{
              span: 16,
            }}
            layout="inline"
            initialValues={{
              remember: true,
            }}
            autoComplete="off"
          >
            <Form.Item label="" name="songName">
              <Input
                placeholder="Search..."
                className="dark:bg-backgroundPrimary"
                onChange={handSearch}
              />
            </Form.Item>
          </Form>
        </div>
        <div>
          <button
            className="px-3 py-1 border rounded-md text-primary dark:text-primaryDarkmode border-primary dark:border-primaryDarkmode hover:opacity-70"
            onClick={showModal}
          >
            {t("modal.createNewSong")}
          </button>
        </div>
      </div>
      <Table
        columns={columnsSong}
        className=" bg-backgroundPrimary dark:bg-backgroundDarkPrimary"
        dataSource={
          searchValue
            ? dataSongTable.filter((song) =>
              song.songName.toLowerCase().includes(searchValue.toLowerCase())
            )
            : dataSongTable
        }
      />
      <Modal
        open={isModalOpenUpload}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
        centered
        destroyOnClose={true}
        className="w-fit h-fit modalStyle"
      >
        <UploadSong setOpenModalUpload={setIsModalOpenUpload}></UploadSong>
      </Modal>
      <Modal
        open={isModalOpenUpdate}
        onCancel={handleCancel}
        onOk={handleOk}
        footer={null}
        centered
        destroyOnClose={true}
        className="w-fit h-fit modalStyle"
      >
        <UpdateSong
          songData={songData}
          setModalUpdate={setIsModalOpenUpdate}
        ></UpdateSong>
      </Modal>
    </div>
  );
};

export default CMSArtist;
