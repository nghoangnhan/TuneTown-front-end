/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { Button, Form, Input, Space, Table } from "antd";
import axios from "axios";
import UseCookie from "../../hooks/useCookie";
import useConfig from "../../utils/useConfig";

const HistorySection = () => {
  const { getToken } = UseCookie();
  const { access_token } = getToken();
  const { Base_URL } = useConfig();
  const [songList, setSongList] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const userId = localStorage.getItem("userId");

  const refreshPlaylist = () => {
    setRefresh(!refresh);
  };

  const getListSongHistory = async () => {
    try {
      console.log("auth", access_token);
      const response = await axios.post(
        `${Base_URL}/users/getHistory?userId=${userId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      console.log("Song History", response.data);
      setSongList(response.data);
      return response.data;
    } catch (error) {
      console.log("Error:", error);
    }
  };
  const dataSongTable = songList.map((songItem) => ({
    key: songItem.id, // Assuming id is unique
    poster: (
      <img
        src={songItem.song.poster}
        alt={songItem.song.songName}
        className="rounded-md w-11 h-11"
      />
    ),
    songName: songItem.song.songName,
    artists: songItem.song.artists.map((artist) => artist.userName + " "), // Assuming artists is an array
    genres: songItem.song.genres.map((genre) => genre.genreName + " "), // Assuming genres is an array
  }));

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
    <div className="min-h-screen h-full xl:p-5 bg-backgroundPrimary dark:bg-backgroundDarkPrimary mb-20">
      <div className="text-2xl font-bold">Song Management</div>
      <div className="flex flex-row justify-between mt-5 mb-5 "></div>
      <Table columns={columnsSong} dataSource={dataSongTable} />
    </div>
  );
};

export default HistorySection;
