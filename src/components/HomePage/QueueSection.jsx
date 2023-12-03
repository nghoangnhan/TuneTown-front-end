import { useMusicAPI } from "../../utils/songUtils";
import { useEffect, useState } from "react";
import { Form } from "antd";
import SongItem from "../Song/SongItem";
import { useSelector } from "react-redux";

const QueueSection = () => {
  const playlistId = 405;
  const { getListSongPlaylist, getPlaylistByPlaylistId } = useMusicAPI();
  const [songPlaylistList, setSongPlaylistList] = useState();
  const [playlistDetail, setPlaylistDetail] = useState({});
  const songQueue = useSelector((state) => state.music.songQueue);
  console.log("songQueue", songQueue);
  const [form] = Form.useForm();

  const fetchDataPlaylistInfor = async (playlistId) => {
    const detailData = await getPlaylistByPlaylistId(playlistId);
    if (detailData) {
      setPlaylistDetail(detailData);
      const { playlistName, playlistType } = detailData;
      form.setFieldsValue({
        playlistName,
        playlistType,
      });
    }
    const data = await getListSongPlaylist(playlistId);
    if (data) {
      setSongPlaylistList(data);
      console.log("data", data);
    }
  };
  useEffect(() => {
    fetchDataPlaylistInfor(405);
  }, [playlistId]);

  return (
    <div
      className={`${
        songPlaylistList != null && songPlaylistList.length > 0
          ? "h-screen"
          : "min-h-screen"
      } xl:p-5 bg-[#ecf2fd] mb-20`}
    >
      <div className="flex flex-row gap-4">
        <button
          onClick={() => window.history.back()}
          className="bg-[#2f9948] hover:bg-[#40cf62] rounded-md mb-5"
        >
          <div className="text-white font-bold px-2 py-1">{"<"} Back</div>
        </button>
      </div>
      <div className="text-4xl text-[#2d2c2c] font-bold text-start mb-5">
        Your Queue
      </div>

      <div className="text-2xl text-[#5d5c5c] font-bold text-start mt-10 mb-5">
        Now Playing
      </div>
      <SongItem
        song={{
          id: 1,
          songName: "What make you beautiful",
          artistName: ["One Direction", "Two Direction", "Three Direction"],
          songDuration: 214,
          songCover:
            "https://media.npr.org/assets/music/news/2010/09/maroon-e9cb8c5b25b4d1f3e68aa26e6a0ce51cf2ae59d8-s1100-c50.jpg",
          songLink: "https://www.youtube.com/watch?v=QJO3ROT-A4E",
        }}
      ></SongItem>

      <div className="text-2xl text-[#5d5c5c] font-bold text-start mt-5 mb-5">
        Next Up
      </div>
      {songQueue != null ? (
        songQueue.map((songItem) => (
          <div key={songItem.id}>
            <SongItem song={songItem} />
          </div>
        ))
      ) : (
        <div className="text-2xl text-[#5d5c5c] font-bold text-start mt-5 mb-5">
          No song in queue
        </div>
      )}
    </div>
  );
};

export default QueueSection;
