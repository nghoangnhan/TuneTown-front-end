/* eslint-disable no-unused-vars */
import { Button, Form, Input, Modal, Space, Table, Tag } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { Base_URL } from "../../../api/config";
import UseCookie from "../../../hooks/useCookie";
import UploadSong from "../../UploadSong/UploadSong";

const SongManagement = () => {
  const { getToken } = UseCookie();
  const [form] = Form.useForm();
  const { access_token } = getToken();
  const [songList, setSongList] = useState([]);
  const [hasMoreSongs, setHasMoreSongs] = useState(false);
  const [songPage, setSongPage] = useState(1);
  const [totalPages, setTotalPages] = useState();
  const [refresh, setRefresh] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Call this function when you want to refresh the playlist
  const showModal = () => {
    setIsModalOpen(true);
  };

  const refreshPlaylist = () => {
    setRefresh(!refresh);
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
      setSongList((prevSongList) => {
        if (currentPage === 1) {
          // If it's the first page, replace the existing list
          return [...songList];
        } else {
          // If it's not the first page, append the new songs
          return [...prevSongList, ...songList];
        }
      });
      refreshPlaylist();
      setTotalPages(totalPages);
      setSongPage(currentPage);
      if (currentPage >= totalPages) {
        setHasMoreSongs(false);
      }
      return response.data;
    } catch (error) {
      console.log("Error:", error);
    }
  };
  const deleteSong = async (songId) => {
    try {
      confirm(`Are you sure you want to delete this song?`);
      if (confirm) {
        console.log("auth", access_token);
        const response = await axios.delete(
          `${Base_URL}/songs/deleteSong?songId=${songId}`,
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          }
        );
        // Refresh the component
        refreshPlaylist();
        return response.data;
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const handleOk = () => {
    form.submit();
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  // Song Data {id,artists, genres, listens, poster, songData, songName, status}
  // 0: {id: 3, songName: 'Out Of Time', poster: 'https://avatar-ex-swe.nixcdn.com/song/2022/01/07/2/5/8/e/1641534807286_640.jpg', artists: Array(1), genres: Array(0), …}
  // 1: {id: 5, songName: 'Starboy', poster: 'https://upload.wikimedia.org/wikipedia/en/3/39/The_Weeknd_-_Starboy.png', artists: Array(1), genres: Array(0), …}

  const columnsSong = [
    { title: "Poster", dataIndex: "poster", key: "poster" },
    {
      title: "Song Name",
      dataIndex: "songName",
      key: "songName",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Artist",
      dataIndex: "artists", // key in dataSongs
      key: "artists", // key in columnsSong
    },
    {
      title: "Genres",
      dataIndex: "genres",
      key: "genres",
    },
    {
      title: "Listens",
      dataIndex: "listens",
      key: "listens",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          {/* <button className="py-1 px-2 bg-slate-800 rounded-lg">Edit</button> */}
          <button
            className="py-1 px-2 bg-[#c42323e1] hover:bg-[#ea3f3f] text-white rounded-lg"
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
        className="w-11 h-11 rounded-md"
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
    getListSong(songPage);
  }, [isModalOpen]);

  if (!songList) return null;
  return (
    <div>
      <div className="text-2xl font-bold">Song Management</div>
      <div className=" flex flex-row justify-between mb-5">
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
            <Form.Item label="Name" name="majorName">
              <Input placeholder="majorName" />
            </Form.Item>
            <Form.Item>
              <Button type="default" htmlType="submit">
                Search
              </Button>
            </Form.Item>
          </Form>
        </div>
        <div className="">
          <Button type="default" onClick={() => showModal()}>
            Create New Song
          </Button>
        </div>
      </div>
      <Table columns={columnsSong} dataSource={dataSongs} />
      <Modal
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[null, null]}
        className="w-fit h-fit "
      >
        <UploadSong></UploadSong>
      </Modal>
    </div>
  );
};

export default SongManagement;
