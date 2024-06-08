import { useEffect, useState } from "react";
import { useMusicAPIUtils } from "../../utils/useMusicAPIUtils";
import { useNavigate } from "react-router-dom";
import useConfig from "../../utils/useConfig";
import Slider from "react-slick";
import PropTypes from "prop-types";

const BannerSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  // const userId = localStorage.getItem("userId");
  const [playlistList, setPlaylistList] = useState([]);
  const { getRecommendPlaylist } = useMusicAPIUtils();
  const { Base_AVA } = useConfig();
  const navigate = useNavigate();
  const checkPlaylistBelow5 = playlistList && playlistList.length < 5 ? true : false;
  const settings = {
    className: "center",
    centerMode: true,
    infinite: checkPlaylistBelow5 ? false : true,
    centerPadding: "20px",
    slidesToShow: checkPlaylistBelow5 ? 1 : 3,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    beforeChange: (current, index) => {
      setCurrentSlide(index);
    },
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: checkPlaylistBelow5 ? 1 : 3,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
    // Arrow 
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  const navigateToPlaylist = (playlistId) => {
    navigate(`/detail-playlist/${playlistId}`);
  };
  useEffect(() => {
    getRecommendPlaylist().then((data) => {
      setPlaylistList(data);
      console.log(playlistList);
    });
  }, []);
  return (
    <div className="w-full overflow-hidden rounded-md slider-container">
      <Slider {...settings} >
        {playlistList && playlistList.slice(0, 5).map((playlistItem, index) => (
          <div className={`${currentSlide === index ? "opacity-100" : "opacity-40"} relative ease-in transition-opacity duration-1000 flex items-center min-h-fit w-full h-full rounded-lg cursor-pointer`}
            key={index}
          >
            <img
              className="relative max-w-xl m-auto rounded-lg shadow-md cursor-pointer min-h-[300px] object-cover min-w-fit"
              onDoubleClick={() => navigateToPlaylist(playlistItem.id)}
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
const NextArrow = ({ onClick }) => {
  return (
    <div
      className="absolute right-0 z-50 flex items-center justify-center w-10 h-10 rounded-lg cursor-pointer top-1/2 text-primary hover:opacity-60 "
      onClick={onClick}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5l7 7-7 7"
        />
      </svg>
    </div>
  );
}
const PrevArrow = ({ onClick }) => {
  return (
    <div
      className="absolute left-0 z-50 flex items-center justify-center w-10 h-10 rounded-lg cursor-pointer top-1/2 text-primary hover:opacity-60 "
      onClick={onClick}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 19l-7-7 7-7"
        />
      </svg>
    </div>
  );
}

NextArrow.propTypes = {
  onClick: PropTypes.func,
};
PrevArrow.propTypes = {
  onClick: PropTypes.func,
};
export default BannerSection;
