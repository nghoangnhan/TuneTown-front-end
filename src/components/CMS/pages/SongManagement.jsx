import { Form, Input, Modal, Space, Table } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import UseCookie from "../../../hooks/useCookie";
import UploadSong from "../../UploadSong/UploadSong";
import UpdateSong from "../../UploadSong/UpdateSong";
import useConfig from "../../../utils/useConfig";
import { useMusicAPIUtils } from "../../../utils/useMusicAPIUtils";

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const SongManagement = () => {
  const { getToken } = UseCookie();
  const [form] = Form.useForm();
  const { Base_URL } = useConfig();
  const { access_token } = getToken();
  const { deleteSong } = useMusicAPIUtils();
  const [songList, setSongList] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [songData, setSongData] = useState({});
  const [isModalOpenUpload, setIsModalOpenUpload] = useState(false);
  const [isModalOpenUpdate, setIsModalOpenUpdate] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const handSearch = (e) => {
    console.log("value", e.target.value);
    setSearchValue(e.target.value);
  };

  const getListSong = async (songPage) => {
    try {
      if (songPage === null || songPage === undefined) songPage = 1;
      const response = await axios.get(`${Base_URL}/songs/getAllSongsByAdmin?page=${songPage}`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      const { songList, currentPage, totalPages } = response.data;
      console.log("songList Response", songList, currentPage, totalPages);
      return response.data;
    } catch (error) {
      console.log("Error:", error);
    }
  };
  // Update Song
  const handUpdateSong = (songId, songName, poster, songData, artists, genres, listens, status) => {
    const songDetail = {
      songId: songId,
      songName: songName,
      poster: poster,
      songData: songData,
      artists: artists,
      genres: genres,
      listens: listens,
      status: status,
    };
    setSongData(songDetail);
    setIsModalOpenUpdate(true);
  };
  // Call this function when you want to refresh the playlist
  const showModal = () => {
    setIsModalOpenUpload(true);
  };
  // Delete Song
  const handleDeleteSong = async (userId) => {
    await deleteSong(userId).then(() => setRefresh(true))
  }


  const handleOk = () => {
    form.submit();
    setIsModalOpenUpload(false);
    setIsModalOpenUpdate(false);
    setRefresh(true);
  };

  const handleCancel = () => {
    setIsModalOpenUpload(false);
    setIsModalOpenUpdate(false);
  };

  const columnsSong = [
    {
      title: "ID",
      dataIndex: "key",
      key: "key",
      align: "center",
    },
    {
      title: "Poster",
      dataIndex: "poster",
      key: "poster",
      align: "center",
      render: (poster) => {
        return (
          <div className="flex items-center justify-center">
            {poster && <img
              src={poster}
              alt="poster"
              className="w-12 h-12 rounded-full dark:bg-white"
            />}
            {
              !poster && <div>None</div>
            }
          </div>
        );
      },
    },
    {
      title: "Song Name",
      dataIndex: "songName",
      key: "songName",
      align: "center",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Artist",
      dataIndex: "artists", // key in dataSongs
      key: "artists", // key in columnsSong
      align: "center",
    },
    {
      title: "Genres",
      dataIndex: "genres",
      key: "genres",
      align: "center",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (status) => {
        if (status === 0) {
          return (
            <div className="flex items-center justify-center">
              <div
                className="w-16 px-1 py-1 text-red-700 border border-red-700 rounded-md dark:text-red-500 dark:border-red-500 h-fit hover:opacity-70">
                Deleted
              </div>
            </div>
          );
        } else if (status === 1) {
          return (
            <div className="flex items-center justify-center">
              <div
                className="w-16 px-1 py-1 border rounded-md h-fit text-primary dark:text-primaryDarkmode border-primary hover:opacity-70"
              >
                Public
              </div>
            </div>
          );
        }
      },
    },
    {
      title: "Action",
      key: "action",
      align: "center",
      render: (_, record) => (
        <Space className="flex items-center justify-center">
          <button
            className="w-16 px-2 py-1 border rounded-md border-primary dark:border-primaryDarkmode text-primary dark:text-primaryDarkmode hover:opacity-60"
            onClick={() => handUpdateSong(record.key, record.songName, record.poster, record.artists, record.genres, record.listens, record.status)}
          >
            Update
          </button>
          <button
            className="w-16 px-2 py-1 text-red-600 border border-red-600 rounded-md dark:border-red-500 dark:text-red-500 hover:opacity-60"
            onClick={() => handleDeleteSong(record.key)}
          >
            Delete
          </button>
        </Space>
      ),
    },
  ];

  const dataSongs = songList.length > 0 && songList.map((songItem) => ({
    key: songItem.id.toString(), // Assuming id is unique
    poster: songItem.poster,
    songName: songItem.songName,
    songData: songItem.songData,
    artists: songItem.artists.map((artist) => artist.userName + " "), // Assuming artists is an array
    genres: songItem.genres.map((genre) => genre.genreName + " "), // Assuming genres is an array
    listens: songItem.listens,
    status: songItem.status,
  }));


  useEffect(() => {
    getListSong().then((res) => { setSongList(res.songList); setRefresh(false) })
  }, []);

  useEffect(() => {
    if (refresh == true) {
      getListSong().then((res) => {
        setSongList(res.songList)
        setRefresh(false)
      })
    }
  }, [refresh])

  if (!songList) return null;
  return (
    <div className="h-full min-h-screen">
      <div className="text-2xl font-bold text-primary dark:text-primaryDarkmode">Song Management</div>
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
            {...layout}
          >
            <Form.Item label="" name="songName">
              <Input placeholder="Search..." onChange={handSearch} className="text-primaryText2 dark:text-primaryTextDark2" />
            </Form.Item>
          </Form>
        </div>
        <div>
          <button
            className="px-4 py-2 text-white rounded-md bg-primary dark:bg-primaryDarkmode hover:opacity-70"
            onClick={showModal}
          >
            Create New Song
          </button>
        </div>
      </div>
      <Table
        columns={columnsSong}
        dataSource={
          searchValue
            ? dataSongs.filter((song) =>
              song.songName.toLowerCase().includes(searchValue.toLowerCase())
            )
            : dataSongs
        }
        pagination={{ pageSize: 8 }}
      />
      {/* Upload Song  */}
      <Modal
        open={isModalOpenUpload}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[null, null]}
        className="w-fit h-fit modalStyle"
        centered
      >
        <UploadSong setOpenModalUpload={setIsModalOpenUpload}></UploadSong>
      </Modal>
      {/* Update Song  */}
      <Modal
        open={isModalOpenUpdate}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[null, null]}
        className="w-fit h-fit modalStyle"
        centered
      >
        <UpdateSong setModalUpdate={setIsModalOpenUpdate} setRefresh={setRefresh} songData={songData}></UpdateSong>
      </Modal>
    </div>
  );
};

export default SongManagement;
