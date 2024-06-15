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

  const formatDate = (dateListen) => {
    const strDate = String(dateListen);
    const year = strDate.substring(0, 4);
    const month = strDate.substring(5, 7);
    const day = strDate.substring(8, 10);
    return `${day}/${month}/${year}`;
  };

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
      // console.log("Song History", response.data);
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
    dateListen: formatDate(songItem.dateListen),
  }));

  const columnsSong = [
    {
      title: "Poster",
      dataIndex: "poster",
      key: "poster",
      align: "center",
      render: (poster) => {
        return <div className="flex items-center justify-center">{poster}</div>;
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
      title: "Listening Date",
      dataIndex: "dateListen",
      key: "dateListen",
      align: "center",
    },
  ];

  useEffect(() => {
    getListSongHistory();
  }, []);

  if (!songList) return null;
  return (
    <div className="h-fit">
      <div className="px-1 py-1 text-4xl font-bold text-center text-primary dark:text-primaryDarkmode rounded-2xl xl:h-fit xl:py-2 xl:mb-3">
        Currently Listen
      </div>
      <Table columns={columnsSong} dataSource={dataSongTable} />
    </div>
  );
};

export default HistorySection;
