import { useNavigate } from "react-router-dom";

// PlaylistItem component -> Detail page -> SongSection Component
// eslint-disable-next-line react/prop-types, no-unused-vars
const PlaylistItem = ({ id, playlistName, playlistType, coverArt }) => {
  const navigate = useNavigate();

  return (
    <div
      className="w-fit h-fit border-[1px] rounded-lg border-solid border-primaryLight bg-white hover:bg-primaryLighter cursor-pointer"
      onClick={() => navigate(`/detail/${id}`)}
    >
      <div className="pb-3 bg-transparent rounded-lg xl:w-fit xl:h-fit w-fit h-fit">
        <img
          className="ml-[13px] xl:ml-[15px] mt-[15px] mr-[15px] xl:w-[150px] xl:h-[150px] w-[102px] h-[90px] rounded-lg object-cover"
          alt="Album cover"
          src={
            coverArt
              ? coverArt
              : `https://i.pinimg.com/550x/f8/87/a6/f887a654bf5d47425c7aa5240239dca6.jpg`
          }
        />
        <div className="ml-[13px] xl:ml-[15px] mt-[10px] text-primary font-bold text-lg">
          {playlistName}
        </div>
        <div className="ml-[13px] xl:ml-[15px] mt-1 text-primary">
          {playlistType} <span className="text-primaryLight">#{id}</span>
        </div>
      </div>
    </div>
  );
};

export default PlaylistItem;
