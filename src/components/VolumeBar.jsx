import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setVolume } from "../redux/slice/volume";
import useIconUtils from "../utils/useIconUtils";

const VolumeBar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { LyricIcon, QueueIcon, VolumeLowIcon, VolumeHighIcon } = useIconUtils();
  const lyric = useSelector((state) => state.music.currentSong.lyric);
  const volume = useSelector((state) => state.volume.volumeValue); // Giả sử âm lượng mặc định là 50%
  const audioRef = useRef();
  const changeVolume = (e) => {
    const newVolume = e.target.value;
    dispatch(setVolume(newVolume));
  };
  // console.log("VolumeBar Lyric ", lyric);
  return (
    <div className="absolute right-0 flex-row items-center justify-center hidden mr-5 xl:flex">
      {/* Lyric Button  */}
      <button
        className={`mr-2 pt-1 text-iconText dark:text-iconTextDark  ${!lyric ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:opacity-70"}`}
        disabled={!lyric}
        onClick={() => navigate("/lyric")}
      >
        <LyricIcon />
      </button>

      {/* Queue Button  */}
      <button className={`mr-2 text-iconText dark:text-iconTextDark hover:opacity-70`} onClick={() => navigate("/queue")}>
        <QueueIcon />
      </button>

      <button className="mr-2 text-iconText dark:text-iconTextDark">
        <VolumeLowIcon></VolumeLowIcon>
      </button>
      <input
        type="range"
        min={-1}
        max={1}
        step={0.02}
        ref={audioRef}
        value={volume}
        onChange={changeVolume}
        className="w-16 h-1 mx-2 rounded-full xl:w-20 xl:mx-4"

      />
      <button className="mr-2 text-iconText dark:text-iconTextDark">
        <VolumeHighIcon></VolumeHighIcon>
      </button>
    </div>
  );
};

export default VolumeBar;
