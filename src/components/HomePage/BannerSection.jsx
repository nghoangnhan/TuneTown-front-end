import { useEffect, useState } from "react";
import { useMusicAPIUtils } from "../../utils/useMusicAPIUtils";
import { useNavigate } from "react-router-dom";
import useConfig from "../../utils/useConfig";
import Slider from "react-slick";

const BannerSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const settings = {
    className: "center",
    centerMode: true,
    infinite: true,
    centerPadding: "20px",
    slidesToShow: 3,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    beforeChange: (current, index) => {
      setCurrentSlide(index);
    },

  };
  const userId = localStorage.getItem("userId");
  const [playlistList, setPlaylistList] = useState();
  const { getUserPlaylist } = useMusicAPIUtils();
  const { Base_AVA } = useConfig();
  const navigate = useNavigate();
  const navigateToPlaylist = (playlistId) => {
    navigate(`/detail-playlist/${playlistId}`);
  };
  useEffect(() => {
    getUserPlaylist(userId).then((data) => {
      setPlaylistList(data);
    });
  }, []);
  return (
    <div className="mx-2 overflow-hidden rounded-md slider-container max-w-7xl max-h-80">
      <Slider {...settings} >
        {playlistList && playlistList.slice(0, 5).map((playlistItem, index) => (
          <div className={`${currentSlide === index ? "opacity-100" : "opacity-40"} relative ease-in transition-opacity duration-1000 flex items-center w-full h-full rounded-lg cursor-pointer`}
            key={index}
          >
            <img
              className="relative object-cover m-auto rounded-lg shadow-md cursor-pointer max-h-80 h-fit min-w-fit"
              onClick={() => navigateToPlaylist(playlistItem.id)}
              src={
                playlistItem.coverArt
                  ? playlistItem.coverArt
                  : Base_AVA
              }
              alt="playlist-cover"
            ></img>

            <div className={`${currentSlide === index ? "opacity-100" : "opacity-10"} ease-in-out transition-opacity duration-1000 absolute bottom-0 left-0 right-0 flex items-center justify-center h-20 bg-gradient-to-t from-green-400 dark:from-slate-700 to-transparent`}>
              <div className="absolute text-center text-primaryTextDark2 bottom-1 dark:text-primaryHoverOn">
                <div className="text-lg font-bold">{playlistItem.playlistName}</div>
                <div className="text-sm">{playlistItem.artistName}</div>
              </div>
            </div>
          </div>
        ))
        }
      </Slider>
    </div>
  );
};
export default BannerSection;
