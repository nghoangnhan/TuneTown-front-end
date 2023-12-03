import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SongPlaylist from "./SongSectionPlaylist";
import { Form } from "antd";
import { useMusicAPI } from "../../utils/songUtils";

const DetailPlaylist = () => {
  //http://localhost:8080/playlists/getPlaylistSongs?playlistId=102
  const { playlistId } = useParams();
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
    fetchDataPlaylistInfor(playlistId);
  }, [playlistId]);

  return (
    <div
      className={`${
        songPlaylistList != null && songPlaylistList.length > 0
          ? "h-screen"
          : "min-h-screen"
      } xl:p-5 bg-[#ecf2fd] mb-20`}
    >
      <div className="text-4xl text-[#4b4848] font-bold text-center mb-5">
        {playlistDetail.playlistName} <span className="">#{playlistId}</span>
      </div>
      <div className="flex flex-row gap-4">
        <button
          onClick={() => window.history.back()}
          className="bg-[#2f9948] hover:bg-[#40cf62] rounded-md mb-5"
        >
          <div className="text-white font-bold px-2 py-1">{"<"} Back</div>
        </button>
      </div>
      <div className="flex flex-row justify-center items-center mt-5 mb-5 text-[#4b4848]">
        <div className="w-1/4 text-center font-bold">ID</div>
        <div className="w-1/4 text-center font-bold">Song Name</div>
        <div className="w-1/4 text-center font-bold">Artist</div>
        <div className="w-1/4 text-center font-bold">Duration</div>
      </div>
      <SongPlaylist
        playlistId={playlistId}
        songData={songPlaylistList}
      ></SongPlaylist>
    </div>
  );
};

export default DetailPlaylist;
