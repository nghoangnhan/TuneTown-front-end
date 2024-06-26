/* eslint-disable no-unused-vars */
import axios from "axios";
import "../../assets/CSS/ReactContexify.css";
import { useEffect, useState } from "react";
import UseCookie from "../../hooks/useCookie";
import SongItem from "../Song/SongItem";
import useConfig from "../../utils/useConfig";
import useIconUtils from "../../utils/useIconUtils";
import { useTranslation } from "react-i18next";

// eslint-disable-next-line react/prop-types
const SongChart = ({ titleSong, StartTime, EndTime, inForum }) => {
  const { getToken } = UseCookie();
  const { access_token } = getToken();
  const { Base_URL } = useConfig();
  const { t } = useTranslation();
  const { ListenIcon, TrendingIcon } = useIconUtils();
  const [songList, setSongList] = useState([]);
  const [songPage, setSongPage] = useState(1);

  const titleSongChart = titleSong
    ? titleSong
    : `${t("home.top10songs")} ${new Date().getMonth() < 3
      ? t("home.spring")
      : new Date().getMonth() < 6
        ? t("home.summer")
        : new Date().getMonth() < 9
          ? t("home.autumn")
          : t("home.winter")
    }`;


  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1; // Adding 1 to get the correct month

  const startTime =
    StartTime ||
    `${currentYear}-${currentMonth - 1 < 10 ? `0${currentMonth - 1}` : currentMonth - 1
    }-01`;
  const endTime =
    EndTime ||
    `${currentYear}-${currentMonth < 10 ? `0${currentMonth}` : currentMonth
    }-30`;

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
      // console.log("Song Period", response.data);
      return response.data;
    } catch (error) {
      console.log("Error:", error);
    }
  };

  useEffect(() => {
    // console.log("Time Detail", startTime, endTime);
    getListSongPeriod().then((response) => {
      setSongList(response);
    });
  }, [songPage]);

  if (!songList) {
    return (
      <div className="px-3 py-3 m-auto mx-1 mt-4 shadow-md bg-backgroundComponentPrimary dark:bg-backgroundComponentDarkPrimary rounded-2xl xl:h-fit xl:mx-5 xl:mt-8 xl:py-5 xl:px-5">
        <h1 className="text-xl font-bold text-primary">
          {t("home.songChartUpdating")}
        </h1>
      </div>
    );
  }

  return (
    <div
      className={`bg-backgroundComponentPrimary dark:bg-backgroundComponentDarkPrimary rounded-2xl shadow-md mt-4 py-3 xl:py-5 px-2 xl:h-fit xl:mx-2 xl:mt-8  ${inForum ? "min-w-[500px]" : "min-w-[250px]"
        }`}
    >
      <div className="flex flex-row items-center justify-center gap-3">
        <h1 className="text-3xl font-bold text-center text-primary dark:text-primaryDarkmode">{titleSongChart}</h1>
        <TrendingIcon></TrendingIcon>
      </div>
      <div className="xl:w-full">
        <div className="flex flex-row items-center justify-between mt-5 mb-5 text-primary dark:text-primaryDarkmode">
          <div className="flex flex-row gap-8 ml-8">
            <div className="font-bold text-center ">#</div>
            <div className="font-bold text-center ">{t("song.title")}</div>
          </div>

          <div className="flex flex-row items-center justify-center ">
            <div className="mr-16">
              <ListenIcon></ListenIcon>
            </div>
            {/* <div className="font-bold text-center ">Duration</div> */}
          </div>
        </div>
        <div className="flex flex-col gap-2 mt-2 overflow-auto max-h-[470px]">
          {Array.isArray(songList) &&
            songList.slice(0, 10).map((songItem, index) => (
              <div key={index}>
                <SongItem
                  song={songItem.song}
                  songListen={songItem.count}
                  songOrder={index + 1}
                  chart={true}
                />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default SongChart;
