/* eslint-disable no-unused-vars */
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import axios from "axios";
import { Base_URL, auth } from "../../api/config";
import SongItem from "./SongItem";
import { setListSong } from "../../redux/slice/music";

const SongSection = () => {
  // const { data: songList, refetch: getListSong } = useQuery({
  //   queryKey: "songList",
  //   queryFn: () => getSongListApi(),

  //   // const response = await axios.get(`${Base_URL}/songs?page=1`, {
  //   //   headers: {
  //   //     Authorization: `Bearer ${auth.access_token}`,
  //   //   },
  //   // });
  //   // return response.data;
  //   onSuccess: () => {
  //     message.success("Get list user success");
  //   },
  // });

  const dispatch = useDispatch();
  const [songList, setSongList] = useState();

  const getListSong = async () => {
    try {
      console.log("auth", auth.access_token);
      const response = await axios.get(`${Base_URL}/songs?page=1`, {
        headers: {
          Authorization: `Bearer ${auth.access_token}`,
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
  console.log("songListtttt", songList);

  return (
    <div className="xl:w-full">
      <div className="mt-5 flex flex-col gap-2">
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
