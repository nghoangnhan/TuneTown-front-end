import { Form, Input, Modal, Space, Table, message } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import UseCookie from "../../../hooks/useCookie";
import UploadSong from "../../UploadSong/UploadSong";
import UpdateSong from "../../UploadSong/UpdateSong";
import useConfig from "../../../utils/useConfig";

const SongManagement = () => {
  const { getToken } = UseCookie();
  const [form] = Form.useForm();
  const { Base_URL, Base_AVA } = useConfig();
  const { access_token } = getToken();
  const [songList, setSongList] = useState([]);
  const [songPage, setSongPage] = useState(1);
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
      console.log("auth", access_token);
      const response = await axios.get(`${Base_URL}/songs?page=${songPage}`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      const { songList, currentPage, totalPages } = response.data;
      console.log("songList Response", songList, currentPage, totalPages);
      setSongList(songList);

      return response.data;
    } catch (error) {
      console.log("Error:", error);
    }
  };
  // Update Song
  const handUpdateSong = (songId, songName) => {
    const songData = {
      songId: songId,
      songName: songName,
    };
    setSongData(songData);
    setIsModalOpenUpdate(true);
  };
  // Call this function when you want to refresh the playlist
  const showModal = () => {
    setIsModalOpenUpload(true);
  };
  // Delete Song
  const deleteSong = async (songId) => {
    try {
      if (confirm(`Are you sure you want to delete this song?`) == true) {
        const response = await axios.delete(
          `${Base_URL}/songs/deleteSong?songId=${songId}`,
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          }
        );
        if (response.status === 200) {
          message.success("Delete song successfully!");
        }
        // Refresh the component
        setRefresh(false);
        return response.status;
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const handleOk = () => {
    form.submit();
    setIsModalOpenUpload(false);
  };
  const handleCancel = () => {
    setIsModalOpenUpload(false);
    setIsModalOpenUpdate(false);
  };

  // Song Data {id,artists, genres, listens, poster, songData, songName, status}
  // 0: {id: 3, songName: 'Out Of Time', poster: 'https://avatar-ex-swe.nixcdn.com/song/2022/01/07/2/5/8/e/1641534807286_640.jpg', artists: Array(1), genres: Array(0), …}
  // 1: {id: 5, songName: 'Starboy', poster: 'https://upload.wikimedia.org/wikipedia/en/3/39/The_Weeknd_-_Starboy.png', artists: Array(1), genres: Array(0), …}

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
      title: "Listens",
      dataIndex: "listens",
      key: "listens",
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
                className="w-16 px-1 py-1 text-red-700 border border-red-700 rounded-md h-fit hover:opacity-70">
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
            onClick={() => handUpdateSong(record.key, record.songName)}
          >
            Edit
          </button>
          <button
            className="w-16 px-2 py-1 text-red-600 border border-red-600 rounded-md dark:border-red-500 dark:text-red-500 hover:opacity-60"
            onClick={() => deleteSong(record.key)}
          >
            Delete
          </button>
        </Space>
      ),
    },
  ];

  const dataSongs = songList.map((songItem) => ({
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
  console.log("dataSongs", dataSongs);
  useEffect(() => {
    setRefresh(true);
    getListSong(songPage);
  }, [isModalOpenUpload, isModalOpenUpdate, refresh]);

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
          >
            <Form.Item label="" name="songName">
              <Input placeholder="Search..." onChange={handSearch} />
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
        className="w-fit h-fit "
      >
        <UploadSong></UploadSong>
      </Modal>
      {/* Update Song  */}
      <Modal
        open={isModalOpenUpdate}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[null, null]}
        className="w-fit h-fit "
      >
        <UpdateSong songData={songData}></UpdateSong>
      </Modal>
    </div>
  );
};

export default SongManagement;
