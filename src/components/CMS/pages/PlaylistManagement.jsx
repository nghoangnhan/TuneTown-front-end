import { Form, Input, Modal, Space, Table, } from "antd";
import { useEffect, useState } from "react";
import UploadSong from "../../UploadSong/UploadSong";
import UpdateSong from "../../UploadSong/UpdateSong";
import defaultAva from "../../../assets/img/logo/logo.png";
import { useMusicAPIUtils } from "../../../utils/useMusicAPIUtils";

const PlaylistManagement = () => {
  const [form] = Form.useForm();
  const { getUserPlaylist } = useMusicAPIUtils();
  const [playlistList, setPlaylistList] = useState([
    {
      "id": 452,
      "playlistName": "New playlist",
      "user": {
        "id": 1202,
        "userName": "The Weeknd",
        "email": "theweeknd@gmail.com",
        "password": "$2a$10$dngXenLKAEkkf7Ory.OiqeTdhGZyC6VVshcUTWy/jeGiKHLB1W8Ce",
        "role": "ARTIST",
        "birthDate": "2001-01-01",
        "userBio": "I am an artist",
        "avatar": "https://firebasestorage.googleapis.com/v0/b/tunetown-6b63a.appspot.com/o/images%2Fstarboy.jpg?alt=media&token=3e23a99b-473d-4c0e-9b21-8847bc7ca0ba",
        "method": null,
        "genres": [
          {
            "id": 8,
            "genreName": "Indie"
          },
          {
            "id": 1,
            "genreName": "Pop"
          },
          {
            "id": 6,
            "genreName": "Classic"
          },
          {
            "id": 5,
            "genreName": "Country"
          }
        ]
      },
      "playlistType": "Private",
      "coverArt": "https://firebasestorage.googleapis.com/v0/b/tunetown-6b63a.appspot.com/o/images%2Fdontoliver.jpg?alt=media&token=a15c7c74-84e7-4be0-a020-fb879bb6428c",
      "playlistSongsList": null
    },
    {
      "id": 453,
      "playlistName": "New playlist",
      "user": {
        "id": 1202,
        "userName": "The Weeknd",
        "email": "theweeknd@gmail.com",
        "password": "$2a$10$dngXenLKAEkkf7Ory.OiqeTdhGZyC6VVshcUTWy/jeGiKHLB1W8Ce",
        "role": "ARTIST",
        "birthDate": "2001-01-01",
        "userBio": "I am an artist",
        "avatar": "https://firebasestorage.googleapis.com/v0/b/tunetown-6b63a.appspot.com/o/images%2Fstarboy.jpg?alt=media&token=3e23a99b-473d-4c0e-9b21-8847bc7ca0ba",
        "method": null,
        "genres": [
          {
            "id": 8,
            "genreName": "Indie"
          },
          {
            "id": 1,
            "genreName": "Pop"
          },
          {
            "id": 6,
            "genreName": "Classic"
          },
          {
            "id": 5,
            "genreName": "Country"
          }
        ]
      },
      "playlistType": "Private",
      "coverArt": "https://firebasestorage.googleapis.com/v0/b/tunetown-6b63a.appspot.com/o/images%2F8ball.jpg?alt=media&token=69ab9607-e63f-4755-b22a-9d8e82f2ebdd",
      "playlistSongsList": null
    },
  ]);
  const [refresh, setRefresh] = useState(false);
  const [isModalOpenUpdate, setIsModalOpenUpdate] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [isModalOpenUpload, setIsModalOpenUpload] = useState(false);

  const handSearch = (e) => {
    console.log("value", e.target.value);
    setSearchValue(e.target.value);
  };

  const handleOk = () => {
    form.submit();
  };
  const handleCancel = () => {
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
      title: "Playlist Name",
      dataIndex: "playlistName",
      key: "playlistName",
      align: "center",
    }, {
      title: "Owner",
      dataIndex: "artists",
      key: "artists",
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
        return (
          <div className="flex items-center justify-center">
            <span
              className={`w-16 py-1 px-2 text-white rounded-md ${status === 1 ? "bg-green-500" : "bg-red-500"
                }`}
            >
              {status === 1 ? "Active" : "Inactive"}
            </span>
          </div>
        );
      },
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
              src={poster.props.src ? poster.props.src : defaultAva}
              alt="poster"
              className="w-12 h-12 rounded-lg"
            />
          </div>
        );
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
          // onClick={() => handleUpdatePlaylist(record.key, record.playlistName)}
          >
            Update
          </button>
          <button
            className="w-16 px-2 py-1 text-red-600 border border-red-600 rounded-md dark:border-red-500 dark:text-red-500 hover:opacity-60"
          // onClick={() => deletePlaylist(record.key)}
          >
            Delete
          </button>
        </Space>
      ),
    },
  ];

  const playlistData = playlistList?.map((playlistItem) => ({
    key: playlistItem.id.toString(), // Assuming id is unique
    playlistName: playlistItem.playlistName,
    artists: playlistItem.user.userName,
    genres: playlistItem.user.genres.map((genre) => genre.genreName).join(", "),
    listens: 0,
    status: 1,
    poster: {
      props: {
        src: playlistItem.coverArt,
      },
    },
  }));

  useEffect(() => {
    getUserPlaylist(1202).then((res) => {
      console.log("Playlist", res);
      setPlaylistList(res);
    });
  }, []);

  useEffect(() => {
    if (refresh === true) {
      getUserPlaylist(1202).then((res) => {
        console.log("Playlist", res);
        setPlaylistList(res);
      });
    }
  }, [refresh]);

  if (!playlistList) return null;
  return (
    <div className="h-full min-h-screen">
      <div className="text-2xl font-bold text-primary dark:text-primaryDarkmode">Playlist Management</div>
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
            <Form.Item label="" name="playlistName">
              <Input placeholder="Search..." onChange={handSearch} className="text-primaryText2 dark:text-primaryTextDark2" />
            </Form.Item>
          </Form>
        </div>
        <div>
          <button
            className="px-4 py-2 text-white rounded-md bg-primary dark:bg-primaryDarkmode hover:opacity-70"
            onClick={setIsModalOpenUpload}
          >
            Create New Playlist
          </button>
        </div>
      </div>
      <Table
        columns={columnsSong}
        dataSource={
          searchValue
            ? playlistData.filter((playlist) =>
              playlist.playlistName.toLowerCase().includes(searchValue.toLowerCase())
            )
            : playlistData
        }
        pagination={{ pageSize: 8 }}
      />
      {/* Upload Song  */}
      <Modal
        open={isModalOpenUpload}
        onOk={handleOk}
        centered
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
        centered
        onCancel={handleCancel}
        footer={[null, null]}
        className="w-fit h-fit "
      >
        <UpdateSong songData={playlistData}></UpdateSong>
      </Modal>
    </div>
  );
};

export default PlaylistManagement;
