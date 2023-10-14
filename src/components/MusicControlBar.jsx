/* eslint-disable no-unused-vars */
import DurationBar from "./DurationBar";
import VolumeBar from "./VolumeBar";

const MusicControlBar = () => {
  return (
    <div className="w-full fixed xl:bottom-0 bottom-12 bg-white h-16 xl:h-20 flex flex-row justify-center items-center">
      <div className="flex flex-row absolute justify-center items-center inset-y-auto left-0 ml-5 xl:ml-10">
        <img
          src="https://source.unsplash.com/random"
          alt=""
          className="w-10 h-10 xl:w-14 xl:h-14 bg-[#B9C0DE] rounded-full"
        ></img>
        <div className="ml-1 xl:ml-4">
          <div className="text-xs xl:text-base font-bold text-[#2E3271]">
            Song Name
          </div>
          <div className="text-xs xl:text-base text-[#7C8DB5B8]">
            Artist Name
          </div>
        </div>
      </div>

      <div className="flex flex-row justify-center items-center">
        <DurationBar></DurationBar>
      </div>
      <div className="flex flex-row justify-center items-center">
        <VolumeBar></VolumeBar>
      </div>
    </div>
  );
};

export default MusicControlBar;
