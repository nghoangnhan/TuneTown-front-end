import axios from "axios";
import UseCookie from "../../hooks/useCookie";
import { useEffect, useState } from "react";
import { Form, Input, Modal, Space, Table, message } from "antd";
import UpdateSong from "../../components/UploadSong/UpdateSong";
import useUserUtils from "../../utils/useUserUtils";
import useConfig from "../../utils/useConfig";
import UploadSong from "../../components/UploadSong/UploadSong";

const CMSArtist = () => {
  const { getToken } = UseCookie();
  const { access_token } = getToken();
  const { Base_URL, Base_AVA } = useConfig();
  const userId = localStorage.getItem("userId");
  const [form] = Form.useForm();
  const [refresh, setRefresh] = useState(false);
  const [artistDetail, setArtistDetail] = useState({});
  const [songListArtist, setSongListArtist] = useState([]);
  const [songData, setSongData] = useState({});
  const [searchValue, setSearchValue] = useState("");
  const [isModalOpenUpdate, setIsModalOpenUpdate] = useState(false);
  const [isModalOpenUpload, setIsModalOpenUpload] = useState(false);
  const { getArtistByArtistId } = useUserUtils();

  const handleGetArtistDetail = async (artistId) => {
    await getArtistByArtistId(artistId).then((result) => {
      setArtistDetail(result);
      setSongListArtist(result.songs);
    });
  };
  const handSearch = (e) => {
    console.log("value", e.target.value);
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
    };
    setSongData(songDetail);
    setIsModalOpenUpdate(true);
  };
  const handleOk = () => {
    form.submit();
    setIsModalOpenUpload(false);
  };
  const handleCancel = () => {
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
      if (confirm(`Are you sure you want to delete this song?`) == true) {
        console.log("auth", access_token);
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
  const dataSongTable = songListArtist.map((songItem) => ({
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
        <Space>
          <button
            className="px-2 py-1 text-white rounded-md w-14 bg-primary hover:opacity-70"
            onClick={() => handUpdateSong(
              record.key,
              record
            )}
          >
            Edit
          </button>
          <button
            className="py-1 px-2 w-14 bg-[#c42323e1] hover:opacity-70 text-white rounded-md"
            onClick={() => deleteSong(record.key)}
          >
            Delete
          </button>
        </Space>
      ),
    },
  ];
  useEffect(() => {
    if (localStorage.getItem("userRole") !== "ARTIST") {
      window.location.href = "/";
    }
  }, []);
  useEffect(() => {
    handleGetArtistDetail(userId);
  }, [userId, refresh]);
  return (
    <div className="h-full min-h-screen px-4 pt-5 pb-24 text-headingText dark:text-headingTextDark bg-backgroundPrimary dark:bg-backgroundDarkPrimary">
      {" "}
      <div className="flex flex-row">
        <div className="mx-3 my-5 text-4xl font-bold text-primary dark:text-primaryDarkmode">
          Good{" "}
          {new Date().getHours() < 12
            ? "Morning"
            : new Date().getHours() < 18
              ? "Afternoon"
              : "Evening"}
          {", "}
          {artistDetail.name ? artistDetail.name : "Unknown Artist"}
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
              <Input placeholder="Search Song" onChange={handSearch} />
            </Form.Item>
          </Form>
        </div>
        <div>
          <button
            className="px-3 py-1 text-white rounded-md bg-primary hover:bg-primaryDarkmode"
            onClick={showModal}
          >
            Create New Song
          </button>
        </div>
      </div>
      <Table
        columns={columnsSong}
        className="p-1 bg-backgroundPrimary dark:bg-backgroundDarkPrimary "
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
        <UploadSong></UploadSong>
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
        <UpdateSong songData={songData}></UpdateSong>
      </Modal>
    </div>
  );
};

export default CMSArtist;
