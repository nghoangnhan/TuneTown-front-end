/* eslint-disable no-unused-vars */
import axios from "axios";
import "../../assets/CSS/ReactContexify.css";
import { Base_URL } from "../../api/config";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { setListSong } from "../../redux/slice/music";
import UseCookie from "../../hooks/useCookie";
import SongItem from "../Song/SongItem";

// eslint-disable-next-line react/prop-types
const SongSection = ({ titleSong }) => {
  const { getToken } = UseCookie();
  const dispatch = useDispatch();
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
      setTotalPages(totalPages);
      if (currentPage < totalPages) {
        setHasMoreSongs(true);
      } else if (currentPage >= totalPages) {
        setHasMoreSongs(false);
      }
      return response.data;
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const handleLoadMore = () => {
    setSongPage((prevPage) => prevPage + 1);
  };

  useEffect(() => {
    getListSong(songPage).then((response) => {
      const { songList, currentPage } = response;
      if (currentPage > 1) {
        setSongList((prevSongList) => [...prevSongList, ...songList]);
        dispatch(setListSong(songList));
      } else if (currentPage === 1) {
        setSongList(songList);
        dispatch(setListSong(songList));
      }
    });
  }, [songPage]);
  if (!songList) return null;

  return (
    <div className="bg-[#FFFFFFCC] shadow-md rounded-2xl m-auto xl:h-fit xl:ml-5 xl:mr-5 xl:mt-8 mt-4 pt-3 xl:pt-5 pl-3 xl:pl-5 pr-3 xl:pr-5 pb-3 xl:pb-5">
      <h1 className="text-xl font-bold text-primary">{titleSong}</h1>
      <div className="flex flex-col gap-2 mt-2 xl:w-full">
        {songList &&
          songList.map((songItem, index) => (
            <div key={index}>
              <SongItem song={songItem} songOrder={index} />
            </div>
          ))}
        {hasMoreSongs == true && (
          <div className="flex items-center justify-center ">
            <button
              onClick={() => handleLoadMore()}
              className="px-2 py-2 transition duration-300 ease-in-out border border-solid rounded-md w-fit text-primary border-primary hover:text-white hover:bg-primary"
            >
              Load More
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SongSection;
