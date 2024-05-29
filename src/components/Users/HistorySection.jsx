import { useEffect, useState } from "react";
import { Table } from "antd";
import axios from "axios";
import UseCookie from "../../hooks/useCookie";
import useConfig from "../../utils/useConfig";

const HistorySection = () => {
  const { getToken } = UseCookie();
  const { access_token } = getToken();
  const { Base_URL, Base_AVA } = useConfig();
  const [songList, setSongList] = useState([]);
  const userId = localStorage.getItem("userId");

  const getListSongHistory = async () => {
    try {
      const response = await axios.post(
        `${Base_URL}/users/getHistory?userId=${userId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      // console.log("Song History", response.data);
      setSongList(response.data);
      console.log("Song History", response.data);
      return response.data;
    } catch (error) {
      console.log("Error:", error);
    }
  };
  const dataSongTable = songList.map((songItem) => ({
    key: songItem.id, // Assuming id is unique
    poster: (
      <img
        src={songItem.song.poster ? songItem.song.poster : Base_AVA}
        alt={songItem.song.songName ? songItem.song.songName : "Song"}
        className="rounded-md w-11 h-11"
      />
    ),
    songName: songItem.song.songName,
    artists: songItem.song.artists.map((artist) => artist.userName + " "), // Assuming artists is an array
    genres: songItem.song.genres.map((genre) => genre.genreName + " "), // Assuming genres is an array
  }));

  const columnsSong = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      align: "center",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Poster", dataIndex: "poster", key: "poster",
      align: "center",
      render: (poster) => {
        return (
          <div className="flex items-center justify-center">
            {poster}
          </div>
        );
      }
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

    // {
    //   title: "Action",
    //   key: "action",
    //   render: (_, record) => (
    //     <Space size="middle">
    //       {/* <button className="px-2 py-1 rounded-lg bg-slate-800">Edit</button> */}
    //       {/* <button
    //         className="py-1 px-2 bg-[#c42323e1] hover:bg-[#ea3f3f] text-white rounded-lg"
    //         onClick={() => deleteSong(record.key)}
    //       >
    //         Delete
    //       </button> */}
    //     </Space>
    //   ),
    // },
  ];

  useEffect(() => {
    getListSongHistory();
  }, []);

  if (!songList) return null;
  return (
    <div className="h-full min-h-screen xl:p-5 bg-backgroundPrimary dark:bg-backgroundDarkPrimary">
      <div className="my-4 text-4xl font-bold text-primary dark:text-primaryDarkmode">History</div>
      <Table columns={columnsSong} dataSource={dataSongTable} />
    </div>
  );
};

export default HistorySection;
