import { Carousel } from "antd";
import { useEffect, useState } from "react";
import { useMusicAPIUtils } from "../../utils/useMusicAPIUtils";
import { useNavigate } from "react-router-dom";

const BannerSection = () => {
  const userId = localStorage.getItem("userId");
  const [playlistList, setPlaylistList] = useState();
  const { getUserPlaylist } = useMusicAPIUtils();
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
    <div className="mx-2 overflow-hidden rounded-md max-w-7xl max-h-80">
      <Carousel autoplay autoplaySpeed={3000}>
        {
          // Get First 4 playlist
          playlistList &&
          playlistList.slice(0, 5).map((playlistItem) => (
            <div
              className="w-fit h-[400px] flex items-center rounded-lg"
              key={playlistItem.id}
            >
              <img
                className="relative object-cover h-full m-auto rounded-lg cursor-pointer w-fit"
                onClick={() => navigateToPlaylist(playlistItem.id)}
                src={
                  playlistItem.coverArt
                    ? playlistItem.coverArt
                    : "https://i.pinimg.com/550x/f8/87/a6/f887a654bf5d47425c7aa5240239dca6.jpg"
                }
                alt="playlist-cover"
              />

              <div className="absolute text-2xl font-bold text-white bottom-10 left-10">
                {playlistItem.playlistName}
              </div>
              <div className="absolute text-sm font-bold text-white bottom-2 left-10">
                {playlistItem.artistName}
              </div>
            </div>
          ))
        }
      </Carousel>
    </div>
  );
};
export default BannerSection;
