/* eslint-disable no-unused-vars */
import { useSelector } from "react-redux";
import DurationBar from "./DurationBar";
import VolumeBar from "./VolumeBar";
import useSongUtils from "../utils/useSongUtils";
import DefaultArt from "../assets/img/logo/logo.png";
import useConfig from "../utils/useConfig";
import NavigationBar from "./NavigationBar";
import { useNavigate } from "react-router-dom";
import useIconUtils from "../utils/useIconUtils";

const MusicControlBar = () => {
  const songInfor = useSelector((state) => state.music.currentSong);
  // Check Screen Size Mobile
  const { isMobile } = useConfig();
  const navigate = useNavigate();
  const { QueueIcon, LyricIcon } = useIconUtils();
  const currentSong = useSelector((state) => state.music.currentSong);
  const lyric = useSelector((state) => state.music.currentSong.lyric);
  const { showArtistV2, AcronymName, NavigateSong } = useSongUtils();

  return (
    <div className="fixed bottom-0 flex flex-col items-center justify-center w-full py-2 bg-backgroundMusicControl dark:bg-backgroundDarkMusicControl h-fit xl:h-20 xl:flex-row">
      {/* Song Info  */}
      <div className="relative inset-y-auto left-0 flex flex-row items-center justify-start xl:absolute xl:bottom-3 xl:ml-10">
        <img
          src={songInfor.songCover ? songInfor.songCover : DefaultArt}
          alt=""
          className="w-10 h-10 rounded-full xl:w-14 xl:h-14"
        ></img>
        <div className="ml-1 xl:ml-4">
          <div className="text-sm font-bold cursor-pointer xl:text-base text-primary dark:text-primaryDarkmode" onClick={() => NavigateSong(songInfor.id)}>
            {isMobile && AcronymName(songInfor.songName, 18)}
            {!isMobile && songInfor.songName}
          </div>
          <div className="text-xs cursor-pointer xl:text-base text-primaryText dark:text-primaryTextDark" >
            {isMobile && AcronymName(showArtistV2(songInfor.artists), 10)}
            {!isMobile && AcronymName(showArtistV2(songInfor.artists), 28)}
          </div>
        </div>

        {isMobile && (
          <div className="flex flex-row ml-5">
            <button
              className={`mr-2 pt-1 text-iconText dark:text-iconTextDark  ${!lyric
                ? "cursor-not-allowed opacity-50"
                : "cursor-pointer hover:opacity-70"
                }`}
              disabled={!lyric}
              onClick={() => navigate("/lyric")}
            >
              <LyricIcon />
            </button>
            <button
              className={`mr-2 text-iconText dark:text-iconTextDark hover:opacity-70`}
              onClick={() => navigate("/queue")}
            >
              <QueueIcon />
            </button>
          </div>
        )}
      </div>

      {!isMobile &&
        <div className="flex flex-row justify-center">
          <div className="flex flex-row items-center justify-center">
            <DurationBar></DurationBar>
          </div>
          <div className="flex flex-row items-center justify-center">
            <VolumeBar></VolumeBar>
          </div>
        </div>
      }

      {isMobile &&
        <div className="relative flex flex-col items-center justify-center">
          <DurationBar></DurationBar>
          <NavigationBar></NavigationBar>
        </div>
      }
    </div>
  );
};

export default MusicControlBar;
