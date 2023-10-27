/* eslint-disable no-unused-vars */
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import axios from "axios";
import { Base_URL } from "../../api/config";
import SongItem from "./SongItem";
import { setListSong } from "../../redux/slice/music";
import UseCookie from "../../hooks/useCookie";

// eslint-disable-next-line react/prop-types
const SongSection = () => {
  const dispatch = useDispatch();
  const [songList, setSongList] = useState();
  const { getToken } = UseCookie();
  const { access_token } = getToken();
  const getListSong = async () => {
    try {
      console.log("auth", access_token);
      const response = await axios.get(`${Base_URL}/songs?page=1`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      const { songList } = response.data;
      console.log("songList Response", songList);
      setSongList(songList);
      return response.data;
    } catch (error) {
      console.log("Error:", error);
    }
  };

  useEffect(() => {
    getListSong();
  }, []);
  dispatch(setListSong(songList));
  if (!songList) return null;

  return (
    <div className="xl:w-full">
      <div className="mt-2 flex flex-col gap-2">
        {songList &&
          songList.map((songItem) => (
            <SongItem
              key={songItem.id}
              // songName={songItem.songName}
              // poster={songItem.poster}
              // genres={songItem.genres}
              // artists={songItem.artists}
              // songData={songItem.songData}
              song={songItem}
            />
          ))}
      </div>
    </div>
  );
};

export default SongSection;
