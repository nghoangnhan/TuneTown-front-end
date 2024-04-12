/* eslint-disable no-unused-vars */
import axios from "axios";
import "../../assets/CSS/ReactContexify.css";
import { useEffect, useState } from "react";
import UseCookie from "../../hooks/useCookie";
import SongItem from "../Song/SongItem";
import useConfig from "../../utils/useConfig";

// eslint-disable-next-line react/prop-types
const SongChart = ({ titleSong, StartTime, EndTime }) => {
  const { getToken } = UseCookie();
  const { access_token } = getToken();
  const { Base_URL } = useConfig();
  const [songList, setSongList] = useState([]);
  const [songPage, setSongPage] = useState(1);
  const titleSongChart = titleSong
    ? titleSong
    : `Top 10 Songs in ${new Date().getMonth() < 3
      ? "Spring"
      : new Date().getMonth() < 6
        ? "Summer"
        : new Date().getMonth() < 9
          ? "Autumn"
          : "Winter"
    }`;

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1; // Adding 1 to get the correct month

  const startTime =
    StartTime ||
    `${currentYear}-${currentMonth - 1 < 10 ? `0${currentMonth - 1}` : currentMonth - 1
    }-01`;
  const endTime = EndTime || `${currentYear}-${currentMonth}-30`;

  const getListSongPeriod = async () => {
    try {
      const response = await axios.post(
        `${Base_URL}/songs/getTopSong?startTime=${startTime}&endTime=${endTime}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      console.log("Song Period", response.data);
      return response.data;
    } catch (error) {
      console.log("Error:", error);
    }
  };

  useEffect(() => {
    console.log("Time Detail", startTime, endTime);
    getListSongPeriod().then((response) => {
      setSongList(response);
    });
  }, [songPage]);

  if (!songList) {
    return (
      <div className="bg-[#FFFFFFCC] rounded-2xl shadow-md max-xl:w-full m-auto xl:h-fit xl:ml-5 xl:mr-5 xl:mt-8 mt-4 pt-3 xl:pt-5 pl-3 xl:pl-5 pr-3 xl:pr-5 pb-3 xl:pb-5">
        <h1 className="text-xl font-bold text-primary">
          Song Chart is updating...
        </h1>
      </div>
    );
  }

  return (
    <div className="bg-[#FFFFFFCC] rounded-2xl shadow-md max-xl:w-full m-auto xl:h-fit xl:ml-5 xl:mr-5 xl:mt-8 mt-4 pt-3 xl:pt-5 pl-3 xl:pl-5 pr-3 xl:pr-5 pb-3 xl:pb-5">
      <div className="flex flex-row items-center justify-center gap-3">
        <h1 className="text-xl font-bold text-primary">{titleSongChart}</h1>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24"
          viewBox="0 -960 960 960"
          width="24"
          fill="#59c26d"
        >
          <path d="m130-200-96-95 347-348 162 162 151-153h-86v-136h318v319H790v-88L543-289 381-451 130-200Z" />
        </svg>
      </div>
      <div className="xl:w-full">
        <div className="flex flex-row items-center justify-between mt-5 mb-5 text-primary">
          <div className="flex flex-row gap-8 ml-8">
            <div className="font-bold text-center ">ID</div>
            <div className="font-bold text-center ">Song Details</div>
          </div>

          <div className="flex flex-row items-center justify-center ">
            <div className="mr-24">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="20"
                viewBox="0 -960 960 960"
                width="20"
                fill="currentColor"
              >
                <path d="M170.87-81.413q-34.483 0-58.742-24.279-24.259-24.278-24.259-58.789v-426.432q0-27.783 13.859-51.902 13.859-24.12 39.402-34.033l534.935-194.565 25.717 69.435-351.804 128.543h439.116q34.819 0 58.928 24.271 24.109 24.271 24.109 58.77v426.264q0 34.5-24.259 58.609-24.259 24.108-58.742 24.108H170.87Zm0-83h618.26v-259.456H170.87v259.456Zm138.035-45.609q40.225 0 68.225-27.774 28-27.775 28-68 0-40.226-27.774-68.226-27.775-28-68-28-40.226 0-68.226 27.775t-28 68q0 40.225 27.775 68.225 27.775 28 68 28ZM170.87-495.869H648v-70.566h72v70.566h69.13v-94.566H170.87v94.566Zm0 331.456v-259.456 259.456Z" />
              </svg>
            </div>
            {/* <div className="font-bold text-center ">Duration</div> */}
          </div>
        </div>
        <div className="flex flex-col gap-2 mt-2">
          {Array.isArray(songList) &&
            songList.slice(0, 10).map((songItem, index) => (
              <div key={index}>
                <SongItem
                  song={songItem.song}
                  songListen={songItem.count}
                  songOrder={index}
                />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default SongChart;
