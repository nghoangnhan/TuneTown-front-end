import axios from "axios";
import "../../assets/CSS/ReactContexify.css";
import { Base_URL } from "../../api/config";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { setListSong } from "../../redux/slice/music";
import UseCookie from "../../hooks/useCookie";
import SongItem from "../Song/SongItem";

const SongSection = ({ titleSong }) => {
  const dispatch = useDispatch();
  const { getToken } = UseCookie();
  const { access_token } = getToken();
  const [songList, setSongList] = useState([]);
  const [hasMoreSongs, setHasMoreSongs] = useState(false);
  const [songPage, setSongPage] = useState(1);
  const [totalPages, setTotalPages] = useState();

  const getListSong = async (songPage) => {
    try {
      const response = await axios.get(`${Base_URL}/songs?page=${songPage}`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      const { songList, currentPage, totalPages } = response.data;
      console.log("songList Response", songList, currentPage, totalPages);
      setSongList((prevSongList) => [...prevSongList, ...songList]);
      setTotalPages(totalPages);
      setSongPage(currentPage);
      if (currentPage >= totalPages) {
        setHasMoreSongs(false);
      }
      return response.data;
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const handleLoadMore = () => {
    setSongPage((prevPage) => prevPage + 1);
    if (hasMoreSongs) {
      getListSong(songPage);
    }
  };

  useEffect(() => {
    getListSong(songPage);
  }, [songPage]);
  dispatch(setListSong(songList));
  if (!songList) return null;

  // Turn on e.preventDefault

  return (
    <div className="bg-[#FFFFFFCC] rounded-2xl max-xl:w-full m-auto xl:h-fit xl:ml-5 xl:mr-5 xl:mt-8 mt-4 pt-3 xl:pt-5 pl-3 xl:pl-5 pr-3 xl:pr-5 pb-3 xl:pb-5">
      <h1 className="text-[#2E3271] text-xl font-bold">{titleSong}</h1>
      <div className="xl:w-full">
        <div className="mt-2 flex flex-col gap-2">
          {songList &&
            songList.map((songItem) => (
              <div key={songItem.id}>
                <SongItem song={songItem} />
              </div>
            ))}
          {songPage < totalPages && (
            <div className="flex justify-center items-center   ">
              <button
                onClick={handleLoadMore}
                className="border border-solid py-2 px-2 w-fit text-[#399f39] border-[#399f39] hover:text-white hover:bg-[#399f39] rounded-md"
              >
                Load More
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SongSection;
