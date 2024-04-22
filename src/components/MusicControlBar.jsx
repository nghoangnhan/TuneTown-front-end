/* eslint-disable no-unused-vars */
import { useSelector } from "react-redux";
import DurationBar from "./DurationBar";
import VolumeBar from "./VolumeBar";
import useSongUtils from "../utils/useSongUtils";
import DefaultArt from "../assets/img/logo/logo.png";
import useConfig from "../utils/useConfig";

const MusicControlBar = () => {
  const songInfor = useSelector((state) => state.music.currentSong);
  // Check Screen Size Mobile
  const { isMobile } = useConfig();
  const { showArtistV2, AcronymName, NavigateSong } = useSongUtils();

  return (
    <div className="w-full fixed xl:bottom-0 bottom-9 bg-backgroundMusicControl dark:bg-backgroundDarkMusicControl h-[88px] xl:h-20 flex flex-col xl:flex-row justify-center items-center pt-2">
      {/* Song Info  */}
      <div className="relative inset-y-auto left-0 flex flex-row items-center justify-center ml-2 xl:absolute xl:bottom-3 xl:ml-10">
        <img
          src={songInfor.songCover ? songInfor.songCover : DefaultArt}
          alt=""
          className="w-10 h-10 rounded-full xl:w-14 xl:h-14"
        ></img>
        <div className="ml-1 xl:ml-4">
          <div className="text-xs font-bold cursor-pointer xl:text-base text-primary dark:text-primaryDarkmode" onClick={() => NavigateSong(songInfor.id)}>
            {isMobile && AcronymName(songInfor.songName, 12)}
            {!isMobile && songInfor.songName}
          </div>
          <div className="text-xs cursor-pointer xl:text-base text-primaryText dark:text-primaryTextDark" >
            {isMobile && AcronymName(showArtistV2(songInfor.artists), 10)}
            {!isMobile && AcronymName(showArtistV2(songInfor.artists), 28)}
          </div>
        </div>
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
        <div className="relative flex flex-row items-center justify-center">
          <DurationBar></DurationBar>
        </div>
      }
    </div>
  );
};

export default MusicControlBar;
