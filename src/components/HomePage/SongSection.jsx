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
  const [songList, setSongList] = useState([]);
  const { getToken } = UseCookie();
  const { access_token } = getToken();
  const [hasMoreSongs, setHasMoreSongs] = useState(false);
  const [songPage, setSongPage] = useState(1);
  const [totalPages, setTotalPages] = useState();
  const [refresh, setRefresh] = useState(false);
  // Call this function when you want to refresh the playlist
  const refreshPlaylist = () => {
    setRefresh(!refresh);
  };

  const getListSong = async (songPage) => {
    try {
      console.log("auth", access_token);
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
  const deleteSong = async (songId) => {
    try {
      confirm(`Are you sure you want to delete this song?`);
      if (confirm) {
        console.log("auth", access_token);
        const response = await axios.delete(
          `${Base_URL}/songs/deleteSong?songId=${songId}`,
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          }
        );
        // Refresh the component
        refreshPlaylist();
        return response.data;
      }
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

  return (
    <div className="xl:w-full">
      <div className="mt-2 flex flex-col gap-2">
        {songList &&
          songList.map((songItem) => (
            <div
              onContextMenu={(event) => {
                event.preventDefault();
                deleteSong(songItem.id);
              }}
              key={songItem.id}
            >
              <SongItem song={songItem} />
            </div>

            /* <SongItem
              // songName={songItem.songName}
              // poster={songItem.poster}
              // genres={songItem.genres}
              // artists={songItem.artists}
              // songData={songItem.songData}
              song={songItem}
              key={songItem.id} 
            />*/
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
  );
};

export default SongSection;
