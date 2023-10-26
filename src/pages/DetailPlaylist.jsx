import { useEffect, useState } from "react";
import { Base_URL, auth } from "../api/config";
import axios from "axios";
import { useParams } from "react-router-dom";
import SongPlaylist from "../components/Playlist/SongPlaylist";

const DetailPlaylist = () => {
  //http://localhost:8080/playlists/getPlaylistSongs?playlistId=102
  const { playlistId } = useParams();
  const [songPlaylistList, setSongPlaylistList] = useState();
  console.log("playlistId", playlistId);
  const getListSongPlaylist = async () => {
    try {
      console.log("auth", auth.access_token);
      const response = await axios.get(
        `${Base_URL}/playlists/getPlaylistSongs?playlistId=${playlistId}`,
        {
          headers: {
            Authorization: `Bearer ${auth.access_token}`,
          },
        }
      );
      console.log("DetailPlaylist || SongList Response", response.data);
      setSongPlaylistList(response.data);
      return response.data;
    } catch (error) {
      console.log("Error:", error);
    }
  };
  useEffect(() => {
    getListSongPlaylist();
  }, []);
  return (
    <div className="xl:p-5 bg-[#B9C0DE] mb-20">
      <div className="text-4xl font-bold text-center mb-5">
        Playlist Detail <span className="">{playlistId}</span>
      </div>
      <button
        onClick={() => window.history.back()}
        className="bg-[#2f9948] hover:bg-[#40cf62] rounded-md mb-5"
      >
        <div className="text-white font-bold px-2 py-1">{"<"} Back </div>
      </button>
      <SongPlaylist
        playlistId={playlistId}
        songData={songPlaylistList}
      ></SongPlaylist>
    </div>
  );
};

export default DetailPlaylist;
