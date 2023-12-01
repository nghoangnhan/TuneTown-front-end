import SongPlaylist from "../Playlist/SongSectionPlaylist";
import { useMusicAPI } from "../../utils/songUtils";
import { useEffect, useState } from "react";
import { Form } from "antd";
import SongItem from "../Song/SongItem";

const QueueSection = () => {
  const playlistId = 405;
  const { getListSongPlaylist, getPlaylistByPlaylistId } = useMusicAPI();
  const [songPlaylistList, setSongPlaylistList] = useState();
  const [playlistDetail, setPlaylistDetail] = useState({});
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
      <div className="flex flex-row justify-center items-center mt-5 mb-5 text-[#4b4848]">
        <div className="w-1/4 text-center font-bold">ID</div>
        <div className="w-1/4 text-center font-bold">Song Name</div>
        <div className="w-1/4 text-center font-bold">Artist</div>
        <div className="w-1/4 text-center font-bold">Duration</div>
      </div>
      <div className="text-2xl text-[#5d5c5c] font-bold text-start mb-5">
        Now Playing
      </div>
      <SongItem
        song={{
          id: 1,
          songName: "Hello",
          artists: [
            {
              id: 1,
              artistName: "Adele",
            },
          ],
          songLink:
            "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
          songImage:
            "https://i.pinimg.com/originals/6b/7a/6e/6b7a6e0b8b1a8d8c9a2e0c0c2d4a4a9a.jpg",
          songLength: 100,
        }}
      ></SongItem>
      <div className="text-2xl text-[#5d5c5c] font-bold text-start mt-5 mb-5">
        Next Up
      </div>
      <SongPlaylist
        playlistId={playlistId}
        songData={songPlaylistList}
      ></SongPlaylist>
    </div>
  );
};

export default QueueSection;
