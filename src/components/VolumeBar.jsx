import { useRef } from "react";
import { setVolume } from "../redux/slice/volume";
import { useDispatch, useSelector } from "react-redux";

const VolumeBar = () => {
  const dispatch = useDispatch();

  const volume = useSelector((state) => state.volume.volumeValue); // Giả sử âm lượng mặc định là 50%
  const audioRef = useRef();
  const changeVolume = (e) => {
    const newVolume = e.target.value;
    dispatch(setVolume(newVolume));
    console.log(volume);
    // Điều hướng đến âm lượng mới trong bài hát
    // Ví dụ: audioElement.current.volume = newVolume;
  };
  // Change volume in the system

  return (
    <div className="hidden xl:flex flex-row absolute justify-center items-center inset-y-auto right-0 mr-5">
      <button>
        <svg
          fill="#887D7D"
          width="24px"
          height="24px"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M18.83,9.17a1,1,0,1,0-1.42,1.42A2,2,0,0,1,18,12a2,2,0,0,1-.71,1.53,1,1,0,0,0-.13,1.41,1,1,0,0,0,1.41.12A4,4,0,0,0,20,12,4.06,4.06,0,0,0,18.83,9.17ZM14.43,4.1a1,1,0,0,0-1,.12L8.65,8H5A1,1,0,0,0,4,9v6a1,1,0,0,0,1,1H8.65l4.73,3.78A1,1,0,0,0,14,20a.91.91,0,0,0,.43-.1A1,1,0,0,0,15,19V5A1,1,0,0,0,14.43,4.1ZM13,16.92l-3.38-2.7A1,1,0,0,0,9,14H6V10H9a1,1,0,0,0,.62-.22L13,7.08Z" />
        </svg>
      </button>
      <input
        type="range"
        min="0"
        ref={audioRef}
        max={100}
        value={volume}
        onChange={changeVolume}
        className="w-16 xl:w-20 h-1 xl:h-1 bg-[#B9C0DE] mx-2 xl:mx-4 rounded-full"
      />
      <button>
        <svg
          fill="#887D7D"
          width="24px"
          height="24px"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12.43,4.1a1,1,0,0,0-1,.12L6.65,8H3A1,1,0,0,0,2,9v6a1,1,0,0,0,1,1H6.65l4.73,3.78A1,1,0,0,0,12,20a.91.91,0,0,0,.43-.1A1,1,0,0,0,13,19V5A1,1,0,0,0,12.43,4.1ZM11,16.92l-3.38-2.7A1,1,0,0,0,7,14H4V10H7a1,1,0,0,0,.62-.22L11,7.08ZM19.66,6.34a1,1,0,0,0-1.42,1.42,6,6,0,0,1-.38,8.84,1,1,0,0,0,.64,1.76,1,1,0,0,0,.64-.23,8,8,0,0,0,.52-11.79ZM16.83,9.17a1,1,0,1,0-1.42,1.42A2,2,0,0,1,16,12a2,2,0,0,1-.71,1.53,1,1,0,0,0-.13,1.41,1,1,0,0,0,1.41.12A4,4,0,0,0,18,12,4.06,4.06,0,0,0,16.83,9.17Z" />
        </svg>
      </button>
    </div>
  );
};

export default VolumeBar;
