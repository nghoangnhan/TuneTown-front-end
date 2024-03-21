import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setVolume } from "../redux/slice/volume";

const VolumeBar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const lyric = useSelector((state) => state.music.currentSong.lyric);
  const volume = useSelector((state) => state.volume.volumeValue); // Giả sử âm lượng mặc định là 50%
  const audioRef = useRef();
  const changeVolume = (e) => {
    const newVolume = e.target.value;
    dispatch(setVolume(newVolume));
  };

  return (
    <div className="hidden xl:flex flex-row absolute justify-center items-center inset-y-auto right-0 mr-5">
      {/* Lyric Button  */}
      <button
        className={`mr-2 mt-1`}
        disabled={!lyric}
        onClick={() => navigate("/lyric")}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24"
          viewBox="0 -960 960 960"
          width="24"
          fill={`${!lyric ? "#cfc9c9" : "#887D7D"}`}
        >
          <path d="M171.539-318.077v-484.038V-318.077Zm-55.96 184.766v-656.496q0-28.257 20.006-48.263 20.006-20.006 48.263-20.006h419.421q28.257 0 48.263 20.006 20.006 20.006 20.006 48.263v17.577q-16.231 7.692-30.172 18.215-13.942 10.524-25.788 23.437v-59.229q0-5.192-3.462-8.75t-8.847-3.558H183.848q-5.385 0-8.847 3.558-3.462 3.558-3.462 8.75v471.73h431.73q5.385 0 8.847-3.462 3.462-3.462 3.462-8.847v-139.229q11.846 12.988 25.788 23.571 13.941 10.582 30.172 18.082v97.576q0 28.438-20.006 48.353-20.006 19.916-48.263 19.916H244.385L115.579-133.311Zm149.999-278.805h135.961v-55.96H265.578v55.96Zm486.734-80q-44.966 0-76.427-31.513-31.462-31.514-31.462-76.423 0-44.909 31.426-76.467 31.426-31.557 76.21-31.557 15.172 0 27.46 3.827 12.289 3.827 24.904 12.443v-216.27h135.96v55.96h-80V-600q0 44.888-31.553 76.386-31.553 31.498-76.518 31.498Zm-486.734-40h255.961v-55.96H265.578v55.96Zm0-120h255.961v-55.96H265.578v55.96Z" />
        </svg>
      </button>

      {/* Queue Button  */}
      <button className="mr-2" onClick={() => navigate("/queue")}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="#887D7D"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z"
          />
        </svg>
      </button>

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
        min={-1}
        max={1}
        step={0.02}
        ref={audioRef}
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
