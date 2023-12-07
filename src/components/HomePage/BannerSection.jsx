import { Carousel } from "antd";
import { useEffect, useState } from "react";
import { useMusicAPI } from "../../utils/songUtils";
import { useNavigate } from "react-router-dom";

const BannerSection = () => {
  const userId = localStorage.getItem("userId");
  const [playlistList, setPlaylistList] = useState();
  const { getUserPlaylist } = useMusicAPI();
  const navigate = useNavigate();
  const navigateToPlaylist = (playlistId) => {
    navigate(`/detail/${playlistId}`);
  };
  useEffect(() => {
    getUserPlaylist(userId).then((data) => {
      setPlaylistList(data);
    });
  }, []);
  return (
    <div className="max-w-7xl max-h-80 overflow-hidden rounded-md mx-2">
      <Carousel autoplay>
        {
          // Get First 4 playlist
          playlistList &&
            playlistList.slice(0, 5).map((playlistItem) => (
              <div
                className="w-fit h-[400px] flex items-center rounded-lg"
                key={playlistItem.id}
              >
                <img
                  className="w-fit h-full m-auto object-cover rounded-lg cursor-pointer"
                  onClick={() => navigateToPlaylist(playlistItem.id)}
                  src={
                    playlistItem.coverArt
                      ? playlistItem.coverArt
                      : "https://i.pinimg.com/550x/f8/87/a6/f887a654bf5d47425c7aa5240239dca6.jpg"
                  }
                  alt="playlist-cover"
                />
              </div>
            ))
        }
      </Carousel>
    </div>
  );
};
export default BannerSection;
