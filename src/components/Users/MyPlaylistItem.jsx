import { useNavigate } from "react-router-dom";
import useConfig from "../../utils/useConfig";

// eslint-disable-next-line react/prop-types, no-unused-vars
const MyPlaylistItem = ({ id, playlistName, playlistType, coverArt }) => {
  const navigate = useNavigate();
  const { default_Img } = useConfig();
  return (
    <div
      className="border border-solid rounded-lg shadow-xl cursor-pointer w-fit h-fit border-primary dark:border-primaryDarkmode bg-backgroundPlaylist hover:bg-backgroundPlaylistHover dark:bg-backgroundPlaylistDark hover:dark:bg-backgroundPlaylistHoverDark"
      onClick={() => {
        navigate(`/my-detail-playlist/${id}`);
        localStorage.setItem("myPlaylistId", id);
      }}
    >
      <div className="px-2 pb-3 bg-transparent rounded-lg xl:w-fit xl:h-fit w-fit h-fit">
        <img
          className="mt-3 shadow-lg mx-3 xl:mx-3 xl:mt-5 w-[150px] h-[150px] xl:w-[200px] xl:h-[200px] rounded-lg object-cover"
          alt="Album cover"
          src={
            coverArt
              ? coverArt
              : default_Img
          }
        />
        <div className="mt-[10px] text-primary dark:text-primaryDarkmode font-bold text-lg">
          {playlistName}
        </div>
        <div className="mt-1 text-primary dark:text-primaryDarkmode">
          {playlistType} <span className="text-primaryLight">#{id}</span>
        </div>
      </div>
    </div>
  );
};

export default MyPlaylistItem;
