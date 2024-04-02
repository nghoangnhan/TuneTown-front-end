/* eslint-disable no-unused-vars */
import { useSelector } from "react-redux";
import { useMediaQuery } from "react-responsive";
import DurationBar from "./DurationBar";
import VolumeBar from "./VolumeBar";
import useSongUtils from "../utils/useSongUtils";
import DefaultArt from "../assets/img/logo/logo.png";

const MusicControlBar = () => {
  const songInfor = useSelector((state) => state.music.currentSong);
  // Check Screen Size Mobile
  const isSmallScreen = useMediaQuery({ query: "(max-width: 640px)" });
  const { showArtistV2, AcronymName } = useSongUtils();

  return (
    <div className="w-full fixed xl:bottom-0 bottom-10 bg-white h-[88px] xl:h-20 flex flex-row justify-center items-center pt-2">
      <div className="absolute inset-y-auto left-0 flex flex-row items-center justify-center ml-2 bottom-10 xl:bottom-3 xl:ml-10">
        <img
          src={songInfor.songCover ? songInfor.songCover : DefaultArt}
          alt=""
          className="w-10 h-10 xl:w-14 xl:h-14 bg-[#B9C0DE] rounded-full"
        ></img>
        <div className="ml-1 xl:ml-4">
          <div className="text-xs xl:text-base font-bold text-[#2E3271]">
            {isSmallScreen && AcronymName(songInfor.songName, 12)}
            {!isSmallScreen && songInfor.songName}
          </div>
          <div className="text-xs xl:text-base text-[#7C8DB5B8]">
            {isSmallScreen && AcronymName(showArtistV2(songInfor.artists), 10)}
            {!isSmallScreen && AcronymName(showArtistV2(songInfor.artists), 28)}
          </div>
        </div>
      </div>

      <div className="flex flex-row items-center justify-center max-sm:absolute">
        <DurationBar></DurationBar>
      </div>
      <div className="flex flex-row items-center justify-center">
        <VolumeBar></VolumeBar>
      </div>
    </div>
  );
};

export default MusicControlBar;
