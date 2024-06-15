import axios from "axios";
import "../../../assets/CSS/ReactContexify.css";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { setListSong } from "../../../redux/slice/music";
import UseCookie from "../../../hooks/useCookie";
import SongItem from "../../Song/SongItem";
import useConfig from "../../../utils/useConfig";
import { useTranslation } from "react-i18next";

// eslint-disable-next-line react/prop-types
const SongSection = ({ titleSong }) => {
  const { getToken } = UseCookie();
  const dispatch = useDispatch();
  const { Base_URL } = useConfig();
  const { access_token } = getToken();
  const [songList, setSongList] = useState([]);
  const [hasMoreSongs, setHasMoreSongs] = useState(false);
  const [songPage, setSongPage] = useState(1);
  // const [totalPagesss, setTotalPages] = useState();
  const { t } = useTranslation();

  const getListSong = async (songPage) => {
    try {
      const response = await axios.get(`${Base_URL}/songs?page=${songPage}`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      const { songList, currentPage, totalPages } = response.data;
      // console.log("songList Response", songList, currentPage, totalPages);
      // setTotalPages(totalPages);
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
    <div className="px-3 py-3 m-auto mx-1 mt-4 shadow-md bg-backgroundComponentPrimary dark:bg-backgroundComponentDarkPrimary rounded-2xl xl:h-fit xl:mx-5 xl:mt-8 xl:py-5 xl:px-5">
      <h1 className="text-3xl font-bold text-center text-primary dark:text-primaryDarkmode">{titleSong}</h1>
      <div className="flex flex-col gap-2 mt-2 xl:w-full overflow-auto max-h-[1170px]">
        {songList &&
          songList.map((songItem, index) => (
            <div key={index}>
              <SongItem song={songItem} songOrder={index + 1} />
            </div>
          ))}
        {hasMoreSongs == true && (
          <div className="flex items-center justify-center ">
            <button
              onClick={() => handleLoadMore()}
              className="px-2 py-2 transition duration-300 ease-in-out border border-solid rounded-md w-fit text-primary border-primary dark:text-primaryDarkmode dark:border-primaryDarkmode hover:opacity-70"
            >
              {t("common.loadMore")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SongSection;
